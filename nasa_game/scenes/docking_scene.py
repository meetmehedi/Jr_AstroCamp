"""
nasa_game/scenes/docking_scene.py
Orbital Rendezvous & Docking Flight Simulator.
Features 3D-perspective docking adapter with alignment guide petals, blinking LED strobes,
RCS nitrogen cold-gas thruster puffs, range radar, and mechanical capture lock.
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
    COLOR_TEXT, COLOR_TEXT_DIM, draw_gauge
)

class DockingScene:
    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Docking target center in screen space
        self.target_x = 512.0
        self.target_y = 360.0

        # Spacecraft approach kinematics
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
        self.stars = [(random.randint(0, 1024), random.randint(0, 720), random.random()) for _ in range(90)]

        # Capcom Callouts
        self.callout_text = "APPROACH RADAR ACQUIRED — MAINTAIN < 1.0 M/S"
        self.callout_timer = 4.0

        self.font = pygame.font.SysFont("monospace", 13, bold=True)
        self.font_large = pygame.font.SysFont("monospace", 18, bold=True)
        self.font_hud = pygame.font.SysFont("monospace", 11)

    def handle_event(self, event: pygame.event.Event):
        pass

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Orbital pass window expired before docking capture.")
            return

        keys = pygame.key.get_pressed()
        fired_rcs = False
        thrust = 55.0 * dt

        # Translation controls (W/A/S/D or Arrows)
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

        # Forward / Reverse Approach Speed (Q / E)
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

        # Microgravity drift damping
        self.probe_vx *= (1.0 - dt * 0.18)
        self.probe_vy *= (1.0 - dt * 0.18)

        self.probe_x += self.probe_vx * dt
        self.probe_y += self.probe_vy * dt
        self.distance_m = max(0.0, self.distance_m - self.approach_speed_ms * dt * 4.5)

        # Distance from center target
        offset_dist = math.hypot(self.probe_x - self.target_x, self.probe_y - self.target_y)

        # Alignment Lock Accumulation
        if offset_dist <= self.tolerance_px and self.approach_speed_ms <= self.max_speed:
            self.lock_timer += dt
            if self.distance_m <= 1.5:
                # Capture contact
                self.shake.trigger(7.0, 0.3)
                self._end_game(True, "HARD CAPTURE CONFIRMED! Mechanical docking latches locked.")
                return
        else:
            self.lock_timer = max(0.0, self.lock_timer - dt * 2.0)

        # Collision Check if speed too high at contact
        if self.distance_m <= 0.5:
            if self.approach_speed_ms > self.max_speed:
                self.particles.emit_explosion(512, 360, count=40)
                self.shake.trigger(14.0, 0.6)
                self._end_game(False, f"DOCKING PORT COLLISION: Closing speed ({self.approach_speed_ms:.2f} m/s) exceeded latch tolerance ({self.max_speed:.2f} m/s).")
            elif offset_dist > self.tolerance_px:
                self.particles.emit_explosion(512, 360, count=30)
                self.shake.trigger(10.0, 0.5)
                self._end_game(False, "MISALIGNED CONTACT: Spacecraft missed docking collar and struck solar truss.")
            return

        # Distance callouts
        if 48.0 < self.distance_m < 52.0 and "50 METERS" not in self.callout_text:
            self.callout_text = "STATION: RANGE 50 METERS — LINE OF SIGHT NOMINAL"
            self.callout_timer = 3.0
            sound_engine.play('quindar')
        elif 9.0 < self.distance_m < 11.0 and "10 METERS" not in self.callout_text:
            self.callout_text = "CAPCOM: RANGE 10 METERS — GO FOR HARD CAPTURE"
            self.callout_timer = 3.0
            sound_engine.play('quindar')

        # Update FX
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
        # Orbit darkness
        surface.fill((2, 4, 10))

        # Stars
        for sx, sy, sb in self.stars:
            b_val = int(sb * 210)
            surface.set_at((sx, sy), (b_val, b_val, b_val))

        # Distant Earth blue atmospheric limb curvature
        pygame.draw.circle(surface, (12, 38, 84), (512, 1150), 650)
        pygame.draw.circle(surface, (56, 189, 248), (512, 1150), 652, 2)

        ox, oy = self.shake.get_offset()

        # 3D PERSPECTIVE SCALING FOR DOCKING PORT SPRITE
        # Port grows larger as distance approaches 0
        scale_factor = max(0.4, min(2.8, 140.0 / (self.distance_m + 35.0)))
        target_orig = SPRITES['docking_target']
        new_w = int(target_orig.get_width() * scale_factor)
        new_h = int(target_orig.get_height() * scale_factor)
        target_scaled = pygame.transform.smoothscale(target_orig, (new_w, new_h))
        target_rect = target_scaled.get_rect(center=(int(self.target_x + ox), int(self.target_y + oy)))
        surface.blit(target_scaled, target_rect)

        # Draw RCS Particles
        self.particles.draw(surface, (0, 0))

        # ── COCKPIT CROSSHAIR HUD & ALIGNMENT RETICLE ──
        # Player reticle position
        pr_x = int(self.probe_x + ox)
        pr_y = int(self.probe_y + oy)

        offset = math.hypot(self.probe_x - self.target_x, self.probe_y - self.target_y)
        is_aligned = offset <= self.tolerance_px
        hud_col = COLOR_EMERALD if is_aligned else COLOR_CYAN

        # Center Alignment Box
        box_size = int(self.tolerance_px * 2)
        pygame.draw.rect(surface, hud_col, (int(self.target_x - self.tolerance_px), int(self.target_y - self.tolerance_px), box_size, box_size), 1)

        # Player Probe Crosshairs
        pygame.draw.circle(surface, hud_col, (pr_x, pr_y), 18, 1)
        pygame.draw.circle(surface, hud_col, (pr_x, pr_y), 4)
        pygame.draw.line(surface, hud_col, (pr_x - 30, pr_y), (pr_x + 30, pr_y), 1)
        pygame.draw.line(surface, hud_col, (pr_x, pr_y - 30), (pr_x, pr_y + 30), 1)

        # Line connecting player probe to center port
        pygame.draw.line(surface, (71, 85, 105), (pr_x, pr_y), (int(self.target_x), int(self.target_y)), 1)

        # Cockpit Canopy Frame Vignette
        pygame.draw.rect(surface, (15, 23, 42), (0, 0, 1024, 720), 18)

        # ── TOP FLIGHT DIRECTOR HUD ──
        hud_panel = pygame.Surface((1024, 85), pygame.SRCALPHA)
        hud_panel.fill((10, 15, 26, 220))
        surface.blit(hud_panel, (0, 0))
        pygame.draw.line(surface, (30, 41, 59), (0, 85), (1024, 85), 1)

        title_surf = self.font_large.render(f"RENDEZVOUS TARGET: {self.mission.name.upper()}", True, COLOR_CYAN)
        surface.blit(title_surf, (24, 12))

        # Callout message
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"CAPCOM: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (24, 38))
        else:
            time_surf = self.font.render(f"TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT)
            surface.blit(time_surf, (24, 38))

        # Gauges (Right side)
        # Range Radar
        draw_gauge(surface, 640, 14, 160, 16, self.distance_m, 160.0,
                   f"RANGE: {self.distance_m:.1f} M", COLOR_CYAN)

        # Approach Speed
        spd_col = COLOR_EMERALD if self.approach_speed_ms <= self.max_speed else COLOR_RED
        draw_gauge(surface, 640, 36, 160, 16, self.approach_speed_ms, 3.0,
                   f"CLOSING: {self.approach_speed_ms:.2f} M/S (MAX {self.max_speed:.2f})", spd_col)

        # RCS Propellant
        draw_gauge(surface, 640, 58, 160, 16, self.fuel, self.max_fuel,
                   f"RCS FUEL: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 20 else COLOR_RED)

        # Bottom Alignment Diagnostics
        att_panel = pygame.Surface((320, 68), pygame.SRCALPHA)
        att_panel.fill((15, 23, 42, 210))
        surface.blit(att_panel, (24, 638))
        pygame.draw.rect(surface, (51, 65, 85), (24, 638, 320, 68), 1, border_radius=6)

        lock_pct = min(100, int((self.lock_timer / self.required_lock) * 100))
        l_col = COLOR_EMERALD if lock_pct > 60 else COLOR_CYAN
        surface.blit(self.font.render(f"CAPTURE LOCK: {lock_pct}%", True, l_col), (36, 646))

        off_str = f"RADIAL OFFSET: {offset:.1f} PX (TOL: {self.tolerance_px:.0f} PX)"
        surface.blit(self.font.render(off_str, True, COLOR_TEXT), (36, 666))

        surface.blit(self.font_hud.render("WASD: RCS TRANSLATION  ·  Q/E: APPROACH THROTTLE", True, COLOR_TEXT_DIM), (36, 686))
