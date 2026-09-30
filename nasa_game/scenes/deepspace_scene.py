"""
nasa_game/scenes/deepspace_scene.py
NASA Voyager / New Horizons Interplanetary Slingshot & Gravity-Assist Simulator.
Features N-body planetary gravity wells, orbital slingshot hyperbolic trajectories,
Deep Space Network (DSN) radio telemetry, and interstellar heliopause escape boundaries.
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
    COLOR_ORANGE, COLOR_TEXT, COLOR_TEXT_DIM, COLOR_PANEL_BORDER,
    draw_gauge, draw_hud_panel, get_font
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
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Voyager probe kinematics
        self.x = 120.0
        self.y = 520.0
        self.vx = 48.0
        self.vy = -34.0
        self.fuel = self.mission.params.get('fuel', 70.0)
        self.max_fuel = self.fuel
        self.time_left = self.mission.params.get('time_limit', 60.0)

        # Solar system bodies
        self.planets: List[Planet] = []
        self._setup_planets()

        # Interstellar Escape Boundary
        self.target_x = 940.0
        self.target_y = 180.0
        self.target_radius = 65.0
        self.escape_velocity_kms = 17.0
        self.current_speed_kms = 12.0

        # Trajectory trail
        self.trail: List[Tuple[float, float]] = []

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H), random.random(), random.uniform(0.6, 2.0))
            for _ in range(130)
        ]

        # Callouts
        self.callout_text = "INTERPLANETARY TRAJECTORY ACTIVE // ENTER GRAVITY-ASSIST CORRIDOR"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = get_font(13, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_hud = get_font(11, bold=True, mono=True)

    def _setup_planets(self):
        jupiter = Planet(480.0, 370.0, 48000.0, 38.0, "JUPITER", (195, 130, 75))
        saturn = Planet(760.0, 240.0, 28000.0, 28.0, "SATURN", (215, 185, 130), has_rings=True)
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

        # N-Body Gravitational Physics
        for planet in self.planets:
            dx = planet.x - self.x
            dy = planet.y - self.y
            dist = math.hypot(dx, dy)

            if dist < planet.radius + 6.0:
                self.particles.emit_explosion(self.x, self.y, count=40)
                self.shake.trigger(14.0, 0.6)
                self._end_game(False, f"ATMOSPHERIC RE-ENTRY: Probe collided with {planet.name}'s dense atmosphere.")
                return

            assist_corridor = planet.radius * 2.8
            if dist < assist_corridor:
                if not planet.assist_boosted:
                    planet.assist_boosted = True
                    self.current_speed_kms += 4.5
                    self.particles.emit_rcs(self.x, self.y, self.vx * 0.5, self.vy * 0.5, count=6)
                    self.shake.trigger(4.0, 0.25)
                    sound_engine.play('quindar')
                    self.callout_text = f"GRAVITY ASSIST ACHIEVED: {planet.name} HYPERBOLIC BOOST +4.5 KM/S"
                    self.callout_timer = 3.5

            grav_accel = planet.mass / (dist ** 2)
            self.vx += (dx / dist) * grav_accel * dt
            self.vy += (dy / dist) * grav_accel * dt

        self.x += self.vx * dt
        self.y += self.vy * dt

        spd_px = math.hypot(self.vx, self.vy)
        self.current_speed_kms = 10.0 + (spd_px * 0.12)

        if len(self.trail) == 0 or math.hypot(self.x - self.trail[-1][0], self.y - self.trail[-1][1]) > 8.0:
            self.trail.append((self.x, self.y))
            if len(self.trail) > 180:
                self.trail.pop(0)

        dist_to_target = math.hypot(self.x - self.target_x, self.y - self.target_y)
        if dist_to_target < self.target_radius:
            if self.current_speed_kms >= self.escape_velocity_kms:
                self._end_game(True, "INTERSTELLAR HELIOPAUSE REACHED! Spacecraft has entered interstellar space.")
            else:
                self._end_game(False, f"SUB-ESCAPE TRAJECTORY: Hyperbolic velocity ({self.current_speed_kms:.1f} km/s) insufficient for Solar System escape.")
            return

        if self.x < -40 or self.x > 1080 or self.y < -40 or self.y > 760:
            self._end_game(False, "TRAJECTORY DRIFT: Probe missed gravitational assist corridor and drifted into deep space.")
            return

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
        # 1. Interplanetary Void
        surface.fill(COLOR_BG)

        for sx, sy, sb, spd in self.stars:
            lum = int(sb * 220)
            pygame.draw.circle(surface, (lum, lum, min(255, int(lum * 1.1))), (int(sx), int(sy)), 1 if sb < 0.75 else 2)

        ox, oy = self.shake.get_offset()

        # 2. Planetary Gravity Wells
        for planet in self.planets:
            px, py = int(planet.x), int(planet.y)

            assist_r = int(planet.radius * 2.8)
            pygame.draw.circle(surface, (20, 32, 50), (px, py), assist_r, 1)
            pygame.draw.circle(surface, (14, 22, 38), (px, py), int(assist_r * 1.5), 1)

            if planet.has_rings:
                pygame.draw.ellipse(surface, (150, 130, 95), (px - 55, py - 14, 110, 28), 3)
                pygame.draw.ellipse(surface, (190, 170, 135), (px - 44, py - 10, 88, 20), 2)

            pygame.draw.circle(surface, planet.color, (px, py), int(planet.radius))
            pygame.draw.circle(surface, (11, 15, 24), (px + 6, py), int(planet.radius) - 2)

            label = self.font_hud.render(f"{planet.name} // GRAVITY ASSIST", True, COLOR_GOLD if planet.assist_boosted else COLOR_CYAN)
            surface.blit(label, (px - label.get_width() // 2, py + int(planet.radius) + 8))

        # 3. Heliopause Escape Boundary
        pygame.draw.circle(surface, COLOR_EMERALD, (int(self.target_x), int(self.target_y)), int(self.target_radius), 2)
        esc_label = self.font_hud.render("HELIOPAUSE ESCAPE CORRIDOR", True, COLOR_EMERALD)
        surface.blit(esc_label, (int(self.target_x) - esc_label.get_width() // 2, int(self.target_y) - int(self.target_radius) - 16))

        # 4. Trajectory Vector Path
        if len(self.trail) > 1:
            pygame.draw.lines(surface, (56, 189, 248), False, [(int(tx), int(ty)) for tx, ty in self.trail], 2)

        self.particles.draw(surface, (0, 0))

        # 5. Voyager Spacecraft Sprite
        vel_ang = math.degrees(math.atan2(self.vy, self.vx))
        rot_probe = pygame.transform.rotate(SPRITES['voyager'], -vel_ang)
        probe_rect = rot_probe.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(rot_probe, probe_rect)

        # DSN Carrier Wave pulse
        pulse_time = pygame.time.get_ticks() / 250.0
        p_rad = int(math.fmod(pulse_time * 12, 35) + 8)
        pygame.draw.circle(surface, (56, 189, 248), (int(self.x), int(self.y)), p_rad, 1)

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="INTERPLANETARY ASTRODYNAMICS & DSN TELEMETRY")

        v_name = self.mission.name.upper()
        if len(v_name) > 26:
            v_name = v_name[:24] + "..."
        surface.blit(self.font_large.render(f"PROBE: {v_name}", True, COLOR_CYAN), (26, 32))

        if self.callout_timer > 0:
            surface.blit(self.font_hud.render(f"DEEP SPACE NETWORK: \"{self.callout_text}\"", True, COLOR_GOLD), (26, 58))
        else:
            surface.blit(self.font.render(f"FLIGHT TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT_DIM), (26, 58))

        # Gauges
        spd_col = COLOR_EMERALD if self.current_speed_kms >= self.escape_velocity_kms else COLOR_GOLD
        draw_gauge(surface, 620, 24, 380, 18, self.current_speed_kms, self.escape_velocity_kms,
                   f"HELIOCENTRIC VELOCITY: {self.current_speed_kms:.1f} / {self.escape_velocity_kms:.1f} KM/S", spd_col)

        draw_gauge(surface, 620, 46, 380, 18, self.fuel, self.max_fuel,
                   f"HYDRAZINE MONOPROPELLANT: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 15 else COLOR_RED)

        assists_done = sum(1 for p in self.planets if p.assist_boosted)
        draw_gauge(surface, 620, 68, 380, 18, assists_done, len(self.planets),
                   f"GRAVITY ASSISTS: {assists_done}/{len(self.planets)} EXECUTED", COLOR_CYAN)

        # Bottom Diagnostics
        draw_hud_panel(surface, pygame.Rect(12, self.H - 84, 400, 72), title="MISSION CORRIDOR DIAGNOSTICS")
        dist_dest = math.hypot(self.x - self.target_x, self.y - self.target_y)
        surface.blit(self.font.render(f"DISTANCE TO HELIOPAUSE: {int(dist_dest)} AU", True, COLOR_CYAN), (26, self.H - 68))
        surface.blit(self.font.render(f"DSN CARRIER DOWNLINK: 2.3 GHz LOCKED", True, COLOR_TEXT), (26, self.H - 48))
        surface.blit(self.font_hud.render("[WASD/ARROWS] RCS COURSE CORRECTION BURNS", True, COLOR_TEXT_DIM), (26, self.H - 28))
