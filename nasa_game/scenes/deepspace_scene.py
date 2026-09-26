"""
nasa_game/scenes/deepspace_scene.py
Interplanetary Slingshot & Gravity-Assist Flight Simulator.
Features Voyager Interstellar Probe with High-Gain Antenna & Golden Record,
N-body planetary gravity wells (Jupiter / Saturn), orbital slingshot acceleration, and trajectory arcs.
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
    COLOR_TEXT, COLOR_TEXT_DIM, draw_gauge
)

class Planet:
    def __init__(self, x: float, y: float, mass: float, radius: float, name: str, color: Tuple[int, int, int], has_rings: bool = False):
        self.x = x
        self.y = y
        self.mass = mass
        self.radius = radius
        self.name = name
        self.color = color
        self.has_rings = has_rings
        self.assist_boosted = False

class DeepSpaceScene:
    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Voyager probe initial kinematics
        self.x = 120.0
        self.y = 520.0
        self.vx = 48.0
        self.vy = -34.0
        self.fuel = self.mission.params.get('fuel', 70.0)
        self.max_fuel = self.fuel
        self.time_left = self.mission.params.get('time_limit', 60.0)

        # Solar system bodies & gravity assists
        self.planets: List[Planet] = []
        self._setup_planets()

        # Target Interstellar Escape Boundary
        self.target_x = 940.0
        self.target_y = 180.0
        self.target_radius = 65.0
        self.escape_velocity_kms = 17.0
        self.current_speed_kms = 12.0

        # Trajectory breadcrumb trail
        self.trail: List[Tuple[float, float]] = []

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [(random.randint(0, 1024), random.randint(0, 720), random.random()) for _ in range(120)]

        # Callouts
        self.callout_text = "INTERPLANETARY TRAJECTORY ACTIVE — ENTER GRAVITY-ASSIST CORRIDOR"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = pygame.font.SysFont("monospace", 13, bold=True)
        self.font_large = pygame.font.SysFont("monospace", 18, bold=True)
        self.font_hud = pygame.font.SysFont("monospace", 11)

    def _setup_planets(self):
        # 1. Jupiter (Massive gas giant with gravity well)
        jupiter = Planet(480.0, 370.0, 48000.0, 38.0, "JUPITER", (210, 140, 80))
        # 2. Saturn (Ringed world)
        saturn = Planet(760.0, 240.0, 28000.0, 28.0, "SATURN", (230, 200, 140), has_rings=True)
        self.planets = [jupiter, saturn]

    def handle_event(self, event: pygame.event.Event):
        pass

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Mission trajectory elapsed before heliopause escape insertion.")
            return

        # Trajectory correction burns (RCS thrusters)
        keys = pygame.key.get_pressed()
        fired_rcs = False
        burn = 40.0 * dt

        if (keys[pygame.K_a] or keys[pygame.K_LEFT]) and self.fuel > 0:
            self.vx -= burn
            fired_rcs = True
            self.particles.emit_rcs(self.x + 12, self.y, 25, 0, count=1)
        if (keys[pygame.K_d] or keys[pygame.K_RIGHT]) and self.fuel > 0:
            self.vx += burn
            fired_rcs = True
            self.particles.emit_rcs(self.x - 12, self.y, -25, 0, count=1)
        if (keys[pygame.K_w] or keys[pygame.K_UP]) and self.fuel > 0:
            self.vy -= burn
            fired_rcs = True
            self.particles.emit_rcs(self.x, self.y + 12, 0, 25, count=1)
        if (keys[pygame.K_s] or keys[pygame.K_DOWN]) and self.fuel > 0:
            self.vy += burn
            fired_rcs = True
            self.particles.emit_rcs(self.x, self.y - 12, 0, -25, count=1)

        if fired_rcs:
            self.fuel = max(0.0, self.fuel - dt * 6.0)
            if math.fmod(self.time_left, 0.35) < 0.1:
                sound_engine.play('thruster')

        # N-Body Gravitational Physics (F = G * M / r^2)
        for planet in self.planets:
            dx = planet.x - self.x
            dy = planet.y - self.y
            dist = math.hypot(dx, dy)

            # Planet collision check
            if dist < planet.radius + 6.0:
                self.particles.emit_explosion(self.x, self.y, count=40)
                self.shake.trigger(14.0, 0.6)
                self._end_game(False, f"ATMOSPHERIC IMPACT: Probe entered {planet.name}'s dense radiation belt and crashed.")
                return

            # Gravity Assist Slingshot Zone
            assist_corridor = planet.radius * 2.8
            if dist < assist_corridor:
                # Accelerate probe tangent to flyby
                if not planet.assist_boosted:
                    planet.assist_boosted = True
                    self.current_speed_kms += 4.5
                    self.particles.emit_rcs(self.x, self.y, self.vx * 0.5, self.vy * 0.5, count=6)
                    self.shake.trigger(4.0, 0.25)
                    sound_engine.play('quindar')
                    self.callout_text = f"GRAVITY-ASSIST CONFIRMED: {planet.name} SLINGSHOT +4.5 KM/S"
                    self.callout_timer = 3.5

            # Gravity acceleration pull
            grav_accel = planet.mass / (dist ** 2)
            self.vx += (dx / dist) * grav_accel * dt
            self.vy += (dy / dist) * grav_accel * dt

        # Update position
        self.x += self.vx * dt
        self.y += self.vy * dt

        # Current speed calculation
        spd_px = math.hypot(self.vx, self.vy)
        self.current_speed_kms = 10.0 + (spd_px * 0.12)

        # Record Trajectory Trail
        if len(self.trail) == 0 or math.hypot(self.x - self.trail[-1][0], self.y - self.trail[-1][1]) > 8.0:
            self.trail.append((self.x, self.y))
            if len(self.trail) > 180:
                self.trail.pop(0)

        # Check Target Destination Intercept
        dist_to_target = math.hypot(self.x - self.target_x, self.y - self.target_y)
        if dist_to_target < self.target_radius:
            if self.current_speed_kms >= self.escape_velocity_kms:
                self._end_game(True, "INTERSTELLAR HELIOPAUSE REACHED! Voyager has exited the Solar System into interstellar space.")
            else:
                self._end_game(False, f"SUB-ESCAPE TRAJECTORY: Velocity ({self.current_speed_kms:.1f} km/s) insufficient for Solar System escape.")
            return

        # Check Offscreen Failure
        if self.x < -40 or self.x > 1080 or self.y < -40 or self.y > 760:
            self._end_game(False, "TRAJECTORY DRIFT: Probe missed gravitational corridors and drifted into dark void.")
            return

        # Update FX
        self.particles.update(dt)
        self.shake.update(dt)

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        if success:
            sound_engine.play('victory')
            speed_score = int(min(1.0, self.current_speed_kms / self.escape_velocity_kms) * 450)
            fuel_score = int((self.fuel / max(1.0, self.max_fuel)) * 300)
            time_score = int((self.time_left / 60.0) * 250)
            final_score = speed_score + fuel_score + time_score
        else:
            sound_engine.play('alarm')
            dist = math.hypot(self.x - self.target_x, self.y - self.target_y)
            final_score = int(max(0.0, 1.0 - (dist / 800.0)) * 200)

        self.on_finish(success, final_score, reason)

    def draw(self, surface: pygame.Surface):
        # Deep space
        surface.fill((2, 4, 10))

        # Stars
        for sx, sy, sb in self.stars:
            b_val = int(sb * 220)
            surface.set_at((sx, sy), (b_val, b_val, b_val))

        ox, oy = self.shake.get_offset()

        # Draw Planetary Gravity Wells & Flyby Assist Rings
        for planet in self.planets:
            px, py = int(planet.x), int(planet.y)

            # Gravity well gradient rings
            assist_r = int(planet.radius * 2.8)
            pygame.draw.circle(surface, (25, 40, 65), (px, py), assist_r, 1)
            pygame.draw.circle(surface, (15, 25, 45), (px, py), int(assist_r * 1.5), 1)

            # Saturn Rings if applicable
            if planet.has_rings:
                pygame.draw.ellipse(surface, (160, 140, 100), (px - 55, py - 14, 110, 28), 3)
                pygame.draw.ellipse(surface, (210, 190, 150), (px - 44, py - 10, 88, 20), 2)

            # Planet Body
            pygame.draw.circle(surface, planet.color, (px, py), int(planet.radius))
            # Shaded crescent terminator
            pygame.draw.circle(surface, (15, 20, 30), (px + 6, py), int(planet.radius) - 2)

            # Label
            label = self.font_hud.render(f"{planet.name} (GRAVITY ASSIST)", True, COLOR_GOLD if planet.assist_boosted else COLOR_CYAN)
            surface.blit(label, (px - label.get_width() // 2, py + int(planet.radius) + 10))

        # Draw Interstellar Heliopause Escape Boundary
        pygame.draw.circle(surface, COLOR_EMERALD, (int(self.target_x), int(self.target_y)), int(self.target_radius), 2)
        esc_label = self.font_hud.render("HELIOPAUSE ESCAPE CORRIDOR", True, COLOR_EMERALD)
        surface.blit(esc_label, (int(self.target_x) - esc_label.get_width() // 2, int(self.target_y) - int(self.target_radius) - 18))

        # Draw Trajectory Breadcrumb Trail
        if len(self.trail) > 1:
            pygame.draw.lines(surface, (56, 189, 248), False, [(int(tx), int(ty)) for tx, ty in self.trail], 2)

        # Draw FX Particles
        self.particles.draw(surface, (0, 0))

        # Draw Voyager Space Probe Sprite rotated along velocity vector
        vel_ang = math.degrees(math.atan2(self.vy, self.vx))
        rot_probe = pygame.transform.rotate(SPRITES['voyager'], -vel_ang)
        probe_rect = rot_probe.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(rot_probe, probe_rect)

        # Radio wave transmission pulses from Voyager high-gain dish back toward Earth
        pulse_time = pygame.time.get_ticks() / 250.0
        p_rad = int(math.fmod(pulse_time * 12, 35) + 8)
        pygame.draw.circle(surface, (56, 189, 248), (int(self.x), int(self.y)), p_rad, 1)

        # ── TOP FLIGHT DIRECTOR HUD ──
        hud_panel = pygame.Surface((1024, 85), pygame.SRCALPHA)
        hud_panel.fill((10, 15, 26, 220))
        surface.blit(hud_panel, (0, 0))
        pygame.draw.line(surface, (30, 41, 59), (0, 85), (1024, 85), 1)

        title_surf = self.font_large.render(f"INTERPLANETARY PROBE: {self.mission.name.upper()}", True, COLOR_CYAN)
        surface.blit(title_surf, (24, 12))

        # Radio Callout message
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"DSN TRACKING: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (24, 38))
        else:
            time_surf = self.font.render(f"FLIGHT TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT)
            surface.blit(time_surf, (24, 38))

        # Gauges (Right side)
        spd_col = COLOR_EMERALD if self.current_speed_kms >= self.escape_velocity_kms else COLOR_GOLD
        draw_gauge(surface, 640, 14, 160, 16, self.current_speed_kms, self.escape_velocity_kms,
                   f"SPEED: {self.current_speed_kms:.1f} KM/S (REQ: {self.escape_velocity_kms:.1f})", spd_col)

        draw_gauge(surface, 640, 36, 160, 16, self.fuel, self.max_fuel,
                   f"HYDROGEN RCS: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 15 else COLOR_RED)

        assists_done = sum(1 for p in self.planets if p.assist_boosted)
        draw_gauge(surface, 640, 58, 160, 16, assists_done, len(self.planets),
                   f"SLINGSHOTS: {assists_done}/{len(self.planets)} EXECUTED", COLOR_CYAN)

        # Bottom Diagnostics & Controls Panel
        att_panel = pygame.Surface((340, 68), pygame.SRCALPHA)
        att_panel.fill((15, 23, 42, 210))
        surface.blit(att_panel, (24, 638))
        pygame.draw.rect(surface, (51, 65, 85), (24, 638, 340, 68), 1, border_radius=6)

        dist_dest = math.hypot(self.x - self.target_x, self.y - self.target_y)
        surface.blit(self.font.render(f"DISTANCE TO HELIOPAUSE: {int(dist_dest)} AU", True, COLOR_CYAN), (36, 646))
        surface.blit(self.font.render(f"GOLDEN RECORD TRANSMITTER: NOMINAL 2.3 GHz", True, COLOR_TEXT), (36, 666))
        surface.blit(self.font_hud.render("WASD: RCS TRAJECTORY CORRECTION BURNS", True, COLOR_TEXT_DIM), (36, 686))
