"""
nasa_game/scenes/launch_scene.py
Jr_AstroCamp Rocket Launch Simulator.
Vibrant PUBG-quality visuals: parallax sky, glowing exhaust plumes,
dynamic callouts, animated guidance arrows for kids aged 3–19.
Controls: W/S or UP/DOWN = Throttle | A/D = Pitch | SPACE = Stage Sep
"""
import math
import random
from typing import Callable, List, Tuple
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.graphics import SPRITES, ParticleSystem, ScreenShake
from nasa_game.ui import (
    COLOR_BG, COLOR_PANEL, COLOR_CYAN, COLOR_GOLD, COLOR_EMERALD, COLOR_RED,
    COLOR_ORANGE, COLOR_PURPLE, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_gauge, draw_arrow_hint, draw_star_field,
)


class DroppedStage:
    def __init__(self, x, y, vx, vy, angle, rot_speed, sprite):
        self.x, self.y = x, y
        self.vx, self.vy = vx, vy
        self.angle = angle
        self.rot_speed = rot_speed
        self.sprite = sprite
        self.life = 7.0

    def update(self, dt):
        self.vy += 8.0 * dt
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.angle += self.rot_speed * dt
        self.life -= dt
        return self.life > 0

    def draw(self, surface):
        rot_surf = pygame.transform.rotate(self.sprite, self.angle)
        rect = rot_surf.get_rect(center=(int(self.x), int(self.y)))
        surface.blit(rot_surf, rect)


class LaunchScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission  = mission
        self.on_finish = on_finish
        self.t = 0.0

        # ── Rocket Physics ──────────────────────────────────────────────
        self.x         = 512.0
        self.y         = 540.0
        self.altitude_km  = 0.0
        self.velocity_kms = 0.0
        self.pitch_deg    = 90.0   # 90 = vertical
        self.throttle     = 0.0
        self.fuel         = self.mission.params.get('fuel', 132.0)
        self.max_fuel     = self.fuel
        self.stage        = 1
        self.has_staging  = bool(self.mission.params.get('has_staging', 0.0))
        self.time_left    = self.mission.params.get('time_limit', 120.0)
        self.mission_elapsed = 0.0

        self.target_alt = self.mission.params.get('target_alt', 155.0)
        self.target_vel = self.mission.params.get('target_vel', 5.9)

        # ── FX ─────────────────────────────────────────────────────────
        self.particles = ParticleSystem()
        self.shake     = ScreenShake()
        self.dropped_stages: List[DroppedStage] = []

        # ── Background ──────────────────────────────────────────────────
        self.pad_world_y = 660.0
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.8, 2.2))
            for _ in range(140)
        ]
        # Clouds (appear at low altitude)
        self.clouds = [
            {'x': random.uniform(-50, self.W+50),
             'y': random.uniform(100, 500),
             'w': random.randint(80, 200),
             'h': random.randint(25, 55),
             'speed': random.uniform(8, 22)}
            for _ in range(8)
        ]

        # ── Callout / Tutorial ──────────────────────────────────────────
        self.callout_text  = "🚀 PRESS W or ↑ to THROTTLE UP!"
        self.callout_timer = 5.0
        self.callout_color = COLOR_GOLD

        # Tutorial guide – shown while altitude < 5 km
        self.show_tutorial = True
        self.tut_timer = 0.0

        self.is_over = False

        # ── Fonts ───────────────────────────────────────────────────────
        self.font_hud   = pygame.font.SysFont("arial", 13, bold=True)
        self.font_large = pygame.font.SysFont("arial", 20, bold=True)
        self.font_call  = pygame.font.SysFont("arial", 16, bold=True)
        self.font_tut   = pygame.font.SysFont("arial", 22, bold=True)

    def handle_event(self, event: pygame.event.Event):
        if self.is_over:
            return
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if self.has_staging and self.stage == 1 and self.altitude_km > 40:
                    self.stage = 2
                    s1_surf = SPRITES['saturn_stage1']
                    rad = math.radians(self.pitch_deg - 90)
                    drop_vx = -math.sin(rad) * 20.0 + random.uniform(-8, 8)
                    drop_vy = math.cos(rad) * 35.0
                    self.dropped_stages.append(
                        DroppedStage(self.x, self.y + 40, drop_vx, drop_vy,
                                     90.0 - self.pitch_deg, random.uniform(-15, 15), s1_surf)
                    )
                    self.particles.emit_explosion(self.x, self.y + 20, count=30)
                    self.shake.trigger(10.0, 0.5)
                    sound_engine.play('thruster')
                    self._callout("💥 STAGE 1 AWAY! S-II ENGINES IGNITE!", COLOR_ORANGE, 3.5)

    def _callout(self, text: str, color=None, duration: float = 3.0):
        self.callout_text  = text
        self.callout_timer = duration
        self.callout_color = color or COLOR_GOLD

    def update(self, dt: float):
        if self.is_over:
            return

        self.t += dt
        self.time_left -= dt
        self.mission_elapsed += dt
        self.callout_timer -= dt
        self.tut_timer += dt

        if self.time_left <= 0:
            self._end_game(False, "⏰ Time's up! Didn't reach orbit in time.")
            return

        keys = pygame.key.get_pressed()

        # Throttle
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            self.throttle = min(1.0, self.throttle + dt * 2.0)
            if self.altitude_km < 1 and self.show_tutorial:
                self._callout("🔥 ENGINES FIRING! Keep throttle UP!", COLOR_EMERALD, 2.5)
        elif keys[pygame.K_DOWN] or keys[pygame.K_s]:
            self.throttle = max(0.0, self.throttle - dt * 2.0)

        # Pitch
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.pitch_deg = min(90.0, self.pitch_deg + dt * 25.0)
            self.particles.emit_rcs(self.x + 12, self.y - 15, 45, 0, count=2)
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.pitch_deg = max(5.0, self.pitch_deg - dt * 25.0)
            self.particles.emit_rcs(self.x - 12, self.y - 15, -45, 0, count=2)

        # Engine FX
        if self.throttle > 0.1 and self.fuel > 0:
            self.shake.trigger(self.throttle * 4.0, 0.1)
            if math.fmod(self.mission_elapsed, 0.4) < 0.1:
                sound_engine.play('rocket')

        # Fuel & Thrust
        if self.throttle > 0 and self.fuel > 0:
            burn_rate = (12.0 if self.stage == 1 else 9.0) * self.throttle
            self.fuel = max(0.0, self.fuel - dt * burn_rate)

            thrust_accel = (32.0 if self.stage == 1 else 26.0) * self.throttle
            rad = math.radians(self.pitch_deg)
            drag = (self.velocity_kms ** 1.8) * math.exp(-self.altitude_km / 40.0) * 0.35
            gravity_drag = 9.81 * math.sin(rad) * 0.06
            net_accel = max(-1.5, (thrust_accel * 0.09) - drag - gravity_drag)
            self.velocity_kms = max(0.0, self.velocity_kms + net_accel * dt)

            v_vert = self.velocity_kms * math.sin(rad)
            self.altitude_km += v_vert * dt * 8.0

            # Particles
            tail_y = self.y + (55 if self.stage == 1 else 30)
            rot_angle = 90.0 - self.pitch_deg
            self.particles.emit_flame(self.x, tail_y, rot_angle,
                                      speed=300.0 * self.throttle,
                                      count=int(5 * self.throttle + 2))
            if self.altitude_km < 50.0:
                self.particles.emit_smoke(self.x, tail_y + 18, count=2)
        else:
            self.throttle = 0.0
            if self.altitude_km > 0:
                drag = (self.velocity_kms ** 1.8) * math.exp(-self.altitude_km / 40.0) * 0.25
                self.velocity_kms = max(0.0, self.velocity_kms - drag * dt)

        # Clouds scroll
        alt_f = min(1.0, self.altitude_km / 120.0)
        for cl in self.clouds:
            cl['x'] += cl['speed'] * dt
            if cl['x'] > self.W + 150:
                cl['x'] = -200

        # Milestone callouts
        if 15 < self.altitude_km < 35 and "MAX-Q" not in self.callout_text:
            self._callout("⚡ MAX-Q! Maximum air pressure — hold on!", COLOR_ORANGE, 3.0)
            sound_engine.play('quindar')
        elif self.altitude_km >= 100 and "KARMAN" not in self.callout_text:
            self._callout("🌌 YOU PASSED THE KARMAN LINE — YOU'RE IN SPACE! 🎉", COLOR_EMERALD, 4.0)
            sound_engine.play('quindar')
        elif self.has_staging and self.stage == 1 and self.altitude_km > 40 and "STAGE" not in self.callout_text:
            self._callout("🔴 PRESS SPACE to drop Stage 1!", COLOR_CYAN, 4.0)

        # Tutorial auto-hide
        if self.altitude_km > 8:
            self.show_tutorial = False

        # Update FX
        self.particles.update(dt)
        self.shake.update(dt)
        self.dropped_stages = [s for s in self.dropped_stages if s.update(dt)]

        # Check success
        if self.altitude_km >= 100.0 and self.velocity_kms >= self.target_vel and self.pitch_deg <= 30.0:
            self._end_game(True, f"🎉 PERFECT ORBITAL INSERTION! {self.altitude_km:.0f} km at {self.velocity_kms:.1f} km/s")
            return
        if self.altitude_km >= self.target_alt and self.velocity_kms >= self.target_vel * 0.85:
            self._end_game(True, f"🚀 MISSION SUCCESS! Orbit: {self.altitude_km:.0f} km")
            return
        if self.fuel <= 0.0 and self.time_left < self.mission.params.get('time_limit', 120) - 15:
            if self.velocity_kms >= self.target_vel * 0.85 and self.altitude_km >= 110.0:
                self._end_game(True, f"✅ ORBIT ON COAST! Apogee {self.altitude_km:.0f} km")
            elif self.time_left < 5:
                self._end_game(False, f"💨 Out of fuel & time. Reached {self.altitude_km:.0f} km at {self.velocity_kms:.2f} km/s")

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        sound_engine.stop('rocket')
        if success:
            sound_engine.play('victory')
            alt_score  = int(min(1.0, self.altitude_km / self.target_alt) * 400)
            vel_score  = int(min(1.0, self.velocity_kms / self.target_vel) * 400)
            fuel_bonus = int((self.fuel / max(1.0, self.max_fuel)) * 200)
            score = alt_score + vel_score + fuel_bonus
        else:
            sound_engine.play('alarm')
            score = int((self.altitude_km / max(1.0, self.target_alt)) * 300)
        self.on_finish(success, score, reason)

    # ── Drawing ─────────────────────────────────────────────────────────────

    def draw(self, surface: pygame.Surface):
        alt_f = min(1.0, self.altitude_km / 120.0)

        # Dynamic sky gradient
        sky_r = int(12 * (1 - alt_f) + 2 * alt_f)
        sky_g = int(120 * (1 - alt_f) + 4 * alt_f)
        sky_b = int(200 * (1 - alt_f) + 10 * alt_f)
        surface.fill((sky_r, sky_g, sky_b))

        # Stars (fade in above 15 km)
        if alt_f > 0.1:
            star_alpha_f = min(1.0, (alt_f - 0.1) / 0.4)
            for sx, sy, sb, spd in self.stars:
                v = int(sb * 220 * star_alpha_f)
                v = max(0, min(255, v))
                pygame.draw.circle(surface, (v, v, min(255, v+30)), (sx, sy), 1 if sb < 0.5 else 2)

        # Clouds (low altitude)
        if alt_f < 0.5:
            cloud_alpha = int(255 * max(0.0, 1.0 - alt_f * 3.0))
            for cl in self.clouds:
                pad_y = int(self.pad_world_y + self.altitude_km * 35.0)
                scr_y = int(cl['y'] - (self.altitude_km * 12))
                if -80 < scr_y < self.H + 40:
                    cl_surf = pygame.Surface((int(cl['w']), int(cl['h'])), pygame.SRCALPHA)
                    cl_surf.fill((255, 255, 255, min(cloud_alpha, 180)))
                    pygame.draw.ellipse(cl_surf, (255,255,255, min(cloud_alpha, 160)),
                                        cl_surf.get_rect(), 0)
                    surface.blit(cl_surf, (int(cl['x']), scr_y))

        # Ground, ocean and launchpad
        pad_screen_y = int(self.pad_world_y + self.altitude_km * 35.0)
        if pad_screen_y < self.H + 20:
            # Ocean
            pygame.draw.rect(surface, (10, 60, 130), (0, pad_screen_y, self.W, self.H))
            # Ground
            pygame.draw.rect(surface, (30, 100, 40), (0, pad_screen_y - 8, self.W, 12))
            # Launchpad platform
            pygame.draw.rect(surface, (100, 110, 120), (448, pad_screen_y - 22, 128, 26))
            # Flame trenches
            pygame.draw.rect(surface, (60, 40, 20), (470, pad_screen_y, 84, 20))
            # Gantry tower
            pygame.draw.line(surface, (180, 40, 40),
                             (442, pad_screen_y), (442, pad_screen_y - 140), 5)
            pygame.draw.line(surface, (200, 50, 50),
                             (442, pad_screen_y - 110), (496, pad_screen_y - 110), 2)
            pygame.draw.line(surface, (200, 50, 50),
                             (442, pad_screen_y - 80),  (490, pad_screen_y - 80),  2)

        # Screen shake offset
        ox, oy = self.shake.get_offset()

        # Dropped stages
        for st in self.dropped_stages:
            st.draw(surface)

        # Particles
        self.particles.draw(surface, (0, 0))

        # Rocket sprite
        rot_angle = 90.0 - self.pitch_deg
        if self.stage == 1:
            cw, ch = 48, 220
            full_stack = pygame.Surface((cw, ch), pygame.SRCALPHA)
            full_stack.blit(SPRITES['saturn_upper'], (0, 0))
            full_stack.blit(SPRITES['saturn_stage1'], (0, 95))
            rot_rocket = pygame.transform.rotate(full_stack, rot_angle)
        else:
            rot_rocket = pygame.transform.rotate(SPRITES['saturn_upper'], rot_angle)

        r_rect = rot_rocket.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(rot_rocket, r_rect)

        # ── HUD ──────────────────────────────────────────────────────────

        # Top header panel
        hud = pygame.Surface((self.W, 92), pygame.SRCALPHA)
        hud.fill((4, 12, 40, 215))
        surface.blit(hud, (0, 0))
        pygame.draw.line(surface, (40, 80, 160), (0, 92), (self.W, 92), 2)

        # Mission name
        mission_surf = self.font_large.render(
            f"🚀 {self.mission.name.upper()} · STAGE {self.stage}", True, COLOR_CYAN)
        surface.blit(mission_surf, (18, 10))

        # Timer
        mins = int(self.mission_elapsed) // 60
        secs = int(self.mission_elapsed) % 60
        timer_col = COLOR_RED if self.time_left < 20 else COLOR_TEXT
        timer_surf = self.font_hud.render(
            f"T+{mins:02d}:{secs:02d}  |  ⏱ {self.time_left:.0f}s LEFT", True, timer_col)
        surface.blit(timer_surf, (18, 42))

        # Callout banner
        if self.callout_timer > 0:
            call_alpha = min(255, int(self.callout_timer * 255 / 3.0))
            call_surf = self.font_call.render(self.callout_text, True, self.callout_color)
            surface.blit(call_surf, (18, 65))

        # Right-side telemetry gauges
        draw_gauge(surface, 640, 12, 360, 20,
                   self.altitude_km, self.target_alt,
                   f"🛸 ALT: {self.altitude_km:.1f} / {self.target_alt:.0f} KM", COLOR_CYAN)
        draw_gauge(surface, 640, 38, 360, 20,
                   self.velocity_kms, self.target_vel,
                   f"⚡ VEL: {self.velocity_kms:.2f} / {self.target_vel:.1f} KM/S", COLOR_EMERALD)
        draw_gauge(surface, 640, 64, 360, 20,
                   self.fuel, self.max_fuel,
                   f"⛽ FUEL: {int(self.fuel/max(1,self.max_fuel)*100)}%",
                   COLOR_GOLD if self.fuel > 30 else COLOR_RED)

        # Bottom control panel
        ctrl = pygame.Surface((self.W, 80), pygame.SRCALPHA)
        ctrl.fill((4, 12, 40, 200))
        surface.blit(ctrl, (0, self.H - 80))
        pygame.draw.line(surface, (40, 80, 160), (0, self.H-80), (self.W, self.H-80), 2)

        # Throttle bar (vertical)
        th_x, th_y, th_h = 30, self.H - 76, 68
        pygame.draw.rect(surface, (15, 30, 70), (th_x, th_y, 22, th_h), border_radius=4)
        fill_h = int(th_h * self.throttle)
        if fill_h > 0:
            th_col = COLOR_EMERALD if self.throttle > 0.7 else COLOR_GOLD if self.throttle > 0.3 else COLOR_ORANGE
            pygame.draw.rect(surface, th_col,
                             (th_x, th_y + th_h - fill_h, 22, fill_h), border_radius=4)
        thr_label = self.font_hud.render(f"THR\n{int(self.throttle*100)}%", True, COLOR_TEXT)
        surface.blit(self.font_hud.render(f"{int(self.throttle*100)}%", True, COLOR_TEXT),
                     (th_x - 2, th_y + th_h + 2))

        # Attitude indicator
        att_x = 80
        pitch_col = COLOR_EMERALD if self.pitch_deg <= 25 else COLOR_GOLD
        surface.blit(self.font_hud.render(
            f"📐 PITCH: {self.pitch_deg:.1f}°  |  TARGET < 25°", True, pitch_col),
            (att_x, self.H - 70))
        surface.blit(self.font_hud.render(
            "W/S = THROTTLE  |  A/D = PITCH  |  SPACE = STAGE SEPARATION",
            True, COLOR_TEXT_DIM), (att_x, self.H - 48))

        # Stage status
        st_col = COLOR_CYAN if (self.has_staging and self.stage == 1) else COLOR_TEXT_DIM
        st_txt = "🔴 PRESS SPACE → STAGE SEPARATION!" if (self.has_staging and self.stage == 1 and self.altitude_km > 40) else f"STAGE {self.stage} ACTIVE"
        surface.blit(self.font_hud.render(st_txt, True, st_col), (att_x, self.H - 26))

        # Tutorial arrows (shown when throttle is 0 at start)
        if self.show_tutorial and self.throttle < 0.2:
            draw_arrow_hint(surface, 512, 580, "up", self.t, "W or ↑ THROTTLE!", COLOR_GOLD)

        # Mission objective strip (very bottom)
        obj_surf = self.font_hud.render(
            f"🎯 GOAL: Reach {self.target_alt:.0f} km at {self.target_vel:.1f} km/s velocity",
            True, (150, 170, 220))
        surface.blit(obj_surf, (self.W//2 - obj_surf.get_width()//2, self.H - 18))
