"""
nasa_game/scenes/rover_scene.py
Mars Surface Rover Teleoperation Flight Simulator.
Features 6-wheel rocker-bogie Mars Rover with persistent wheel tracks, robotic sample
core drill animations, Martian basalt boulders & craters, and dynamic sandstorm events.
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
        self.tracks: List[Tuple[float, float, float]] = []  # x, y, heading
        self._generate_map()

        # Sandstorm hazard
        self.sandstorm_active = False
        self.sandstorm_timer = 0.0
        self.sandstorm_chance = self.mission.params.get('sandstorm_chance', 0.25)

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()

        # Callouts
        self.callout_text = "SURFACE TELEOPERATION ACTIVE — NAVIGATE TO SCIENCE SITES"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = pygame.font.SysFont("monospace", 13, bold=True)
        self.font_large = pygame.font.SysFont("monospace", 18, bold=True)
        self.font_hud = pygame.font.SysFont("monospace", 11)

    def _generate_map(self):
        random.seed(int(self.mission.id.replace('NASA-M', '')) * 43)
        num_wp = int(self.mission.params.get('waypoints', 4))
        wp_names = ["Basalt Ridge", "Clay Carbonate", "Silica Vein", "Hematite Spherule", "Ancient Delta", "Meteorite Chunk"]

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

        # Sandstorm event update
        self.sandstorm_timer += dt
        if self.sandstorm_timer >= 10.0:
            self.sandstorm_timer = 0.0
            self.sandstorm_active = (random.random() < self.sandstorm_chance)
            if self.sandstorm_active:
                sound_engine.play('alarm')
                self.callout_text = "WARNING: MARTIAN SANDSTORM DETECTED — SOLAR POWER REDUCED"
                self.callout_timer = 3.5

        if self.sandstorm_active:
            # Emit orange-brown storm particles across screen
            for _ in range(4):
                self.particles.emit_dust(random.uniform(0, 1024), random.uniform(0, 720), color=(194, 90, 42), count=1)

        keys = pygame.key.get_pressed()
        is_steering = False

        # Steering (A / D or LEFT / RIGHT)
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            self.heading_deg -= 70.0 * dt
            is_steering = True
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            self.heading_deg += 70.0 * dt
            is_steering = True

        # Throttle (W / S or UP / DOWN)
        if (keys[pygame.K_w] or keys[pygame.K_UP]) and self.battery > 0:
            self.speed = min(90.0, self.speed + 120.0 * dt)
            drain = (7.0 if not self.sandstorm_active else 12.0) * dt
            self.battery = max(0.0, self.battery - drain)
        elif (keys[pygame.K_s] or keys[pygame.K_DOWN]) and self.battery > 0:
            self.speed = max(-45.0, self.speed - 90.0 * dt)
            self.battery = max(0.0, self.battery - 5.0 * dt)
        else:
            self.speed *= (1.0 - dt * 2.5)

        # Update position
        rad = math.radians(self.heading_deg)
        vx = math.cos(rad) * self.speed
        vy = math.sin(rad) * self.speed

        self.x += vx * dt
        self.y += vy * dt

        # Screen boundaries
        self.x = max(30.0, min(994.0, self.x))
        self.y = max(100.0, min(650.0, self.y))

        # Record Wheel Tracks & Emit Wheel Dust
        if abs(self.speed) > 5.0:
            self.particles.emit_dust(self.x, self.y, color=(160, 80, 45), count=1)
            if len(self.tracks) == 0 or math.hypot(self.x - self.tracks[-1][0], self.y - self.tracks[-1][1]) > 14.0:
                self.tracks.append((self.x, self.y, self.heading_deg))
                if len(self.tracks) > 300:
                    self.tracks.pop(0)

        # Check Science Waypoint Drilling & Sampling (SPACE when near target)
        self.drilling = False
        for wp in self.waypoints:
            if not wp.collected:
                dist = math.hypot(self.x - wp.x, self.y - wp.y)
                if dist < 42.0:
                    if keys[pygame.K_SPACE]:
                        self.drilling = True
                        wp.drill_progress += dt * 0.75
                        self.shake.trigger(2.0, 0.1)
                        if math.fmod(self.time_left, 0.3) < 0.1:
                            sound_engine.play('click')
                        self.particles.emit_dust(wp.x, wp.y, color=(220, 200, 160), count=2)

                        if wp.drill_progress >= 1.0:
                            wp.collected = True
                            sound_engine.play('quindar')
                            self.callout_text = f"SCIENCE CORE EXTRACTED: {wp.name.upper()} SECURED IN TUBE"
                            self.callout_timer = 3.5

        # Check Hazards Collision (Boulders & Craters)
        for hz in self.hazards:
            dist = math.hypot(self.x - hz.x, self.y - hz.y)
            if dist < hz.radius + 14.0:
                if abs(self.speed) > 35.0:
                    self.particles.emit_explosion(self.x, self.y, count=30)
                    self.shake.trigger(12.0, 0.5)
                    hazard_type = "deep impact crater" if hz.is_crater else "basalt boulder outcrop"
                    self._end_game(False, f"ROVER MOBILITY FAILURE: High-speed collision with {hazard_type} crippled wheel drive.")
                    return
                else:
                    # Slow bounce
                    self.speed = -self.speed * 0.5

        # Check All Collected Success
        if all(wp.collected for wp in self.waypoints):
            self._end_game(True, "SAMPLE CAMPAIGN SUCCESS! All planetary geological cores retrieved and cached.")
            return

        # Check Battery Depleted
        if self.battery <= 0 and not any(wp.collected for wp in self.waypoints):
            self._end_game(False, "RTG & BATTERY DEPLETED: Rover immobilized without scientific sample return.")
            return

        # Update FX
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
        # Martian Red Regolith Surface
        surface.fill((88, 38, 22))

        # Martian subtle terrain texture noise
        for rx, ry, _ in self.tracks[-60:]:
            pygame.draw.circle(surface, (72, 30, 16), (int(rx), int(ry)), 16)

        ox, oy = self.shake.get_offset()

        # Draw Persistent Rover Wheel Tracks in Sand
        for tx, ty, th in self.tracks:
            rad = math.radians(th + 90)
            t_perp_x = math.cos(rad) * 10
            t_perp_y = math.sin(rad) * 10
            # Left & right wheel tire marks
            pygame.draw.circle(surface, (58, 22, 12), (int(tx - t_perp_x), int(ty - t_perp_y)), 2)
            pygame.draw.circle(surface, (58, 22, 12), (int(tx + t_perp_x), int(ty + t_perp_y)), 2)

        # Draw Hazards (Boulders & Impact Craters)
        for hz in self.hazards:
            hx = int(hz.x)
            hy = int(hz.y)
            hr = int(hz.radius)
            if hz.is_crater:
                # Crater depression rim with inner shadow
                pygame.draw.circle(surface, (45, 18, 10), (hx, hy), hr)
                pygame.draw.circle(surface, (120, 55, 30), (hx, hy), hr, 2)
            else:
                # Basalt boulder with sunlight highlights
                pygame.draw.circle(surface, (40, 42, 48), (hx, hy), hr)
                pygame.draw.circle(surface, (80, 85, 95), (hx - 3, hy - 3), hr - 2)

        # Draw Science Target Waypoints
        for wp in self.waypoints:
            wx, wy = int(wp.x), int(wp.y)
            col = COLOR_EMERALD if wp.collected else COLOR_GOLD
            # Beacon target ring
            pygame.draw.circle(surface, col, (wx, wy), 24, 2)
            pygame.draw.circle(surface, col, (wx, wy), 5)

            # Drilling Progress Ring
            if not wp.collected and wp.drill_progress > 0:
                pygame.draw.arc(surface, COLOR_CYAN, (wx - 26, wy - 26, 52, 52), 0, math.pi * 2 * wp.drill_progress, 3)

            label = self.font_hud.render(f"{wp.name} {'✓' if wp.collected else ''}", True, col)
            surface.blit(label, (wx - label.get_width() // 2, wy + 28))

        # Draw Dust Particles & Sandstorm
        self.particles.draw(surface, (0, 0))

        # Draw Mars Rover Sprite rotated by heading
        # Sprite is oriented along x-axis forward (0 deg = right)
        rot_rover = pygame.transform.rotate(SPRITES['mars_rover'], -self.heading_deg)
        rover_rect = rot_rover.get_rect(center=(int(self.x + ox), int(self.y + oy)))
        surface.blit(rot_rover, rover_rect)

        # If drilling, draw robotic arm laser drill line
        if self.drilling:
            pygame.draw.line(surface, (56, 189, 248), (int(self.x), int(self.y)), (int(self.x + 12), int(self.y + 12)), 2)

        # ── TOP FLIGHT DIRECTOR HUD ──
        hud_panel = pygame.Surface((1024, 85), pygame.SRCALPHA)
        hud_panel.fill((10, 15, 26, 220))
        surface.blit(hud_panel, (0, 0))
        pygame.draw.line(surface, (30, 41, 59), (0, 85), (1024, 85), 1)

        title_surf = self.font_large.render(f"ROVER: {self.mission.name.upper()}", True, COLOR_CYAN)
        surface.blit(title_surf, (24, 12))

        # Radio Callout message
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"CAPCOM: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (24, 38))
        else:
            time_surf = self.font.render(f"SOL DAYLIGHT: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT)
            surface.blit(time_surf, (24, 38))

        # Gauges (Right side)
        collected_count = sum(1 for w in self.waypoints if w.collected)
        draw_gauge(surface, 640, 14, 160, 16, collected_count, len(self.waypoints),
                   f"SAMPLES: {collected_count}/{len(self.waypoints)} CACHED", COLOR_EMERALD)

        draw_gauge(surface, 640, 36, 160, 16, self.battery, self.max_battery,
                   f"BATTERY: {self.battery:.1f}%",
                   COLOR_GOLD if self.battery > 25 else COLOR_RED)

        spd_str = f"SPEED: {abs(self.speed * 0.1):.1f} KM/H"
        draw_gauge(surface, 640, 58, 160, 16, abs(self.speed), 90.0, spd_str, COLOR_CYAN)

        # Bottom Diagnostics & Controls Panel
        att_panel = pygame.Surface((340, 68), pygame.SRCALPHA)
        att_panel.fill((15, 23, 42, 210))
        surface.blit(att_panel, (24, 638))
        pygame.draw.rect(surface, (51, 65, 85), (24, 638, 340, 68), 1, border_radius=6)

        surface.blit(self.font.render(f"HEADING: {int(self.heading_deg) % 360}°", True, COLOR_CYAN), (36, 646))
        storm_str = "SANDSTORM: ACTIVE (POWER DRAIN ×2)" if self.sandstorm_active else "ENVIRONMENT: NOMINAL"
        storm_col = COLOR_RED if self.sandstorm_active else COLOR_EMERALD
        surface.blit(self.font.render(storm_str, True, storm_col), (36, 666))
        surface.blit(self.font_hud.render("WASD: DRIVE & STEER  ·  SPACE: DRILL SAMPLE CORE", True, COLOR_TEXT_DIM), (36, 686))
