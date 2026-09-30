"""
nasa_game/scenes/rover_scene.py
NASA Mars Perseverance / Curiosity Planetary Surface Teleoperation Simulator.
Features 6-wheel rocker-bogie kinematic driving, persistent Martian regolith tire tracks,
SuperCam laser sample core drilling, basalt boulder hazards, and atmospheric dust storm physics.
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

class Waypoint:
    def __init__(self, x: float, y: float, name: str):
        self.x = x
        self.y = y
        self.name = name
        self.collected = False
        self.drill_progress = 0.0

class Hazard:
    def __init__(self, x: float, y: float, radius: float, is_crater: bool):
        self.x = x
        self.y = y
        self.radius = radius
        self.is_crater = is_crater

class RoverScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Rover kinematics
        self.x = 200.0
        self.y = 360.0
        self.heading_deg = 0.0
        self.speed = 0.0
        self.battery = self.mission.params.get('battery', 95.0)
        self.max_battery = self.battery
        self.time_left = self.mission.params.get('time_limit', 65.0)
        self.drilling = False

        # Environment generation
        self.waypoints: List[Waypoint] = []
        self.hazards: List[Hazard] = []
        self.tracks: List[Tuple[float, float, float]] = []
        self._generate_map()

        # Sandstorm hazard
        self.sandstorm_active = False
        self.sandstorm_timer = 0.0
        self.sandstorm_chance = self.mission.params.get('sandstorm_chance', 0.25)

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()

        # Callouts
        self.callout_text = "SURFACE TELEMETRY ACTIVE // NAVIGATE TO SAMPLE WAYPOINTS"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = get_font(13, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_hud = get_font(11, bold=True, mono=True)

    def _generate_map(self):
        random.seed(int(self.mission.id.replace('NASA-M', '')) * 43)
        num_wp = int(self.mission.params.get('waypoints', 4))
        wp_names = ["Basalt Ridge", "Clay Carbonate", "Silica Vein", "Hematite Spherule", "Ancient Delta", "Meteorite Core"]

        for i in range(num_wp):
            wx = random.uniform(360, 920)
            wy = random.uniform(130, 600)
            self.waypoints.append(Waypoint(wx, wy, wp_names[i % len(wp_names)]))

        density = self.mission.params.get('hazard_density', 0.18)
        num_hazards = int(density * 60)
        for _ in range(num_hazards):
            hx = random.uniform(250, 950)
            hy = random.uniform(110, 620)
            hr = random.uniform(18, 36)
            is_crater = random.random() < 0.45
            self.hazards.append(Hazard(hx, hy, hr, is_crater))

    def handle_event(self, event: pygame.event.Event):
        pass

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Sol daylight ended before sample core retrieval was complete.")
            return

        # Sandstorm update
        self.sandstorm_timer += dt
        if self.sandstorm_timer >= 10.0:
            self.sandstorm_timer = 0.0
            self.sandstorm_active = (random.random() < self.sandstorm_chance)
            if self.sandstorm_active:
                sound_engine.play('alarm')
                self.callout_text = "WEATHER WARNING: DUST CONVECTIVE STORM // SOLAR ARRAY ATTENUATED"
                self.callout_timer = 3.5

        if self.sandstorm_active:
            for _ in range(4):
                self.particles.emit_dust(random.uniform(0, self.W), random.uniform(0, self.H), color=(185, 80, 36), count=1)

        keys = pygame.key.get_pressed()

        # Steering
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            self.heading_deg -= 68.0 * dt
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            self.heading_deg += 68.0 * dt

        # Throttle
        if (keys[pygame.K_w] or keys[pygame.K_UP]) and self.battery > 0:
            self.speed = min(88.0, self.speed + 120.0 * dt)
            drain = (6.5 if not self.sandstorm_active else 11.0) * dt
            self.battery = max(0.0, self.battery - drain)
        elif (keys[pygame.K_s] or keys[pygame.K_DOWN]) and self.battery > 0:
            self.speed = max(-42.0, self.speed - 90.0 * dt)
            self.battery = max(0.0, self.battery - 4.5 * dt)
        else:
            self.speed *= (1.0 - dt * 2.4)

        rad = math.radians(self.heading_deg)
        vx = math.cos(rad) * self.speed
        vy = math.sin(rad) * self.speed

        self.x += vx * dt
        self.y += vy * dt

        self.x = max(30.0, min(self.W - 30.0, self.x))
        self.y = max(100.0, min(self.H - 80.0, self.y))

        # Tire Tracks in Regolith
        if abs(self.speed) > 5.0:
            self.particles.emit_dust(self.x, self.y, color=(150, 70, 38), count=1)
            if len(self.tracks) == 0 or math.hypot(self.x - self.tracks[-1][0], self.y - self.tracks[-1][1]) > 14.0:
                self.tracks.append((self.x, self.y, self.heading_deg))
                if len(self.tracks) > 300:
                    self.tracks.pop(0)

        # Sampling with Spacebar
        self.drilling = False
        for wp in self.waypoints:
            if not wp.collected:
                dist = math.hypot(self.x - wp.x, self.y - wp.y)
                if dist < 42.0:
                    if keys[pygame.K_SPACE]:
                        self.drilling = True
                        wp.drill_progress += dt * 0.75
                        self.shake.trigger(1.8, 0.1)
                        if math.fmod(self.time_left, 0.3) < 0.1:
                            sound_engine.play('click')
                        self.particles.emit_dust(wp.x, wp.y, color=(210, 190, 150), count=2)

                        if wp.drill_progress >= 1.0:
                            wp.collected = True
                            sound_engine.play('quindar')
                            self.callout_text = f"SAMPLE RETRIEVED: {wp.name.upper()} HERMETICALLY SEALED"
                            self.callout_timer = 3.5

        # Hazards Collision
        for hz in self.hazards:
            dist = math.hypot(self.x - hz.x, self.y - hz.y)
            if dist < hz.radius + 14.0:
                if abs(self.speed) > 35.0:
                    self.particles.emit_explosion(self.x, self.y, count=30)
                    self.shake.trigger(12.0, 0.5)
                    hazard_type = "deep impact crater rim" if hz.is_crater else "basalt boulder outcrop"
                    self._end_game(False, f"ROVER MOBILITY FAILURE: High-speed impact with {hazard_type} sheared rocker bogie.")
                    return
                else:
                    self.speed = -self.speed * 0.5

        if all(wp.collected for wp in self.waypoints):
            self._end_game(True, "SAMPLE CAMPAIGN SUCCESS! All geological target cores retrieved.")
            return

        if self.battery <= 0 and not any(wp.collected for wp in self.waypoints):
            self._end_game(False, "RTG & BATTERY DEPLETED: Rover immobilized without scientific sample return.")
            return

        self.particles.update(dt)
        self.shake.update(dt)

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        if success:
            sound_engine.play('victory')
            collected_count = sum(1 for w in self.waypoints if w.collected)
            sample_score = collected_count * 200
            battery_score = int((self.battery / max(1.0, self.max_battery)) * 200)
            time_score = int((self.time_left / 65.0) * 150)
            final_score = sample_score + battery_score + time_score
        else:
            sound_engine.play('alarm')
            collected_count = sum(1 for w in self.waypoints if w.collected)
            final_score = collected_count * 150

        self.on_finish(success, final_score, reason)

    def draw(self, surface: pygame.Surface):
        # 1. Martian Ochre Regolith Ground
        surface.fill((75, 32, 18))

        ox, oy = self.shake.get_offset()

        # Wheel Tracks
        for tx, ty, th in self.tracks:
            rad = math.radians(th + 90)
            t_perp_x = math.cos(rad) * 10
            t_perp_y = math.sin(rad) * 10
            pygame.draw.circle(surface, (50, 18, 10), (int(tx - t_perp_x), int(ty - t_perp_y)), 2)
            pygame.draw.circle(surface, (50, 18, 10), (int(tx + t_perp_x), int(ty + t_perp_y)), 2)

        # Hazards
        for hz in self.hazards:
            hx, hy, hr = int(hz.x), int(hz.y), int(hz.radius)
            if hz.is_crater:
                pygame.draw.circle(surface, (38, 14, 8), (hx, hy), hr)
                pygame.draw.circle(surface, (115, 48, 26), (hx, hy), hr, 2)
            else:
                pygame.draw.circle(surface, (30, 32, 38), (hx, hy), hr)
                pygame.draw.circle(surface, (71, 75, 85), (hx - 2, hy - 2), hr - 2)

        # Science Waypoints
        for wp in self.waypoints:
            wx, wy = int(wp.x), int(wp.y)
            col = COLOR_EMERALD if wp.collected else COLOR_GOLD
            pygame.draw.circle(surface, col, (wx, wy), 22, 2)
            pygame.draw.circle(surface, col, (wx, wy), 4)

            if not wp.collected and wp.drill_progress > 0:
                pygame.draw.arc(surface, COLOR_CYAN, (wx - 24, wy - 24, 48, 48), 0, math.pi * 2 * wp.drill_progress, 2)

            label = self.font_hud.render(f"{wp.name.upper()} {'[OK]' if wp.collected else ''}", True, col)
            surface.blit(label, (wx - label.get_width() // 2, wy + 26))

        self.particles.draw(surface, (0, 0))

        # Rover Sprite
        rot_rover = pygame.transform.rotate(SPRITES['mars_rover'], -self.heading_deg)
        rover_rect = rot_rover.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(rot_rover, rover_rect)

        # Laser Drill Line
        if self.drilling:
            pygame.draw.line(surface, (56, 189, 248), (int(self.x), int(self.y)), (int(self.x + 12), int(self.y + 12)), 2)

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="MARS ROVER SURFACE TELEOPERATION MFD")

        v_name = self.mission.name.upper()
        if len(v_name) > 26:
            v_name = v_name[:24] + "..."
        surface.blit(self.font_large.render(f"ROVER: {v_name}", True, COLOR_CYAN), (26, 32))

        if self.callout_timer > 0:
            surface.blit(self.font_hud.render(f"MISSION CONTROL: \"{self.callout_text}\"", True, COLOR_GOLD), (26, 58))
        else:
            surface.blit(self.font.render(f"SOL DAYLIGHT WINDOW: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT_DIM), (26, 58))

        # Gauges
        collected_count = sum(1 for w in self.waypoints if w.collected)
        draw_gauge(surface, 620, 24, 380, 18, collected_count, len(self.waypoints),
                   f"SAMPLE CORES: {collected_count}/{len(self.waypoints)} CACHED", COLOR_EMERALD)

        draw_gauge(surface, 620, 46, 380, 18, self.battery, self.max_battery,
                   f"MMRTG & BATTERY: {self.battery:.1f}%",
                   COLOR_GOLD if self.battery > 25 else COLOR_RED)

        spd_str = f"SPEED: {abs(self.speed * 0.1):.1f} KM/H"
        draw_gauge(surface, 620, 68, 380, 18, abs(self.speed), 88.0, spd_str, COLOR_CYAN)

        # Bottom Diagnostics
        draw_hud_panel(surface, pygame.Rect(12, self.H - 84, 400, 72), title="MOBILITY & DRILL DIAGNOSTICS")
        surface.blit(self.font.render(f"AZIMUTH HEADING: {int(self.heading_deg) % 360}°", True, COLOR_CYAN), (26, self.H - 68))
        storm_str = "DUST STORM: ACTIVE (SOLAR FLUX DEGRADED)" if self.sandstorm_active else "ATMOSPHERE: NOMINAL"
        storm_col = COLOR_RED if self.sandstorm_active else COLOR_EMERALD
        surface.blit(self.font.render(storm_str, True, storm_col), (26, self.H - 48))
        surface.blit(self.font_hud.render("[WASD] KINEMATIC DRIVE  |  [SPACE] SAMPLE CORE DRILL", True, COLOR_TEXT_DIM), (26, self.H - 28))
