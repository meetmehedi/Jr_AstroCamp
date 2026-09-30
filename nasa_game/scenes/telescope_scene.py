"""
nasa_game/scenes/telescope_scene.py
NASA Space Observatory & Deep Field Astronomical Spectroscopy Simulator.
Features James Webb (JWST) / Hubble Observatory with Fine Guidance Sensor (FGS)
stabilization, multi-spectral infrared filter switching, and deep sky photon integration.
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
    W, H = 1024, 720

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

        # Multi-spectral filter mode
        self.filter_mode = 0
        self.filter_names = ["NEAR-INFRARED (NIRCam)", "OPTICAL (WFC3)", "MID-INFRARED (MIRI)"]

        # FX Systems
        self.particles = ParticleSystem()
        self.shake = ScreenShake()
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H), random.random(), random.uniform(0.6, 2.0))
            for _ in range(160)
        ]

        # Callouts
        self.callout_text = "FINE GUIDANCE SENSOR (FGS) ACQUIRED // ALIGN OPTICAL APERTURE"
        self.callout_timer = 4.0

        self.is_over = False
        self.font = get_font(13, bold=True, mono=True)
        self.font_large = get_font(16, bold=True, mono=True)
        self.font_hud = get_font(11, bold=True, mono=True)

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

        # Reaction wheel gyro drift
        self.drift_vx += random.uniform(-self.drift_speed, self.drift_speed) * dt * 3.0
        self.drift_vy += random.uniform(-self.drift_speed, self.drift_speed) * dt * 3.0
        self.drift_vx *= (1.0 - dt * 1.5)
        self.drift_vy *= (1.0 - dt * 1.5)

        self.reticle_x += self.drift_vx * dt
        self.reticle_y += self.drift_vy * dt

        # User reaction wheel controls
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

        if pygame.mouse.get_pressed()[0]:
            mx, my = pygame.mouse.get_pos()
            self.reticle_x += (mx - self.reticle_x) * dt * 4.0
            self.reticle_y += (my - self.reticle_y) * dt * 4.0

        self.reticle_x = max(60.0, min(self.W - 60.0, self.reticle_x))
        self.reticle_y = max(110.0, min(self.H - 100.0, self.reticle_y))

        # Photon Integration
        current_target = self.targets[self.active_target_idx]
        if not current_target.completed:
            dist = math.hypot(self.reticle_x - current_target.x, self.reticle_y - current_target.y)
            if dist < 45.0:
                integration_rate = 18.0 * (1.0 - (dist / 45.0))
                current_target.photons_collected += integration_rate * dt
                self.particles.emit_rcs(current_target.x, current_target.y, random.uniform(-10, 10), random.uniform(-10, 10), count=1)

                if math.fmod(self.time_left, 0.4) < 0.1:
                    sound_engine.play('click')

                if current_target.photons_collected >= current_target.required_photons:
                    current_target.completed = True
                    sound_engine.play('quindar')
                    self.callout_text = f"SPECTRAL RECONSTRUCTION: {current_target.name} COMPLETED"
                    self.callout_timer = 3.5

                    if self.active_target_idx + 1 < len(self.targets):
                        self.active_target_idx += 1
                    else:
                        self._end_game(True, "DEEP FIELD SURVEY COMPLETE! All astronomical targets resolved at high resolution.")
                        return

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
        # 1. Deep Space Stellar Matrix
        surface.fill(COLOR_BG)

        for sx, sy, sb, spd in self.stars:
            lum = int(sb * 240)
            pygame.draw.circle(surface, (lum, lum, min(255, int(lum * 1.1))), (int(sx), int(sy)), 1 if sb < 0.75 else 2)

        # 2. Celestial Targets (Nebulae / Galaxies)
        for i, target in enumerate(self.targets):
            tx, ty = int(target.x), int(target.y)
            r, g, b = target.color

            for rad_ring in range(35, 8, -6):
                alpha = int(45 * (1.0 - rad_ring / 35.0))
                ring_surf = pygame.Surface((rad_ring * 2, rad_ring * 2), pygame.SRCALPHA)
                pygame.draw.circle(ring_surf, (r, g, b, alpha), (rad_ring, rad_ring), rad_ring)
                surface.blit(ring_surf, (tx - rad_ring, ty - rad_ring), special_flags=pygame.BLEND_ADD)

            pygame.draw.circle(surface, (255, 255, 255), (tx, ty), 3)

            if i == self.active_target_idx and not target.completed:
                pygame.draw.rect(surface, COLOR_GOLD, (tx - 40, ty - 40, 80, 80), 1)
                pct = int((target.photons_collected / target.required_photons) * 100)
                p_str = f"INTEGRATING: {pct}%"
                surface.blit(self.font_hud.render(p_str, True, COLOR_GOLD), (tx - 35, ty + 44))
            elif target.completed:
                pygame.draw.circle(surface, COLOR_EMERALD, (tx, ty), 28, 1)
                surface.blit(self.font_hud.render("RESOLVED [OK]", True, COLOR_EMERALD), (tx - 28, ty + 32))

            label = self.font_hud.render(target.name, True, COLOR_CYAN if i == self.active_target_idx else COLOR_TEXT_DIM)
            surface.blit(label, (tx - label.get_width() // 2, ty - 52))

        # JWST Space Telescope Silhouette in corner
        telescope_sprite = SPRITES['jwst']
        surface.blit(telescope_sprite, (890, 610))

        self.particles.draw(surface, (0, 0))

        # 3. Fine Guidance Sensor (FGS) Reticle
        rx, ry = int(self.reticle_x), int(self.reticle_y)
        ret_col = COLOR_EMERALD if self.targets[self.active_target_idx].photons_collected > 0 else COLOR_CYAN
        pygame.draw.circle(surface, ret_col, (rx, ry), 36, 1)
        pygame.draw.circle(surface, ret_col, (rx, ry), 8, 1)
        pygame.draw.line(surface, ret_col, (rx - 48, ry), (rx - 16, ry), 2)
        pygame.draw.line(surface, ret_col, (rx + 16, ry), (rx + 48, ry), 2)
        pygame.draw.line(surface, ret_col, (rx, ry - 48), (rx, ry - 16), 2)
        pygame.draw.line(surface, ret_col, (rx, ry + 16), (rx, ry + 48), 2)

        curr_t = self.targets[self.active_target_idx]
        if not curr_t.completed:
            pygame.draw.line(surface, (51, 65, 85), (rx, ry), (int(curr_t.x), int(curr_t.y)), 1)

        # ── COCKPIT GLASS HUD & TELEMETRY MFDs ────────────────────────────────

        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="ASTRONOMICAL OBSERVATORY & SPECTROMETER MFD")

        v_name = self.mission.name.upper()
        if len(v_name) > 26:
            v_name = v_name[:24] + "..."
        surface.blit(self.font_large.render(f"OBSERVATORY: {v_name}", True, COLOR_CYAN), (26, 32))

        if self.callout_timer > 0:
            surface.blit(self.font_hud.render(f"SCIENCE OPERATIONS: \"{self.callout_text}\"", True, COLOR_GOLD), (26, 58))
        else:
            surface.blit(self.font.render(f"EXPOSURE TIMELINE: {self.time_left:.1f}s REMAINING", True, COLOR_TEXT_DIM), (26, 58))

        # Gauges
        curr = self.targets[self.active_target_idx]
        draw_gauge(surface, 620, 24, 380, 18, curr.photons_collected, curr.required_photons,
                   f"EXPOSURE: {int(curr.photons_collected)}/{int(curr.required_photons)} PHOTONS", COLOR_GOLD)

        comp_count = sum(1 for t in self.targets if t.completed)
        draw_gauge(surface, 620, 46, 380, 18, comp_count, len(self.targets),
                   f"SURVEY CATALOG: {comp_count}/{len(self.targets)} TARGETS", COLOR_EMERALD)

        filter_str = f"FILTER: {self.filter_names[self.filter_mode]} [TAB TO CYCLE]"
        surface.blit(self.font_hud.render(filter_str, True, COLOR_CYAN), (620, 68))

        # Bottom Diagnostics
        draw_hud_panel(surface, pygame.Rect(12, self.H - 84, 400, 72), title="GYROSCOPIC POINTING DIAGNOSTICS")
        surface.blit(self.font.render(f"ACTIVE TARGET: {curr.name}", True, COLOR_CYAN), (26, self.H - 68))
        drift_val = math.hypot(self.drift_vx, self.drift_vy)
        surface.blit(self.font.render(f"REACTION WHEEL JITTER: {drift_val:.1f} ARCSEC/S", True, COLOR_TEXT), (26, self.H - 48))
        surface.blit(self.font_hud.render("[WASD/ARROWS/MOUSE] POINT APERTURE OVER TARGET", True, COLOR_TEXT_DIM), (26, self.H - 28))
