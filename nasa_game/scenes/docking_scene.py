r"""
nasa_game/scenes/docking_scene.py
NASA International Space Station & Gateway Orbital Rendezvous / Docking Simulator.
Features 3D-perspective docking adapter with laser range radar, relative velocity $\dot{R}$
telemetry, attitude alignment crosshairs, and capture latch mechanics.
"""
import math
import random
from typing import Callable, Tuple
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.graphics import SPRITES, ParticleSystem, ScreenShake
from nasa_game.ui import (
    COLOR_BG, COLOR_PANEL, COLOR_CYAN, COLOR_GOLD, COLOR_EMERALD, COLOR_RED,
    COLOR_ORANGE, COLOR_TEXT, COLOR_TEXT_DIM, COLOR_PANEL_BORDER,
    draw_gauge, draw_hud_panel, get_font
)

class DockingScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Target center coordinates
        self.target_x = 512.0
        self.target_y = 360.0

        # Approach kinematics
        self.probe_x = 512.0 + 130.0
        self.probe_y = 360.0 - 80.0
        self.probe_vx = -10.0
        self.probe_vy = 6.0
        self.distance_m = self.mission.params.get('distance', 160.0)
        self.approach_speed_ms = 1.0
        self.fuel = self.mission.params.get('fuel', 85.0)
        self.max_fuel = self.fuel

        self.tolerance_px = self.mission.params.get('tolerance_px', 36.0)
        self.max_speed = self.mission.params.get('max_approach_speed', 1.0)
        self.time_left = self.mission.params.get('time_limit', 60.0)

        self.lock_timer = 0.0
        self.required_lock = 1.5
        self.is_over = False

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H), random.random(), random.uniform(0.6, 2.0))
            for _ in range(110)
        ]

        # Callouts
        self.callout_text = "APPROACH RADAR LOCKED // MAINTAIN < 1.0 M/S"
        self.callout_timer = 4.0

        self.font = get_font(13, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_hud = get_font(11, bold=True, mono=True)

    def handle_event(self, event: pygame.event.Event):
        pass

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Orbital approach timeline expired before hard capture.")
            return

        keys = pygame.key.get_pressed()
        fired_rcs = False
        thrust = 55.0 * dt

        # Translation controls
        if (keys[pygame.K_a] or keys[pygame.K_LEFT]) and self.fuel > 0:
            self.probe_vx -= thrust
            fired_rcs = True
            self.particles.emit_rcs(180, 360, -40, 0, count=2)
        if (keys[pygame.K_d] or keys[pygame.K_RIGHT]) and self.fuel > 0:
            self.probe_vx += thrust
            fired_rcs = True
            self.particles.emit_rcs(844, 360, 40, 0, count=2)
        if (keys[pygame.K_w] or keys[pygame.K_UP]) and self.fuel > 0:
            self.probe_vy -= thrust
            fired_rcs = True
            self.particles.emit_rcs(512, 140, 0, -40, count=2)
        if (keys[pygame.K_s] or keys[pygame.K_DOWN]) and self.fuel > 0:
            self.probe_vy += thrust
            fired_rcs = True
            self.particles.emit_rcs(512, 580, 0, 40, count=2)

        # Forward / Reverse Approach Speed
        if keys[pygame.K_q] and self.fuel > 0:
            self.approach_speed_ms = max(0.05, self.approach_speed_ms - dt * 0.8)
            fired_rcs = True
        if keys[pygame.K_e] and self.fuel > 0:
            self.approach_speed_ms = min(3.5, self.approach_speed_ms + dt * 0.8)
            fired_rcs = True

        if fired_rcs:
            self.fuel = max(0.0, self.fuel - dt * 8.0)
            self.shake.trigger(1.2, 0.08)
            if math.fmod(self.time_left, 0.4) < 0.1:
                sound_engine.play('thruster')

        # Microgravity damping
        self.probe_vx *= (1.0 - dt * 0.18)
        self.probe_vy *= (1.0 - dt * 0.18)

        self.probe_x += self.probe_vx * dt
        self.probe_y += self.probe_vy * dt
        self.distance_m = max(0.0, self.distance_m - self.approach_speed_ms * dt * 4.5)

        offset_dist = math.hypot(self.probe_x - self.target_x, self.probe_y - self.target_y)

        # Alignment Lock
        if offset_dist <= self.tolerance_px and self.approach_speed_ms <= self.max_speed:
            self.lock_timer += dt
            if self.distance_m <= 1.5:
                self.shake.trigger(7.0, 0.3)
                self._end_game(True, "HARD CAPTURE CONFIRMED! Mechanical docking latches locked.")
                return
        else:
            self.lock_timer = max(0.0, self.lock_timer - dt * 2.0)

        # Collision Check
        if self.distance_m <= 0.5:
            if self.approach_speed_ms > self.max_speed:
                self.particles.emit_explosion(512, 360, count=40)
                self.shake.trigger(14.0, 0.6)
                self._end_game(False, f"DOCKING COLLISION: Approach speed ({self.approach_speed_ms:.2f} m/s) exceeded capture limit ({self.max_speed:.2f} m/s).")
            elif offset_dist > self.tolerance_px:
                self.particles.emit_explosion(512, 360, count=30)
                self.shake.trigger(10.0, 0.5)
                self._end_game(False, "OFF-AXIS CONTACT: Spacecraft missed capture collar and contacted station truss.")
            return

        if 48.0 < self.distance_m < 52.0 and "50 METERS" not in self.callout_text:
            self.callout_text = "RADAR: RANGE 50 METERS // LINE OF SIGHT NOMINAL"
            self.callout_timer = 3.0
            sound_engine.play('quindar')
        elif 9.0 < self.distance_m < 11.0 and "10 METERS" not in self.callout_text:
            self.callout_text = "RADAR: RANGE 10 METERS // CLEARED FOR FINAL CAPTURE"
            self.callout_timer = 3.0
            sound_engine.play('quindar')

        self.particles.update(dt)
        self.shake.update(dt)

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        if success:
            sound_engine.play('victory')
            offset = math.hypot(self.probe_x - self.target_x, self.probe_y - self.target_y)
            alignment_score = int(max(0.0, 1.0 - (offset / self.tolerance_px)) * 500)
            fuel_score = int((self.fuel / max(1.0, self.max_fuel)) * 300)
            speed_score = int(max(0.0, 1.0 - (self.approach_speed_ms / self.max_speed)) * 200)
            final_score = alignment_score + fuel_score + speed_score
        else:
            sound_engine.play('alarm')
            final_score = int(max(0.0, 1.0 - (self.distance_m / 160.0)) * 250)

        self.on_finish(success, final_score, reason)

    def draw(self, surface: pygame.Surface):
        # 1. Earth Orbit Deep Space
        surface.fill(COLOR_BG)

        for sx, sy, sb, spd in self.stars:
            lum = int(sb * 220)
            pygame.draw.circle(surface, (lum, lum, min(255, int(lum * 1.1))), (int(sx), int(sy)), 1 if sb < 0.75 else 2)

        # Distant Earth Atmosphere Curvature
        pygame.draw.circle(surface, (12, 36, 80), (512, 1150), 650)
        pygame.draw.circle(surface, (56, 189, 248), (512, 1150), 652, 2)

        ox, oy = self.shake.get_offset()

        # 2. 3D Perspective Scaling of Docking Collar
        scale_factor = max(0.4, min(2.8, 140.0 / (self.distance_m + 35.0)))
        target_orig = SPRITES['docking_target']
        new_w = int(target_orig.get_width() * scale_factor)
        new_h = int(target_orig.get_height() * scale_factor)
        target_scaled = pygame.transform.smoothscale(target_orig, (new_w, new_h))
        target_rect = target_scaled.get_rect(center=(int(self.target_x + ox), int(self.target_y + oy)))
        surface.blit(target_scaled, target_rect)

        self.particles.draw(surface, (0, 0))

        # 3. Vector Crosshair HUD & Laser Ranging
        pr_x = int(self.probe_x + ox)
        pr_y = int(self.probe_y + oy)
        offset = math.hypot(self.probe_x - self.target_x, self.probe_y - self.target_y)
        is_aligned = offset <= self.tolerance_px
        hud_col = COLOR_EMERALD if is_aligned else COLOR_CYAN

        # Center Target Box
        box_size = int(self.tolerance_px * 2)
        pygame.draw.rect(surface, hud_col, (int(self.target_x - self.tolerance_px), int(self.target_y - self.tolerance_px), box_size, box_size), 1)

        # Precision Flight Crosshair
        pygame.draw.circle(surface, hud_col, (pr_x, pr_y), 18, 1)
        pygame.draw.circle(surface, hud_col, (pr_x, pr_y), 3)
        pygame.draw.line(surface, hud_col, (pr_x - 28, pr_y), (pr_x + 28, pr_y), 1)
        pygame.draw.line(surface, hud_col, (pr_x, pr_y - 28), (pr_x, pr_y + 28), 1)
        pygame.draw.line(surface, (51, 65, 85), (pr_x, pr_y), (int(self.target_x), int(self.target_y)), 1)

        # Cockpit Bezel Frame
        pygame.draw.rect(surface, (11, 19, 32), (0, 0, self.W, self.H), 12)

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="ORBITAL RENDEZVOUS & DOCKING RADAR")

        v_name = self.mission.name.upper()
        if len(v_name) > 28:
            v_name = v_name[:26] + "..."
        surface.blit(self.font_large.render(f"TARGET: {v_name}", True, COLOR_CYAN), (26, 32))

        if self.callout_timer > 0:
            surface.blit(self.font_hud.render(f"RADAR: \"{self.callout_text}\"", True, COLOR_GOLD), (26, 58))
        else:
            surface.blit(self.font.render(f"TIMELINE REMAINING: {self.time_left:.1f}s", True, COLOR_TEXT_DIM), (26, 58))

        # Right Telemetry Gauges (Range, Speed, Fuel)
        draw_gauge(surface, 620, 24, 380, 18, self.distance_m, 160.0,
                   f"RANGE: {self.distance_m:.1f} M", COLOR_CYAN)

        spd_col = COLOR_EMERALD if self.approach_speed_ms <= self.max_speed else COLOR_RED
        draw_gauge(surface, 620, 46, 380, 18, self.approach_speed_ms, 3.0,
                   f"CLOSING VELOCITY: {self.approach_speed_ms:.2f} M/S (LIMIT {self.max_speed:.2f})", spd_col)

        draw_gauge(surface, 620, 68, 380, 18, self.fuel, self.max_fuel,
                   f"RCS PROPELLANT: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 20 else COLOR_RED)

        # Bottom Alignment Diagnostics
        draw_hud_panel(surface, pygame.Rect(12, self.H - 84, 380, 72), title="ALIGNMENT DIAGNOSTICS")
        lock_pct = min(100, int((self.lock_timer / self.required_lock) * 100))
        l_col = COLOR_EMERALD if lock_pct > 60 else COLOR_CYAN
        surface.blit(self.font.render(f"CAPTURE LATCH ENGAGEMENT: {lock_pct}%", True, l_col), (26, self.H - 68))
        surface.blit(self.font.render(f"RADIAL OFFSET: {offset:.1f} PX (TOL: {self.tolerance_px:.0f} PX)", True, COLOR_TEXT), (26, self.H - 48))
        surface.blit(self.font_hud.render("[WASD] RCS TRANSLATION  |  [Q/E] APPROACH SPEED", True, COLOR_TEXT_DIM), (26, self.H - 28))
