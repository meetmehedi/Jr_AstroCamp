"""
nasa_game/scenes/lander_scene.py
Lunar & Planetary Surface Lander Flight Simulator.
Features Apollo Lunar Module (LEM) with gold thermal foil, descent engine plasma,
surface dust storms, cold-gas RCS quads, and touchdown contact light radar.
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

class LanderScene:
    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Physics
        self.gravity = self.mission.params.get('gravity', 1.62)
        self.x = 512.0
        self.y = 80.0
        self.vx = random.uniform(-14.0, 14.0)
        self.vy = 4.0
        self.angle_deg = 0.0  # 0 is upright
        self.fuel = self.mission.params.get('fuel', 85.0)
        self.max_fuel = self.fuel

        self.max_touchdown_speed = self.mission.params.get('max_touchdown_speed', 2.4)
        self.zone_width = self.mission.params.get('zone_width', 160.0)
        self.time_left = self.mission.params.get('time_limit', 65.0)
        self.thrust_active = False

        # Generate Landing Site & Lunar Craters
        self.pad_x = 512.0
        self.pad_y = 610.0
        self.terrain_points: List[Tuple[int, int]] = []
        self._generate_terrain()

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [(random.randint(0, 1024), random.randint(0, 500), random.random()) for _ in range(80)]

        # Callouts & Contact Light
        self.contact_light = False
        self.callout_text = "PDI (POWERED DESCENT INITIATION) ACTIVE"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = pygame.font.SysFont("monospace", 13, bold=True)
        self.font_large = pygame.font.SysFont("monospace", 18, bold=True)
        self.font_hud = pygame.font.SysFont("monospace", 11)

    def _generate_terrain(self):
        random.seed(int(self.mission.id.replace('NASA-M', '')) * 37)
        points = []
        for x in range(0, 1025, 32):
            if abs(x - self.pad_x) < self.zone_width / 2:
                y = int(self.pad_y)
            else:
                roughness = random.randint(-55, 35)
                y = int(self.pad_y + roughness)
            points.append((x, y))
        self.terrain_points = points

    def handle_event(self, event: pygame.event.Event):
        pass

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Descent timeline expired — abort stage initiated.")
            return

        keys = pygame.key.get_pressed()
        thrust_power = 0.0
        self.thrust_active = False

        # Main descent engine throttle (W, UP, or SPACE)
        if (keys[pygame.K_w] or keys[pygame.K_UP] or keys[pygame.K_SPACE]) and self.fuel > 0:
            thrust_power = 42.0
            self.thrust_active = True
            self.fuel = max(0.0, self.fuel - dt * 14.0)
            self.shake.trigger(1.8, 0.1)
            if math.fmod(self.time_left, 0.35) < 0.09:
                sound_engine.play('thruster')

            # Emit descent flame
            rad = math.radians(self.angle_deg)
            flame_x = self.x - math.sin(rad) * 24.0
            flame_y = self.y + math.cos(rad) * 24.0
            self.particles.emit_flame(flame_x, flame_y, -self.angle_deg, speed=180.0, count=3)

            # Emit lunar surface dust if near the ground
            altitude_to_ground = self.pad_y - self.y
            if altitude_to_ground < 120.0:
                dust_y = self.y + altitude_to_ground
                self.particles.emit_dust(self.x, dust_y, color=(180, 185, 195), count=4)
                if altitude_to_ground < 35.0 and not self.contact_light:
                    self.callout_text = "RADAR: KICKING UP DUST — VISIBILITY REDUCED"
                    self.callout_timer = 2.0

        # RCS Attitude steering (tilt left / right)
        if (keys[pygame.K_a] or keys[pygame.K_LEFT]) and self.fuel > 0:
            self.angle_deg = max(-45.0, self.angle_deg - dt * 42.0)
            self.fuel = max(0.0, self.fuel - dt * 2.5)
            self.particles.emit_rcs(self.x + 22, self.y - 8, 35, 0, count=2)
        if (keys[pygame.K_d] or keys[pygame.K_RIGHT]) and self.fuel > 0:
            self.angle_deg = min(45.0, self.angle_deg + dt * 42.0)
            self.fuel = max(0.0, self.fuel - dt * 2.5)
            self.particles.emit_rcs(self.x - 22, self.y - 8, -35, 0, count=2)

        # Acceleration vectors with planetary gravity
        rad = math.radians(self.angle_deg)
        accel_x = thrust_power * math.sin(rad)
        accel_y = self.gravity * 8.5 - thrust_power * math.cos(rad)

        self.vx += accel_x * dt
        self.vy += accel_y * dt

        self.x += self.vx * dt
        self.y += self.vy * dt

        # Screen boundaries
        self.x = max(32.0, min(992.0, self.x))

        # Check Touchdown Ground Collision
        lander_bottom = self.y + 26
        ground_y = self._get_ground_y(self.x)

        if lander_bottom >= ground_y:
            self.y = ground_y - 26
            total_speed = math.hypot(self.vx, self.vy)
            in_zone = abs(self.x - self.pad_x) <= (self.zone_width / 2)
            upright = abs(self.angle_deg) <= 12.0

            if total_speed <= self.max_touchdown_speed and in_zone and upright:
                self.contact_light = True
                self._end_game(True, "TRANQUILITY BASE HERE: THE EAGLE HAS LANDED! Safe touchdown confirmed.")
            else:
                self.particles.emit_explosion(self.x, self.y + 10, count=35)
                self.shake.trigger(12.0, 0.5)
                if not in_zone:
                    self._end_game(False, "HARD TOUCHDOWN: Landed outside designated surveyed zone on boulder field.")
                elif total_speed > self.max_touchdown_speed:
                    self._end_game(False, f"LANDING GEAR COLLAPSE: Touchdown velocity ({total_speed:.1f} m/s) exceeded structural limit ({self.max_touchdown_speed:.1f} m/s).")
                else:
                    self._end_game(False, f"TIP-OVER: Excessive tilt angle ({self.angle_deg:.1f}°) caused rollover on contact.")
            return

        # Update FX
        self.particles.update(dt)
        self.shake.update(dt)

    def _get_ground_y(self, x: float) -> float:
        for i in range(len(self.terrain_points) - 1):
            x1, y1 = self.terrain_points[i]
            x2, y2 = self.terrain_points[i + 1]
            if x1 <= x <= x2:
                t = (x - x1) / (x2 - x1)
                return y1 + t * (y2 - y1)
        return self.pad_y

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        if success:
            sound_engine.play('victory')
            speed = math.hypot(self.vx, self.vy)
            softness = max(0.0, 1.0 - (speed / self.max_touchdown_speed))
            speed_score = int(softness * 450)
            fuel_score = int((self.fuel / max(1.0, self.max_fuel)) * 350)
            center_score = int((1.0 - abs(self.x - self.pad_x) / (self.zone_width / 2)) * 200)
            final_score = speed_score + fuel_score + center_score
        else:
            sound_engine.play('alarm')
            final_score = int((self.fuel / max(1.0, self.max_fuel)) * 100)

        self.on_finish(success, final_score, reason)

    def draw(self, surface: pygame.Surface):
        # Deep space cosmos
        surface.fill((3, 6, 12))

        # Stars
        for sx, sy, sb in self.stars:
            b_val = int(sb * 220)
            surface.set_at((sx, sy), (b_val, b_val, b_val))

        # Earth in Lunar Sky
        earth_pos = (860, 100)
        pygame.draw.circle(surface, (30, 80, 180), earth_pos, 22)
        pygame.draw.circle(surface, (16, 185, 129), (earth_pos[0] - 4, earth_pos[1] - 3), 10)
        pygame.draw.circle(surface, (56, 189, 248), earth_pos, 24, 1)

        ox, oy = self.shake.get_offset()

        # Lunar Terrain polygon
        terrain_poly = [(0, 720)] + [(px, py) for px, py in self.terrain_points] + [(1024, 720)]
        pygame.draw.polygon(surface, (55, 65, 81), terrain_poly)
        pygame.draw.lines(surface, (148, 163, 184), False, self.terrain_points, 2)

        # Designated Touchdown Zone / Landing Target
        pad_left = self.pad_x - self.zone_width / 2
        pad_right = self.pad_x + self.zone_width / 2
        pygame.draw.line(surface, COLOR_EMERALD, (pad_left, self.pad_y), (pad_right, self.pad_y), 3)

        # Pulsing Green Landing Beacons
        beacon_time = pygame.time.get_ticks() / 300.0
        beacon_col = (52, 211, 153) if math.sin(beacon_time) > 0 else (16, 185, 129)
        pygame.draw.circle(surface, beacon_col, (int(pad_left), int(self.pad_y) - 4), 5)
        pygame.draw.circle(surface, beacon_col, (int(pad_right), int(self.pad_y) - 4), 5)

        # Landing Radar Beam line to ground
        alt_ground = self._get_ground_y(self.x)
        pygame.draw.line(surface, (56, 189, 248, 80), (int(self.x), int(self.y + 18)), (int(self.x), int(alt_ground)), 1)

        # Draw Particles (Plasma Flame, RCS, Dust)
        self.particles.draw(surface, (0, 0))

        # Draw Apollo Lunar Module (LEM) Sprite rotated by angle
        lem_rot = pygame.transform.rotate(SPRITES['apollo_lem'], -self.angle_deg)
        lem_rect = lem_rot.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(lem_rot, lem_rect)

        # ── TELEMETRY & FLIGHT DIRECTOR HUD ──
        hud_panel = pygame.Surface((1024, 85), pygame.SRCALPHA)
        hud_panel.fill((10, 15, 26, 220))
        surface.blit(hud_panel, (0, 0))
        pygame.draw.line(surface, (30, 41, 59), (0, 85), (1024, 85), 1)

        # Title
        title_surf = self.font_large.render(f"LUNAR MODULE: {self.mission.name.upper()}", True, COLOR_CYAN)
        surface.blit(title_surf, (24, 12))

        # Contact Light Indicator
        contact_col = COLOR_EMERALD if self.contact_light else (75, 85, 99)
        pygame.draw.circle(surface, contact_col, (360, 20), 8)
        c_label = self.font_hud.render("CONTACT LIGHT", True, contact_col)
        surface.blit(c_label, (375, 14))

        # Radio Capcom Message
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"CAPCOM: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (24, 38))
        else:
            time_surf = self.font.render(f"DESCENT TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT)
            surface.blit(time_surf, (24, 38))

        # Gauges (Right side)
        vert_speed = self.vy
        v_col = COLOR_EMERALD if abs(vert_speed) <= self.max_touchdown_speed else COLOR_RED
        draw_gauge(surface, 640, 14, 160, 16, abs(vert_speed), 5.0,
                   f"V-SPEED: {vert_speed:.1f} M/S (MAX {self.max_touchdown_speed:.1f})", v_col)

        h_speed = abs(self.vx)
        draw_gauge(surface, 640, 36, 160, 16, h_speed, 10.0,
                   f"H-SPEED: {self.vx:.1f} M/S", COLOR_CYAN)

        draw_gauge(surface, 640, 58, 160, 16, self.fuel, self.max_fuel,
                   f"DESCENT FUEL: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 20 else COLOR_RED)

        # Bottom Attitude & Controls Panel
        att_panel = pygame.Surface((310, 68), pygame.SRCALPHA)
        att_panel.fill((15, 23, 42, 210))
        surface.blit(att_panel, (24, 638))
        pygame.draw.rect(surface, (51, 65, 85), (24, 638, 310, 68), 1, border_radius=6)

        alt_m = max(0.0, (self.pad_y - (self.y + 26)) * 0.8)
        alt_str = f"RADAR ALTITUDE: {alt_m:.1f} M"
        surface.blit(self.font.render(alt_str, True, COLOR_CYAN), (36, 646))

        tilt_str = f"TILT ANGLE: {self.angle_deg:.1f}° (MAX ±12°)"
        t_col = COLOR_EMERALD if abs(self.angle_deg) <= 12.0 else COLOR_RED
        surface.blit(self.font.render(tilt_str, True, t_col), (36, 666))

        surface.blit(self.font_hud.render("W/UP: DESCENT ENGINE  ·  A/D: RCS ATTITUDE", True, COLOR_TEXT_DIM), (36, 686))
