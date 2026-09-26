"""
nasa_game/scenes/telescope_scene.py
Space Observatory & Telescope Spectroscopy Flight Simulator.
Features James Webb (JWST) / Hubble Observatory with 18 gold hexagonal mirror arrays,
Fine Guidance Sensor (FGS) drift compensation, multi-spectral filters, and celestial spectroscopy.
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

class CelestialTarget:
    def __init__(self, x: float, y: float, name: str, cat_type: str, required_photons: float, color: Tuple[int, int, int]):
        self.x = x
        self.y = y
        self.name = name
        self.cat_type = cat_type
        self.required_photons = required_photons
        self.photons_collected = 0.0
        self.color = color
        self.completed = False

class TelescopeScene:
    def __init__(self, mission: Mission, on_finish: Callable[[bool, int, str], None]):
        self.mission = mission
        self.on_finish = on_finish

        # Reticle pointing & gyro drift
        self.reticle_x = 512.0
        self.reticle_y = 360.0
        self.drift_vx = 0.0
        self.drift_vy = 0.0
        self.drift_speed = self.mission.params.get('drift_speed', 12.0)
        self.time_left = self.mission.params.get('time_limit', 55.0)

        # Celestial targets
        self.targets: List[CelestialTarget] = []
        self.active_target_idx = 0
        self._generate_sky_targets()

        # Multi-spectral filter mode (0: Infrared, 1: Visible/Optical, 2: Deep X-Ray)
        self.filter_mode = 0
        self.filter_names = ["NEAR-INFRARED (NIRCam)", "OPTICAL (WFC3)", "MID-INFRARED (MIRI)"]

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [(random.randint(0, 1024), random.randint(0, 720), random.random()) for _ in range(160)]

        # Callouts
        self.callout_text = "FINE GUIDANCE SENSOR (FGS) LOCKED — ALIGN OPTICAL RETICLE"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = pygame.font.SysFont("monospace", 13, bold=True)
        self.font_large = pygame.font.SysFont("monospace", 18, bold=True)
        self.font_hud = pygame.font.SysFont("monospace", 11)

    def _generate_sky_targets(self):
        targets_info = [
            ("CARINA NEBULA NGC 3324", "Cosmic Cliffs", 35.0, (235, 120, 60)),
            ("STEPHAN'S QUINTET", "Interacting Galaxies", 40.0, (56, 189, 248)),
            ("SOUTHERN RING NEBULA", "Planetary Dying Star", 35.0, (192, 132, 252)),
            ("SMACS 0723 DEEP FIELD", "Gravitational Lens", 45.0, (251, 191, 36)),
        ]
        coords = [(280, 240), (740, 220), (320, 520), (700, 510)]
        for i, (name, cat_type, req, col) in enumerate(targets_info):
            cx, cy = coords[i]
            self.targets.append(CelestialTarget(cx, cy, name, cat_type, req, col))

    def handle_event(self, event: pygame.event.Event):
        if self.is_over:
            return
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_TAB or event.key == pygame.K_f:
                # Cycle filters
                self.filter_mode = (self.filter_mode + 1) % len(self.filter_names)
                sound_engine.play('click')

    def update(self, dt: float):
        if self.is_over:
            return

        self.time_left -= dt
        self.callout_timer -= dt

        if self.time_left <= 0:
            self._end_game(False, "Observatory observation exposure window expired.")
            return

        # Atmospheric shimmer / Reaction wheel gyro drift
        self.drift_vx += random.uniform(-self.drift_speed, self.drift_speed) * dt * 3.0
        self.drift_vy += random.uniform(-self.drift_speed, self.drift_speed) * dt * 3.0
        self.drift_vx *= (1.0 - dt * 1.5)
        self.drift_vy *= (1.0 - dt * 1.5)

        self.reticle_x += self.drift_vx * dt
        self.reticle_y += self.drift_vy * dt

        # User reaction wheel controls (WASD or Arrows or Mouse)
        keys = pygame.key.get_pressed()
        steer_spd = 220.0 * dt
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            self.reticle_x -= steer_spd
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            self.reticle_x += steer_spd
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            self.reticle_y -= steer_spd
        if keys[pygame.K_s] or keys[pygame.K_DOWN]:
            self.reticle_y += steer_spd

        # Mouse assistance: gently pull toward mouse if clicked
        if pygame.mouse.get_pressed()[0]:
            mx, my = pygame.mouse.get_pos()
            self.reticle_x += (mx - self.reticle_x) * dt * 4.0
            self.reticle_y += (my - self.reticle_y) * dt * 4.0

        # Screen boundaries
        self.reticle_x = max(60.0, min(964.0, self.reticle_x))
        self.reticle_y = max(110.0, min(620.0, self.reticle_y))

        # Check Photon Integration on Celestial Targets
        current_target = self.targets[self.active_target_idx]
        if not current_target.completed:
            dist = math.hypot(self.reticle_x - current_target.x, self.reticle_y - current_target.y)
            if dist < 45.0:
                # Inside focal tolerance — accumulating photons
                integration_rate = 18.0 * (1.0 - (dist / 45.0))
                current_target.photons_collected += integration_rate * dt
                self.particles.emit_rcs(current_target.x, current_target.y, random.uniform(-10, 10), random.uniform(-10, 10), count=1)

                if math.fmod(self.time_left, 0.4) < 0.1:
                    sound_engine.play('click')

                if current_target.photons_collected >= current_target.required_photons:
                    current_target.completed = True
                    sound_engine.play('quindar')
                    self.callout_text = f"SPECTRAL IMAGE RESOLVED: {current_target.name} COMPLETED"
                    self.callout_timer = 3.5

                    # Advance to next target
                    if self.active_target_idx + 1 < len(self.targets):
                        self.active_target_idx += 1
                    else:
                        self._end_game(True, "DEEP FIELD SURVEY COMPLETE! All astronomical targets resolved at high resolution.")
                        return

        # Update FX
        self.particles.update(dt)
        self.shake.update(dt)

    def _end_game(self, success: bool, reason: str):
        self.is_over = True
        if success:
            sound_engine.play('victory')
            completed_count = sum(1 for t in self.targets if t.completed)
            img_score = completed_count * 250
            time_score = int((self.time_left / 55.0) * 200)
            final_score = img_score + time_score
        else:
            sound_engine.play('alarm')
            completed_count = sum(1 for t in self.targets if t.completed)
            final_score = completed_count * 150

        self.on_finish(success, final_score, reason)

    def draw(self, surface: pygame.Surface):
        # Deep space cosmos
        surface.fill((2, 3, 8))

        # Starfield
        for sx, sy, sb in self.stars:
            b_val = int(sb * 240)
            surface.set_at((sx, sy), (b_val, b_val, b_val))

        # Draw Celestial Targets (Nebulae / Galaxies)
        for i, target in enumerate(self.targets):
            tx, ty = int(target.x), int(target.y)
            r, g, b = target.color

            # Draw glowing nebula dust cloud rings
            for rad_ring in range(35, 8, -6):
                alpha = int(45 * (1.0 - rad_ring / 35.0))
                ring_surf = pygame.Surface((rad_ring * 2, rad_ring * 2), pygame.SRCALPHA)
                pygame.draw.circle(ring_surf, (r, g, b, alpha), (rad_ring, rad_ring), rad_ring)
                surface.blit(ring_surf, (tx - rad_ring, ty - rad_ring), special_flags=pygame.BLEND_ADD)

            # Core point source star
            pygame.draw.circle(surface, (255, 255, 255), (tx, ty), 3)

            # Active Target Target Guidance Bracket
            if i == self.active_target_idx and not target.completed:
                pygame.draw.rect(surface, COLOR_GOLD, (tx - 40, ty - 40, 80, 80), 1)
                pct = int((target.photons_collected / target.required_photons) * 100)
                p_str = f"INTEGRATING: {pct}%"
                surface.blit(self.font_hud.render(p_str, True, COLOR_GOLD), (tx - 35, ty + 44))
            elif target.completed:
                pygame.draw.circle(surface, COLOR_EMERALD, (tx, ty), 28, 1)
                surface.blit(self.font_hud.render("RESOLVED ✓", True, COLOR_EMERALD), (tx - 28, ty + 32))

            label = self.font_hud.render(target.name, True, COLOR_CYAN if i == self.active_target_idx else COLOR_TEXT_DIM)
            surface.blit(label, (tx - label.get_width() // 2, ty - 52))

        # Draw JWST Space Telescope in bottom right corner
        telescope_sprite = SPRITES['jwst']
        surface.blit(telescope_sprite, (890, 610))

        # Draw Integration Photon Particles
        self.particles.draw(surface, (0, 0))

        # ── TELESCOPE FINE GUIDANCE SENSOR (FGS) RETICLE ──
        rx, ry = int(self.reticle_x), int(self.reticle_y)

        # Crosshair Reticle
        ret_col = COLOR_EMERALD if self.targets[self.active_target_idx].photons_collected > 0 else COLOR_CYAN
        pygame.draw.circle(surface, ret_col, (rx, ry), 36, 1)
        pygame.draw.circle(surface, ret_col, (rx, ry), 8, 1)
        pygame.draw.line(surface, ret_col, (rx - 48, ry), (rx - 16, ry), 2)
        pygame.draw.line(surface, ret_col, (rx + 16, ry), (rx + 48, ry), 2)
        pygame.draw.line(surface, ret_col, (rx, ry - 48), (rx, ry - 16), 2)
        pygame.draw.line(surface, ret_col, (rx, ry + 16), (rx, ry + 48), 2)

        # Draw line from reticle to current active target
        curr_t = self.targets[self.active_target_idx]
        if not curr_t.completed:
            pygame.draw.line(surface, (71, 85, 105), (rx, ry), (int(curr_t.x), int(curr_t.y)), 1)

        # ── TOP FLIGHT DIRECTOR HUD ──
        hud_panel = pygame.Surface((1024, 85), pygame.SRCALPHA)
        hud_panel.fill((10, 15, 26, 220))
        surface.blit(hud_panel, (0, 0))
        pygame.draw.line(surface, (30, 41, 59), (0, 85), (1024, 85), 1)

        title_surf = self.font_large.render(f"OBSERVATORY: {self.mission.name.upper()}", True, COLOR_CYAN)
        surface.blit(title_surf, (24, 12))

        # Radio Callout message
        if self.callout_timer > 0:
            call_surf = self.font_hud.render(f"SCIENCE TEAM: \"{self.callout_text}\"", True, COLOR_GOLD)
            surface.blit(call_surf, (24, 38))
        else:
            time_surf = self.font.render(f"EXPOSURE TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT)
            surface.blit(time_surf, (24, 38))

        # Gauges (Right side)
        curr = self.targets[self.active_target_idx]
        draw_gauge(surface, 640, 14, 160, 16, curr.photons_collected, curr.required_photons,
                   f"EXPOSURE: {int(curr.photons_collected)}/{int(curr.required_photons)} PHOTONS", COLOR_GOLD)

        comp_count = sum(1 for t in self.targets if t.completed)
        draw_gauge(surface, 640, 36, 160, 16, comp_count, len(self.targets),
                   f"SURVEY: {comp_count}/{len(self.targets)} OBJECTS", COLOR_EMERALD)

        filter_str = f"FILTER: {self.filter_names[self.filter_mode]} (TAB TO CYCLE)"
        surface.blit(self.font_hud.render(filter_str, True, COLOR_CYAN), (640, 60))

        # Bottom Reticle Gyro Diagnostics
        att_panel = pygame.Surface((340, 68), pygame.SRCALPHA)
        att_panel.fill((15, 23, 42, 210))
        surface.blit(att_panel, (24, 638))
        pygame.draw.rect(surface, (51, 65, 85), (24, 638, 340, 68), 1, border_radius=6)

        surface.blit(self.font.render(f"RETICLE TARGET: {curr.name}", True, COLOR_CYAN), (36, 646))
        drift_val = math.hypot(self.drift_vx, self.drift_vy)
        surface.blit(self.font.render(f"REACTION WHEEL JITTER: {drift_val:.1f} ARCSEC/S", True, COLOR_TEXT), (36, 666))
        surface.blit(self.font_hud.render("WASD/ARROWS/MOUSE: AIM RETICLE OVER TARGET", True, COLOR_TEXT_DIM), (36, 686))
