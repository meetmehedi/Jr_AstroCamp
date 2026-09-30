"""
nasa_game/scenes/launch_scene.py
NASA High-Fidelity Launch Vehicle Telemetry & Flight Simulator.
Features realistic multi-layer atmospheric Rayleigh scattering, Mach shock diamonds,
Cape Canaveral Launch Complex 39A, searchlight flares, and authentic glass cockpit MFD telemetry.
Controls: W/S or UP/DOWN = Throttle | A/D or LEFT/RIGHT = Pitch Angle | SPACE = Stage Sep
"""
import math
import random
from typing import Callable, List, Tuple
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.graphics import (
    SPRITES, ParticleSystem, ScreenShake,
    draw_realistic_sky_gradient, create_realistic_cloud_sprite,
    draw_cape_canaveral_launch_complex
)
from nasa_game.ui import (
    COLOR_BG, COLOR_PANEL, COLOR_CYAN, COLOR_GOLD, COLOR_EMERALD, COLOR_RED,
    COLOR_ORANGE, COLOR_TEXT, COLOR_TEXT_DIM, COLOR_PANEL_BORDER,
    draw_gauge, draw_arrow_hint, draw_star_field, draw_hud_panel, get_font
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
        self.vy += 9.81 * dt * 0.8
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

        # Rocket Telemetry & Physics
        self.x         = 512.0
        self.y         = 450.0   # Perfectly centered on Launch Pad at h = 0
        self.altitude_km  = 0.0
        self.velocity_kms = 0.0
        self.pitch_deg    = 90.0   # 90 = vertical launch profile
        self.throttle     = 0.0
        self.fuel         = self.mission.params.get('fuel', 132.0)
        self.max_fuel     = self.fuel
        self.stage        = 1
        self.has_staging  = bool(self.mission.params.get('has_staging', 0.0))
        self.time_left    = self.mission.params.get('time_limit', 120.0)
        self.mission_elapsed = 0.0

        self.target_alt = self.mission.params.get('target_alt', 155.0)
        self.target_vel = self.mission.params.get('target_vel', 5.9)

        # FX Systems
        self.particles = ParticleSystem()
        self.shake     = ScreenShake()
        self.dropped_stages: List[DroppedStage] = []

        # Environmental layers
        self.pad_world_y = 570.0  # Above bottom HUD
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.6, 2.0))
            for _ in range(160)
        ]

        # Realistic Soft Volumetric Cloud Decks (Troposphere & Low Altitude)
        self.cloud_decks = [
            {
                'x': random.uniform(-100, self.W),
                'y': random.uniform(100, 320),
                'speed': random.uniform(8, 20),
                'surf': create_realistic_cloud_sprite(random.randint(220, 380), random.randint(60, 100), seed=i * 17)
            }
            for i in range(4)
        ]

        # Orbital Earth Dynamics & High-Altitude Planetary Streamers
        self.downrange_km = 0.0
        self.earth_drift_x = 0.0
        self.orbital_scroll = 0.0
        self.orbital_clouds = [
            {
                'x': random.uniform(-100, self.W + 200),
                'y_ratio': random.uniform(0.55, 0.85),
                'speed': random.uniform(0.8, 1.8),
                'alpha': random.randint(80, 160),
                'surf': create_realistic_cloud_sprite(random.randint(200, 360), random.randint(50, 90), seed=500 + i * 29)
            }
            for i in range(6)
        ]

        # Photorealistic Background Textures (Pad 39A & Earth Orbit Limb)
        self.bg_pad = None
        self.bg_orbit = None
        try:
            import os
            pad_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'pad_bg.jpg')
            orbit_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'earth_orbit.jpg')
            if os.path.exists(pad_path):
                self.bg_pad = pygame.transform.smoothscale(pygame.image.load(pad_path).convert(), (self.W, self.H))
            if os.path.exists(orbit_path):
                self.bg_orbit = pygame.transform.smoothscale(pygame.image.load(orbit_path).convert(), (self.W + 160, self.H + 80))
        except Exception:
            pass

        # Flight Director Callout
        self.callout_text  = "MAIN ENGINE START // INCREASE THROTTLE [W] TO LIFTOFF"
        self.callout_timer = 4.5
        self.callout_color = COLOR_GOLD

        self.show_tutorial = True
        self.is_over = False

        # Fonts
        self.font_hud   = get_font(12, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_call  = get_font(14, bold=True, mono=True)

    def handle_event(self, event: pygame.event.Event):
        if self.is_over:
            return
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if self.has_staging and self.stage == 1 and self.altitude_km > 35:
                    self.stage = 2
                    s1_surf = SPRITES['saturn_stage1']
                    rad = math.radians(self.pitch_deg - 90)
                    drop_vx = -math.sin(rad) * 18.0 + random.uniform(-6, 6)
                    drop_vy = math.cos(rad) * 30.0
                    self.dropped_stages.append(
                        DroppedStage(self.x, self.y + 40, drop_vx, drop_vy,
                                     90.0 - self.pitch_deg, random.uniform(-10, 10), s1_surf)
                    )
                    self.particles.emit_explosion(self.x, self.y + 20, count=25)
                    self.shake.trigger(8.0, 0.4)
                    sound_engine.play('thruster')
                    self._callout("STAGE 1 SEPARATION CONFIRMED · S-II IGNITION", COLOR_ORANGE, 3.5)

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

        if self.time_left <= 0:
            self._end_game(False, "Flight timeline exceeded — orbital insertion missed.")
            return

        keys = pygame.key.get_pressed()

        # Throttle command
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            self.throttle = min(1.0, self.throttle + dt * 1.8)
            if self.altitude_km < 1 and self.show_tutorial:
                self._callout("LIFTOFF CONFIRMED! TOWER CLEARED // CLIMB NOMINAL", COLOR_EMERALD, 2.5)
        elif keys[pygame.K_DOWN] or keys[pygame.K_s]:
            self.throttle = max(0.0, self.throttle - dt * 1.8)

        # Pitch command (Gravity Turn)
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.pitch_deg = min(90.0, self.pitch_deg + dt * 22.0)
            self.particles.emit_rcs(self.x + 12, self.y - 15, 35, 0, count=2)
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.pitch_deg = max(5.0, self.pitch_deg - dt * 22.0)
            self.particles.emit_rcs(self.x - 12, self.y - 15, -35, 0, count=2)

        # LOX Venting when idling on pad
        if self.altitude_km < 0.2 and self.throttle < 0.15:
            if random.random() < 0.4:
                self.particles.emit_venting_vapor(self.x - 10, self.y - 20)

        # Sound & Rumble
        if self.throttle > 0.1 and self.fuel > 0:
            self.shake.trigger(self.throttle * 3.5, 0.1)
            if math.fmod(self.mission_elapsed, 0.4) < 0.1:
                sound_engine.play('rocket')

        # Aerodynamic Drag & Rocket Propulsion Physics
        if self.throttle > 0 and self.fuel > 0:
            burn_rate = (11.0 if self.stage == 1 else 8.5) * self.throttle
            self.fuel = max(0.0, self.fuel - dt * burn_rate)

            thrust_accel = (34.0 if self.stage == 1 else 28.0) * self.throttle
            rad = math.radians(self.pitch_deg)
            drag = (self.velocity_kms ** 1.8) * math.exp(-self.altitude_km / 38.0) * 0.32
            gravity_drag = 9.81 * math.sin(rad) * 0.055
            net_accel = max(-1.2, (thrust_accel * 0.09) - drag - gravity_drag)
            self.velocity_kms = max(0.0, self.velocity_kms + net_accel * dt)

            v_vert = self.velocity_kms * math.sin(rad)
            self.altitude_km += v_vert * dt * 8.0

            # Tail Flame Particles
            tail_y = self.y + (55 if self.stage == 1 else 30)
            rot_angle = 90.0 - self.pitch_deg
            self.particles.emit_flame(self.x, tail_y, rot_angle,
                                      speed=280.0 * self.throttle,
                                      count=int(5 * self.throttle + 2))
            if self.altitude_km < 40.0:
                self.particles.emit_smoke(self.x, tail_y + 16, count=2)
        else:
            self.throttle = 0.0
            if self.altitude_km > 0:
                drag = (self.velocity_kms ** 1.8) * math.exp(-self.altitude_km / 38.0) * 0.22
                self.velocity_kms = max(0.0, self.velocity_kms - drag * dt)

        # Low-altitude Troposphere Clouds Scroll
        for cl in self.cloud_decks:
            cl['x'] += cl['speed'] * dt
            if cl['x'] > self.W + 200:
                cl['x'] = -350

        # Downrange & Earth Orbital Progression
        rad = math.radians(self.pitch_deg)
        v_horiz = self.velocity_kms * math.cos(rad)
        self.downrange_km += v_horiz * dt * 8.0

        # High-speed Earth Ground Track Drift (Eastward Prograde Trajectory)
        drift_speed = max(1.5, (v_horiz * 1.6 if self.altitude_km > 50 else self.velocity_kms * 0.4))
        self.earth_drift_x += drift_speed * dt * 25.0
        self.orbital_scroll += drift_speed * dt * 32.0

        for oc in self.orbital_clouds:
            oc['x'] -= drift_speed * dt * 24.0 * oc['speed']
            if oc['x'] < -380:
                oc['x'] = self.W + random.uniform(20, 150)
                oc['y_ratio'] = random.uniform(0.55, 0.85)

        # Milestone Telemetry Callouts
        if 14 < self.altitude_km < 32 and "MAX-Q" not in self.callout_text:
            self._callout("TELEMETRY: MAX-Q PASSING · DYNAMIC PRESSURE NOMINAL", COLOR_ORANGE, 3.0)
            sound_engine.play('quindar')
        elif self.altitude_km >= 100 and "KARMAN" not in self.callout_text:
            self._callout("TELEMETRY: KARMAN LINE TRANSIT · SPACE ENVIRONMENT NOMINAL", COLOR_EMERALD, 4.0)
            sound_engine.play('quindar')
        elif self.has_staging and self.stage == 1 and self.altitude_km > 38 and "STAGE" not in self.callout_text:
            self._callout("AVIONICS: STAGING ADVISORY · PRESS SPACE FOR MECO / SEP", COLOR_CYAN, 4.0)

        if self.altitude_km > 6:
            self.show_tutorial = False

        self.particles.update(dt)
        self.shake.update(dt)
        self.dropped_stages = [s for s in self.dropped_stages if s.update(dt)]

        # Orbital Insertion Assessment
        if self.altitude_km >= 100.0 and self.velocity_kms >= self.target_vel and self.pitch_deg <= 28.0:
            self._end_game(True, f"ORBITAL INSERTION CONFIRMED: Apogee {self.altitude_km:.0f} km at {self.velocity_kms:.2f} km/s")
            return
        if self.altitude_km >= self.target_alt and self.velocity_kms >= self.target_vel * 0.85:
            self._end_game(True, f"MISSION PROFILE ACHIEVED: Orbit {self.altitude_km:.0f} km")
            return
        if self.fuel <= 0.0 and self.time_left < self.mission.params.get('time_limit', 120) - 15:
            if self.velocity_kms >= self.target_vel * 0.85 and self.altitude_km >= 105.0:
                self._end_game(True, f"BALLISTIC COAST INSERTION: Apogee {self.altitude_km:.0f} km")
            elif self.time_left < 5:
                self._end_game(False, f"Depleted propellant reserves. Apogee: {self.altitude_km:.0f} km at {self.velocity_kms:.2f} km/s")

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

    def draw(self, surface: pygame.Surface):
        alt_f = min(1.0, self.altitude_km / 110.0)

        # 1. Photorealistic Earth Orbit or Atmospheric Gradient
        if self.bg_orbit and alt_f > 0.35:
            # Dynamic vertical altitude parallax: Earth horizon recedes as rocket ascends into space
            earth_y = int(min(65.0, max(0.0, (self.altitude_km - 35.0) * 0.42)))

            # Responsive horizontal horizon pan based on gravity turn and orbital drift
            pitch_drift = (90.0 - self.pitch_deg) * 0.35
            earth_x = int(-80.0 - (math.sin(self.earth_drift_x * 0.05) * 15.0) - pitch_drift)

            surface.blit(self.bg_orbit, (earth_x, earth_y))

            # Dynamic high-speed orbital cloud streamers across curved Earth globe
            if alt_f > 0.4:
                cloud_opacity = min(1.0, (alt_f - 0.4) / 0.22)
                for oc in self.orbital_clouds:
                    cloud_scr_y = int(earth_y + self.H * oc['y_ratio'])
                    if 0 <= cloud_scr_y <= self.H:
                        oc['surf'].set_alpha(int(oc['alpha'] * cloud_opacity))
                        surface.blit(oc['surf'], (int(oc['x']), cloud_scr_y))

            if alt_f < 0.7:
                overlay = pygame.Surface((self.W, self.H), pygame.SRCALPHA)
                draw_realistic_sky_gradient(overlay, self.altitude_km, self.W, self.H)
                overlay.set_alpha(int((0.7 - alt_f) / 0.35 * 255))
                surface.blit(overlay, (0, 0))
        else:
            # Multi-Stop Atmospheric Rayleigh Scattering Gradient
            draw_realistic_sky_gradient(surface, self.altitude_km, self.W, self.H)

        # 2. Glowing Ozone Layer Limb
        if 0.2 < alt_f < 0.8:
            limb_h = int(60 * math.sin(alt_f * math.pi))
            limb_surf = pygame.Surface((self.W, max(4, limb_h)), pygame.SRCALPHA)
            pygame.draw.rect(limb_surf, (56, 189, 248, int(90 * alt_f)), (0, 0, self.W, limb_h))
            surface.blit(limb_surf, (0, self.H - 120 - limb_h))

        # 3. Stellar Field
        if alt_f > 0.08:
            star_lum = min(1.0, (alt_f - 0.08) / 0.3)
            for sx, sy, sb, _ in self.stars:
                lum = int(sb * 240 * star_lum)
                if lum > 15:
                    pygame.draw.circle(surface, (lum, lum, min(255, int(lum * 1.1))), (sx, sy), 1 if sb < 0.8 else 2)

        # 4. Volumetric Clouds — Correct Parallax (Descending Downward as Rocket Ascends)
        if alt_f < 0.35:
            cloud_alpha = int(255 * max(0.0, 1.0 - alt_f * 3.0))
            for cl in self.cloud_decks:
                scr_y = int(cl['y'] + (self.altitude_km * 35.0))
                if -120 < scr_y < self.H + 40:
                    cl['surf'].set_alpha(cloud_alpha)
                    surface.blit(cl['surf'], (int(cl['x']), scr_y))

        # 5. Cape Canaveral Launch Pad 39A & Gantry Complex
        pad_screen_y = int(self.pad_world_y + self.altitude_km * 40.0)
        draw_cape_canaveral_launch_complex(surface, pad_screen_y, self.W, self.H, self.altitude_km)

        # Screen Shake & Dropped Stages
        ox, oy = self.shake.get_offset()
        for st in self.dropped_stages:
            st.draw(surface)

        # Particles (Rocket Plume, Deluge Steam, LOX Venting)
        self.particles.draw(surface, (0, 0))

        # 6. Rocket Sprite (with Roll Attitude & Specular Highlights)
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

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        # Top Header Bar (Mission Profile & Flight Director)
        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="FLIGHT DYNAMICS · PRIMARY TELEMETRY")

        v_name = self.mission.name.upper()
        if len(v_name) > 26:
            v_name = v_name[:24] + "..."
        mission_label = f"VEHICLE: {v_name} // STAGE {self.stage}"
        surface.blit(self.font_large.render(mission_label, True, COLOR_CYAN), (26, 32))

        mins = int(self.mission_elapsed) // 60
        secs = int(self.mission_elapsed) % 60
        timer_col = COLOR_RED if self.time_left < 20 else COLOR_TEXT
        timer_txt = f"MET T+{mins:02d}:{secs:02d} | TIMELINE REMAINING: {self.time_left:.1f}s"
        surface.blit(self.font_hud.render(timer_txt, True, timer_col), (26, 56))

        # Right Telemetry Gauges (Altitude, Velocity, Propellant)
        draw_gauge(surface, 620, 24, 380, 18,
                   self.altitude_km, self.target_alt,
                   f"ALTITUDE: {self.altitude_km:.1f} / {self.target_alt:.0f} KM", COLOR_CYAN)
        draw_gauge(surface, 620, 46, 380, 18,
                   self.velocity_kms, self.target_vel,
                   f"ORBITAL VELOCITY: {self.velocity_kms:.2f} / {self.target_vel:.1f} KM/S", COLOR_EMERALD)
        draw_gauge(surface, 620, 68, 380, 18,
                   self.fuel, self.max_fuel,
                   f"PROPELLANT: {int((self.fuel / max(1.0, self.max_fuel)) * 100)}%",
                   COLOR_GOLD if self.fuel > 30 else COLOR_RED)

        # Callout Banner (Center-Left)
        if self.callout_timer > 0:
            c_surf = self.font_call.render(f"▶ {self.callout_text}", True, self.callout_color)
            c_bg = pygame.Surface((c_surf.get_width() + 16, c_surf.get_height() + 8), pygame.SRCALPHA)
            c_bg.fill((11, 19, 32, 230))
            pygame.draw.rect(c_bg, self.callout_color, c_bg.get_rect(), 1)
            surface.blit(c_bg, (26, 102))
            surface.blit(c_surf, (34, 106))

        # Bottom Control Panel (Attitude, Pitch Ladder, Thrust Command)
        draw_hud_panel(surface, pygame.Rect(12, self.H - 96, self.W - 24, 84), title="FLIGHT CONTROL & PROPULSION MFD")

        # Throttle Vertical Bar
        th_x, th_y, th_w, th_h = 28, self.H - 84, 28, 64
        pygame.draw.rect(surface, (10, 16, 26), (th_x, th_y, th_w, th_h), border_radius=2)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (th_x, th_y, th_w, th_h), 1, border_radius=2)
        fill_h = int(th_h * self.throttle)
        if fill_h > 0:
            th_col = COLOR_EMERALD if self.throttle > 0.6 else COLOR_GOLD if self.throttle > 0.25 else COLOR_ORANGE
            pygame.draw.rect(surface, th_col, (th_x + 2, th_y + th_h - fill_h, th_w - 4, fill_h), border_radius=1)
        surface.blit(self.font_hud.render(f"THRUST", True, COLOR_TEXT_DIM), (th_x + 36, th_y + 4))
        surface.blit(self.font_large.render(f"{int(self.throttle * 100)}%", True, COLOR_TEXT), (th_x + 36, th_y + 20))

        # Flight Attitude & Controls Guidance
        att_x = 180
        pitch_col = COLOR_EMERALD if self.pitch_deg <= 25 else COLOR_GOLD
        pitch_txt = f"PITCH ANGLE: {self.pitch_deg:.1f}° // GRAVITY TURN TARGET: < 25°"
        surface.blit(self.font_large.render(pitch_txt, True, pitch_col), (att_x, self.H - 78))
        surface.blit(self.font_hud.render(
            "[W / S] THROTTLE REGULATION  |  [A / D] GIMBAL PITCH  |  [SPACE] STAGING",
            True, COLOR_TEXT_DIM), (att_x, self.H - 52))
        
        # Staging Advisory & Orbital Ground Track Status
        st_txt = "MECO / SEP READY [SPACE]" if (self.has_staging and self.stage == 1 and self.altitude_km > 35) else f"STAGE {self.stage} NOMINAL"
        st_col = COLOR_CYAN if "READY" in st_txt else COLOR_TEXT_DIM
        surface.blit(self.font_hud.render(f"STATUS: {st_txt}", True, st_col), (att_x, self.H - 32))

        if self.altitude_km > 35:
            rad = math.radians(self.pitch_deg)
            v_horiz = self.velocity_kms * math.cos(rad)
            ground_txt = f"DOWNRANGE: {self.downrange_km:.0f} KM · TRACK: {v_horiz:.2f} KM/S"
            g_surf = self.font_hud.render(ground_txt, True, COLOR_EMERALD)
            surface.blit(g_surf, (self.W - 36 - g_surf.get_width(), self.H - 32))

        # Target Guidance Chevron
        if self.show_tutorial and self.throttle < 0.2:
            draw_arrow_hint(surface, 512, 480, "up", self.t, "ENGAGE THROTTLE [W]", COLOR_GOLD)
