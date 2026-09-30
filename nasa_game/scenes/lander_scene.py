"""
nasa_game/scenes/lander_scene.py
Apollo Lunar Module (LEM) & Planetary Lander Flight Simulator.
Features realistic lunar surface regolith shaders, crater elevation profiles,
radar altimeter telemetry cone, and authentic Apollo PDI Guidance HUD.
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

class LanderScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Physics & Surface Parameters
        self.gravity = self.mission.params.get('gravity', 1.62)
        self.x = 512.0
        self.y = 80.0
        self.vx = random.uniform(-12.0, 12.0)
        self.vy = 4.0
        self.angle_deg = 0.0  # 0 is upright attitude
        self.fuel = self.mission.params.get('fuel', 85.0)
        self.max_fuel = self.fuel

        self.max_touchdown_speed = self.mission.params.get('max_touchdown_speed', 2.4)
        self.zone_width = self.mission.params.get('zone_width', 160.0)
        self.time_left = self.mission.params.get('time_limit', 65.0)
        self.thrust_active = False

        # Generate Cratered Terrain Contour
        self.pad_x = 512.0
        self.pad_y = 610.0
        self.terrain_points: List[Tuple[int, int]] = []
        self._generate_terrain()

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [
            (random.randint(0, self.W), random.randint(0, 500), random.random(), random.uniform(0.6, 2.0))
            for _ in range(120)
        ]

        # Callouts & Contact Light
        self.contact_light = False
        self.callout_text = "PDI (POWERED DESCENT INITIATION) ENGAGED"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = get_font(13, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_hud = get_font(11, bold=True, mono=True)

    def _generate_terrain(self):
        random.seed(int(self.mission.id.replace('NASA-M', '')) * 37)
        points = []
        for x in range(0, 1025, 24):
            if abs(x - self.pad_x) < self.zone_width / 2:
                y = int(self.pad_y)
            else:
                roughness = random.randint(-50, 30)
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
            thrust_power = 44.0
            self.thrust_active = True
            self.fuel = max(0.0, self.fuel - dt * 13.5)
            self.shake.trigger(1.5, 0.1)
            if math.fmod(self.time_left, 0.35) < 0.09:
                sound_engine.play('thruster')

            # Tail Flame Particles
            rad = math.radians(self.angle_deg)
            flame_x = self.x - math.sin(rad) * 24.0
            flame_y = self.y + math.cos(rad) * 24.0
            self.particles.emit_flame(flame_x, flame_y, -self.angle_deg, speed=190.0, count=3)

            # Surface dust blowing
            altitude_to_ground = self.pad_y - self.y
            if altitude_to_ground < 130.0:
                dust_y = self.y + altitude_to_ground
                self.particles.emit_dust(self.x, dust_y, color=(165, 175, 185), count=4)
                if altitude_to_ground < 35.0 and not self.contact_light:
                    self.callout_text = "RADAR: SURFACE VISIBILITY REDUCED BY REGOLITH EJECTA"
                    self.callout_timer = 2.0

        # RCS Attitude steering
        if (keys[pygame.K_a] or keys[pygame.K_LEFT]) and self.fuel > 0:
            self.angle_deg = max(-45.0, self.angle_deg - dt * 40.0)
            self.fuel = max(0.0, self.fuel - dt * 2.2)
            self.particles.emit_rcs(self.x + 22, self.y - 8, 35, 0, count=2)
        if (keys[pygame.K_d] or keys[pygame.K_RIGHT]) and self.fuel > 0:
            self.angle_deg = min(45.0, self.angle_deg + dt * 40.0)
            self.fuel = max(0.0, self.fuel - dt * 2.2)
            self.particles.emit_rcs(self.x - 22, self.y - 8, -35, 0, count=2)

        # Vector acceleration
        rad = math.radians(self.angle_deg)
        accel_x = thrust_power * math.sin(rad)
        accel_y = self.gravity * 8.2 - thrust_power * math.cos(rad)

        self.vx += accel_x * dt
        self.vy += accel_y * dt

        self.x += self.vx * dt
        self.y += self.vy * dt

        self.x = max(32.0, min(992.0, self.x))

        # Check Ground Contact
        lander_bottom = self.y + 26
        ground_y = self._get_ground_y(self.x)

        if lander_bottom >= ground_y:
            self.y = ground_y - 26
            total_speed = math.hypot(self.vx, self.vy)
            in_zone = abs(self.x - self.pad_x) <= (self.zone_width / 2)
            upright = abs(self.angle_deg) <= 12.0

            if total_speed <= self.max_touchdown_speed and in_zone and upright:
                self.contact_light = True
                self._end_game(True, "TRANQUILITY BASE CONFIRMED: THE EAGLE HAS LANDED. Touchdown nominal.")
            else:
                self.particles.emit_explosion(self.x, self.y + 10, count=35)
                self.shake.trigger(12.0, 0.5)
                if not in_zone:
                    self._end_game(False, "TOUCHDOWN OFF-NOMINAL: Landed outside surveyed target zone on boulder field.")
                elif total_speed > self.max_touchdown_speed:
                    self._end_game(False, f"STRUT FAILURE: Vertical touchdown speed ({total_speed:.1f} m/s) exceeded structural threshold ({self.max_touchdown_speed:.1f} m/s).")
                else:
                    self._end_game(False, f"ROLLOVER DYNAMICS: Excessive attitude angle ({self.angle_deg:.1f}°) caused tip-over.")
            return

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
        # 1. Deep Space Cosmos Background
        surface.fill(COLOR_BG)

        # Twinkling Stars
        for sx, sy, sb, spd in self.stars:
            lum = int(sb * 230)
            pygame.draw.circle(surface, (lum, lum, min(255, int(lum * 1.1))), (int(sx), int(sy)), 1 if sb < 0.75 else 2)

        # Realistic Earthrise in Lunar Horizon
        earth_pos = (860, 110)
        # Deep blue ocean sphere
        pygame.draw.circle(surface, (15, 45, 110), earth_pos, 22)
        # Swirling cloud bands and continents
        pygame.draw.circle(surface, (16, 185, 129), (earth_pos[0] - 4, earth_pos[1] - 3), 9)
        pygame.draw.circle(surface, (241, 245, 249), (earth_pos[0] + 5, earth_pos[1] - 6), 6)
        # Atmospheric blue limb haze
        pygame.draw.circle(surface, (56, 189, 248), earth_pos, 24, 1)

        ox, oy = self.shake.get_offset()

        # 2. Lunar Regolith Cratered Surface
        # Shaded Terrain Polygon
        terrain_poly = [(0, self.H)] + [(px, py) for px, py in self.terrain_points] + [(self.W, self.H)]
        pygame.draw.polygon(surface, (30, 41, 59), terrain_poly)
        # Highlighted Rim Crest
        pygame.draw.lines(surface, (148, 163, 184), False, self.terrain_points, 2)

        # 3. Designated Landing Target Grid
        pad_left = self.pad_x - self.zone_width / 2
        pad_right = self.pad_x + self.zone_width / 2
        pygame.draw.line(surface, COLOR_EMERALD, (pad_left, self.pad_y), (pad_right, self.pad_y), 2)
        
        # Crosshair Markers at Touchdown Center
        pygame.draw.line(surface, (56, 189, 248), (self.pad_x, self.pad_y - 10), (self.pad_x, self.pad_y + 10), 1)
        pygame.draw.line(surface, (56, 189, 248), (self.pad_x - 10, self.pad_y), (self.pad_x + 10, self.pad_y), 1)

        # Precision Optical Landing Strobes
        beacon_time = pygame.time.get_ticks() / 250.0
        beacon_col = COLOR_EMERALD if math.sin(beacon_time) > 0 else (6, 95, 70)
        pygame.draw.circle(surface, beacon_col, (int(pad_left), int(self.pad_y) - 2), 4)
        pygame.draw.circle(surface, beacon_col, (int(pad_right), int(self.pad_y) - 2), 4)

        # Radar Altimeter Beam Line
        alt_ground = self._get_ground_y(self.x)
        pygame.draw.line(surface, (56, 189, 248), (int(self.x), int(self.y + 18)), (int(self.x), int(alt_ground)), 1)

        # Particle FX
        self.particles.draw(surface, (0, 0))

        # 4. Apollo Lunar Module (LEM) Sprite
        lem_rot = pygame.transform.rotate(SPRITES['apollo_lem'], -self.angle_deg)
        lem_rect = lem_rot.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(lem_rot, lem_rect)

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        # Top Header Bar (Mission Profile & Guidance)
        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="APOLLO DESCENT GUIDANCE COMPUTER (PGNCS)")

        # Vehicle Name
        v_name = self.mission.name.upper()
        if len(v_name) > 20:
            v_name = v_name[:18] + "..."
        surface.blit(self.font_large.render(f"LEM: {v_name}", True, COLOR_CYAN), (26, 32))

        # Contact Light Status Box
        contact_col = COLOR_EMERALD if self.contact_light else (55, 65, 81)
        pygame.draw.rect(surface, (15, 23, 42), (360, 30, 150, 24), border_radius=2)
        pygame.draw.rect(surface, contact_col, (360, 30, 150, 24), 1, border_radius=2)
        pygame.draw.circle(surface, contact_col, (374, 42), 5)
        c_label = self.font_hud.render("CONTACT LIGHT", True, contact_col if self.contact_light else COLOR_TEXT_DIM)
        surface.blit(c_label, (386, 36))

        # Radio Capcom Message / Timeline
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"CAPCOM: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (26, 58))
        else:
            time_surf = self.font.render(f"TIMELINE: {self.time_left:.1f}s REMAINING BEFORE BTM CUTOFF", True, COLOR_TEXT_DIM)
            surface.blit(time_surf, (26, 58))

        # Right Telemetry Gauges (V-Speed, H-Speed, Fuel)
        vert_speed = self.vy
        v_col = COLOR_EMERALD if abs(vert_speed) <= self.max_touchdown_speed else COLOR_RED
        draw_gauge(surface, 620, 24, 380, 18, abs(vert_speed), 5.0,
                   f"V-VELOCITY: {vert_speed:.1f} M/S (LIMIT {self.max_touchdown_speed:.1f})", v_col)

        h_speed = abs(self.vx)
        draw_gauge(surface, 620, 46, 380, 18, h_speed, 10.0,
                   f"H-VELOCITY: {self.vx:.1f} M/S", COLOR_CYAN)

        draw_gauge(surface, 620, 68, 380, 18, self.fuel, self.max_fuel,
                   f"DPS PROPELLANT: {self.fuel:.1f}s",
                   COLOR_GOLD if self.fuel > 20 else COLOR_RED)

        # Bottom Attitude & Controls Panel
        draw_hud_panel(surface, pygame.Rect(12, self.H - 84, 380, 72), title="ATTITUDE & RADAR TAPE")
        alt_m = max(0.0, (self.pad_y - (self.y + 26)) * 0.8)
        surface.blit(self.font.render(f"RADAR ALTITUDE: {alt_m:.1f} M", True, COLOR_CYAN), (26, self.H - 68))
        
        tilt_str = f"PITCH ERROR: {self.angle_deg:.1f}° (MAX ±12°)"
        t_col = COLOR_EMERALD if abs(self.angle_deg) <= 12.0 else COLOR_RED
        surface.blit(self.font.render(tilt_str, True, t_col), (26, self.H - 48))
        surface.blit(self.font_hud.render("[W/UP] THROTTLE  |  [A/D] RCS TRANSLATION", True, COLOR_TEXT_DIM), (26, self.H - 28))
