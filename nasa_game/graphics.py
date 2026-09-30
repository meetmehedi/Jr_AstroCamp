"""
nasa_game/graphics.py
High-Fidelity Procedural Aerospace Rendering & Particle Simulation Engine.
Features multi-stop atmospheric gradients, volumetric cloud synthesis,
industrial launch pad structures, searchlights, and realistic spacecraft shaders.
"""
import math
import random
from typing import List, Tuple, Optional, Dict
import pygame

class Particle:
    def __init__(
        self,
        x: float,
        y: float,
        vx: float,
        vy: float,
        color: Tuple[int, int, int],
        life: float,
        size: float,
        shrink: bool = True,
        fade: bool = True,
        blend_add: bool = True,
    ):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.color = color
        self.max_life = life
        self.life = life
        self.size = size
        self.shrink = shrink
        self.fade = fade
        self.blend_add = blend_add

    def update(self, dt: float) -> bool:
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.life -= dt
        return self.life > 0

    def draw(self, surface: pygame.Surface, camera_offset: Tuple[float, float] = (0, 0)):
        if self.life <= 0:
            return
        px = int(self.x - camera_offset[0])
        py = int(self.y - camera_offset[1])
        progress = max(0.0, min(1.0, self.life / self.max_life))

        s = max(1.0, self.size * (progress if self.shrink else 1.0))
        r, g, b = self.color
        alpha = int(255 * (progress if self.fade else 1.0))

        if px < -s or px > surface.get_width() + s or py < -s or py > surface.get_height() + s:
            return

        part_surf = pygame.Surface((int(s * 2 + 4), int(s * 2 + 4)), pygame.SRCALPHA)
        center = (int(s + 2), int(s + 2))
        pygame.draw.circle(part_surf, (r, g, b, alpha), center, int(s))

        if self.blend_add:
            surface.blit(part_surf, (px - int(s + 2), py - int(s + 2)), special_flags=pygame.BLEND_ADD)
        else:
            surface.blit(part_surf, (px - int(s + 2), py - int(s + 2)))


class ParticleSystem:
    def __init__(self):
        self.particles: List[Particle] = []

    def emit_flame(self, x: float, y: float, angle_deg: float, speed: float = 280.0, count: int = 6):
        """Rocket exhaust plume with core Mach shock diamonds and billowing expansion."""
        rad = math.radians(angle_deg)
        for _ in range(count):
            spread = random.uniform(-0.16, 0.16)
            s = speed * random.uniform(0.75, 1.4)
            vx = -math.sin(rad + spread) * s
            vy = math.cos(rad + spread) * s
            life = random.uniform(0.18, 0.45)
            size = random.uniform(6.0, 14.0)

            c_val = random.random()
            if c_val > 0.65:
                color = (255, 255, 240)  # Core plasma
            elif c_val > 0.28:
                color = (255, 160, 35)   # Fiery LOX plume
            else:
                color = (235, 65, 15)    # Outer turbulent flame
            self.particles.append(Particle(x, y, vx, vy, color, life, size, shrink=True, fade=True, blend_add=True))

    def emit_smoke(self, x: float, y: float, vx_base: float = 0, vy_base: float = 0, count: int = 3):
        """Volumetric launch steam / propellant vapor."""
        for _ in range(count):
            vx = vx_base + random.uniform(-35, 35)
            vy = vy_base + random.uniform(-12, 12)
            life = random.uniform(1.0, 2.2)
            size = random.uniform(14.0, 36.0)
            gray = random.randint(180, 230)
            self.particles.append(Particle(x, y, vx, vy, (gray, gray, gray), life, size, shrink=False, fade=True, blend_add=False))

    def emit_rcs(self, x: float, y: float, vx: float, vy: float, count: int = 3):
        """Cold-gas / hypergolic RCS thruster jet."""
        for _ in range(count):
            spread_x = vx + random.uniform(-10, 10)
            spread_y = vy + random.uniform(-10, 10)
            life = random.uniform(0.14, 0.28)
            size = random.uniform(2.5, 5.5)
            color = (195, 235, 255)
            self.particles.append(Particle(x, y, spread_x, spread_y, color, life, size, shrink=True, fade=True, blend_add=True))

    def emit_dust(self, x: float, y: float, color: Tuple[int, int, int] = (175, 165, 145), count: int = 3):
        for _ in range(count):
            vx = random.uniform(-60, 60)
            vy = random.uniform(-30, -5)
            life = random.uniform(0.4, 0.9)
            size = random.uniform(3.0, 8.0)
            self.particles.append(Particle(x, y, vx, vy, color, life, size, shrink=True, fade=True, blend_add=False))

    def emit_venting_vapor(self, x: float, y: float):
        """Gentle cryogenic LOX boil-off venting before launch."""
        vx = random.uniform(-15, -4)
        vy = random.uniform(-10, 5)
        self.particles.append(Particle(x, y, vx, vy, (240, 245, 255), random.uniform(0.8, 1.5), random.uniform(4, 9), shrink=False, fade=True, blend_add=False))

    def emit_explosion(self, x: float, y: float, count: int = 40):
        for _ in range(count):
            ang = random.uniform(0, math.pi * 2)
            spd = random.uniform(40, 280)
            vx = math.cos(ang) * spd
            vy = math.sin(ang) * spd
            life = random.uniform(0.35, 0.9)
            size = random.uniform(4.0, 14.0)
            c = random.choice([(255, 255, 230), (255, 160, 30), (230, 45, 10), (200, 200, 210)])
            self.particles.append(Particle(x, y, vx, vy, c, life, size, shrink=True, fade=True, blend_add=True))

    def update(self, dt: float):
        self.particles = [p for p in self.particles if p.update(dt)]

    def draw(self, surface: pygame.Surface, camera_offset: Tuple[float, float] = (0, 0)):
        for p in self.particles:
            p.draw(surface, camera_offset)


class ScreenShake:
    def __init__(self):
        self.intensity = 0.0
        self.duration = 0.0
        self.offset_x = 0.0
        self.offset_y = 0.0

    def trigger(self, intensity: float, duration: float = 0.3):
        self.intensity = max(self.intensity, intensity)
        self.duration = max(self.duration, duration)

    def update(self, dt: float):
        if self.duration > 0:
            self.duration -= dt
            self.offset_x = random.uniform(-self.intensity, self.intensity)
            self.offset_y = random.uniform(-self.intensity, self.intensity)
            self.intensity = max(0.0, self.intensity - dt * 25.0)
        else:
            self.offset_x = 0.0
            self.offset_y = 0.0
            self.intensity = 0.0

    def get_offset(self) -> Tuple[int, int]:
        return int(self.offset_x), int(self.offset_y)


# ─────────────────────────────────────────────────────────────────────────────
# REALISTIC ATMOSPHERE & GRADIENT RENDERING
# ─────────────────────────────────────────────────────────────────────────────

def draw_realistic_sky_gradient(surface: pygame.Surface, altitude_km: float, width: int = 1024, height: int = 720):
    """
    Renders realistic vertical atmospheric Rayleigh scattering gradient.
    At sea level: Dusky amber/teal horizon fading into deep stratospheric navy.
    At 20-50 km: Thin ozone blue horizon band with dark mesosphere above.
    At >80 km: Pure deep space vacuum with Earth's glowing curved limb below.
    """
    alt_f = max(0.0, min(1.0, altitude_km / 110.0))

    # Calculate Top and Bottom Sky Colors based on altitude
    # Low altitude (Sea level dusk/dawn launch)
    if alt_f < 0.2:
        factor = alt_f / 0.2
        # Bottom horizon: teal-cyan haze (18, 52, 86) -> deep twilight (10, 24, 48)
        b_r = int(24 * (1 - factor) + 8 * factor)
        b_g = int(68 * (1 - factor) + 24 * factor)
        b_b = int(108 * (1 - factor) + 52 * factor)

        # Top zenith: deep navy (10, 20, 46) -> vacuum space (3, 6, 14)
        t_r = int(12 * (1 - factor) + 3 * factor)
        t_g = int(24 * (1 - factor) + 6 * factor)
        t_b = int(54 * (1 - factor) + 14 * factor)
    elif alt_f < 0.7:
        factor = (alt_f - 0.2) / 0.5
        b_r = int(8 * (1 - factor) + 4 * factor)
        b_g = int(24 * (1 - factor) + 10 * factor)
        b_b = int(52 * (1 - factor) + 26 * factor)

        t_r = 3
        t_g = 5
        t_b = 12
    else:
        # Near orbit / deep space
        b_r, b_g, b_b = 3, 6, 16
        t_r, t_g, t_b = 2, 4, 10

    # Draw vertical smooth gradient bands (16px per slice for maximum speed & smoothness)
    band_h = 16
    for y in range(0, height, band_h):
        frac = y / float(height)
        r = int(t_r * (1.0 - frac) + b_r * frac)
        g = int(t_g * (1.0 - frac) + b_g * frac)
        b = int(t_b * (1.0 - frac) + b_b * frac)
        pygame.draw.rect(surface, (r, g, b), (0, y, width, band_h))


def create_realistic_cloud_sprite(width: int, height: int, seed: int = 42) -> pygame.Surface:
    """Generates soft, organic, multi-puff cloud bank with translucent alpha depth."""
    surf = pygame.Surface((width, height), pygame.SRCALPHA)
    rnd = random.Random(seed)

    num_puffs = max(6, int(width / 22))
    for _ in range(num_puffs):
        cx = rnd.uniform(width * 0.15, width * 0.85)
        cy = rnd.uniform(height * 0.35, height * 0.75)
        rx = rnd.uniform(width * 0.18, width * 0.32)
        ry = rnd.uniform(height * 0.25, height * 0.45)

        # Draw soft concentric circles
        for step in range(5, 0, -1):
            s_frac = step / 5.0
            alpha = int(35 * (1.0 - s_frac * 0.4))
            puff_surf = pygame.Surface((int(rx * 2), int(ry * 2)), pygame.SRCALPHA)
            pygame.draw.ellipse(puff_surf, (220, 230, 245, alpha), (0, 0, int(rx * 2 * s_frac), int(ry * 2 * s_frac)))
            surf.blit(puff_surf, (int(cx - rx * s_frac), int(cy - ry * s_frac)))

    return surf


def draw_cape_canaveral_launch_complex(surface: pygame.Surface, pad_y: int, width: int = 1024, height: int = 720, altitude_km: float = 0.0):
    """
    Renders detailed industrial Kennedy Space Center / Cape Canaveral Pad 39A:
    - Atlantic Ocean shoreline with reflections
    - Mobile Launcher Platform (MLP) concrete mount
    - Fixed Service Structure (FSS) steel lattice gantry tower
    - Catwalks, elevator shaft, umbilical swing arms, lightning rod spire
    - Twin searchlight floodlight beams illuminating the rocket
    """
    if pad_y > height + 100:
        return

    # 1. Atlantic Ocean Horizon & Marshland Shoreline
    pygame.draw.rect(surface, (8, 22, 42), (0, pad_y, width, height - pad_y))
    # Water surface specular line
    pygame.draw.line(surface, (20, 48, 80), (0, pad_y), (width, pad_y), 2)
    # Coastal Barrier Island Terrain
    pygame.draw.rect(surface, (20, 32, 26), (0, pad_y - 8, width, 12))

    # 2. Concrete Flame Trench & Mobile Launcher Platform
    mlp_x = 428
    mlp_w = 168
    mlp_h = 32
    # Heavy beveled concrete foundation
    pygame.draw.rect(surface, (45, 52, 64), (mlp_x, pad_y - mlp_h, mlp_w, mlp_h), border_radius=2)
    pygame.draw.rect(surface, (30, 36, 46), (mlp_x + 4, pad_y - mlp_h + 4, mlp_w - 8, mlp_h - 8))
    # Flame deflector trench void
    pygame.draw.rect(surface, (14, 16, 20), (476, pad_y - 12, 72, 28))

    # 3. Fixed Service Structure (FSS) Gantry Tower (Lattice Steel Truss)
    tower_x = 416
    tower_w = 40
    tower_top_y = pad_y - 230
    tower_h = pad_y - tower_top_y

    # Main red-orange structural vertical columns
    tower_col = (185, 28, 28)
    tower_col_dark = (127, 29, 29)
    pygame.draw.rect(surface, (24, 28, 36), (tower_x, tower_top_y, tower_w, tower_h)) # interior elevator core

    pygame.draw.line(surface, tower_col, (tower_x, pad_y), (tower_x, tower_top_y), 3)
    pygame.draw.line(surface, tower_col, (tower_x + tower_w, pad_y), (tower_x + tower_w, tower_top_y), 3)

    # Multi-level horizontal catwalk floors & diagonal cross trusses
    num_floors = 8
    floor_step = tower_h / num_floors
    for fl in range(num_floors + 1):
        fy = int(pad_y - fl * floor_step)
        pygame.draw.line(surface, (203, 213, 225), (tower_x - 4, fy), (tower_x + tower_w + 4, fy), 2)
        if fl < num_floors:
            # Diagonal X-brace
            next_fy = int(pad_y - (fl + 1) * floor_step)
            pygame.draw.line(surface, tower_col_dark, (tower_x, fy), (tower_x + tower_w, next_fy), 1)
            pygame.draw.line(surface, tower_col_dark, (tower_x + tower_w, fy), (tower_x, next_fy), 1)

    # Umbilical Swing Service Arms extending to rocket core
    arm_y1 = pad_y - 180
    arm_y2 = pad_y - 125
    pygame.draw.line(surface, (148, 163, 184), (tower_x + tower_w, arm_y1), (496, arm_y1), 3)
    pygame.draw.line(surface, (148, 163, 184), (tower_x + tower_w, arm_y2), (494, arm_y2), 3)

    # Lightning Mast Needle Spire on top of tower
    pygame.draw.line(surface, (220, 225, 230), (tower_x + tower_w // 2, tower_top_y), (tower_x + tower_w // 2, tower_top_y - 45), 2)
    # Red FAA Obstruction Hazard Strobe on top
    pulse = math.sin(pygame.time.get_ticks() / 200.0)
    if pulse > 0.3:
        pygame.draw.circle(surface, (239, 68, 68), (tower_x + tower_w // 2, tower_top_y - 45), 3)

    # 4. Searchlight Floodlight Beams (Night illumination)
    if altitude_km < 35.0:
        beam_alpha = int(75 * max(0.0, 1.0 - altitude_km / 35.0))
        # Left Floodlight
        draw_floodlight_cone(surface, mlp_x - 30, pad_y - 8, 512, pad_y - 160, beam_alpha)
        # Right Floodlight
        draw_floodlight_cone(surface, mlp_x + mlp_w + 30, pad_y - 8, 512, pad_y - 160, beam_alpha)


def draw_floodlight_cone(surface: pygame.Surface, src_x: int, src_y: int, tgt_x: int, tgt_y: int, alpha: int = 60):
    """Draws a soft volumetric light cone illuminating the launch vehicle."""
    cone_surf = pygame.Surface((surface.get_width(), surface.get_height()), pygame.SRCALPHA)
    pts = [
        (src_x - 3, src_y),
        (src_x + 3, src_y),
        (tgt_x + 32, tgt_y),
        (tgt_x - 32, tgt_y),
    ]
    pygame.draw.polygon(cone_surf, (240, 248, 255, alpha), pts)
    surface.blit(cone_surf, (0, 0), special_flags=pygame.BLEND_ADD)


# ─────────────────────────────────────────────────────────────────────────────
# REALISTIC PROCEDURAL SPACECRAFT SPRITES
# ─────────────────────────────────────────────────────────────────────────────

def create_saturn_v_stage1_sprite() -> pygame.Surface:
    """Saturn V First Stage (S-IC) with realistic cylindrical metallic shading & F-1 cluster."""
    w, h = 48, 140
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    for x_off in range(32):
        nx = x_off / 31.0
        shade = int(180 + 70 * math.sin(nx * math.pi) + 20 * math.cos(nx * math.pi * 0.5))
        shade = max(140, min(255, shade))
        pygame.draw.line(surf, (shade, shade, shade), (8 + x_off, 20), (8 + x_off, 110))

    pygame.draw.rect(surf, (16, 18, 22), (8, 32, 16, 30))
    pygame.draw.rect(surf, (16, 18, 22), (24, 76, 16, 26))

    pygame.draw.line(surf, (220, 38, 38), (18, 48), (30, 48), 2)
    pygame.draw.line(surf, (30, 58, 138), (18, 52), (30, 52), 1)

    pygame.draw.rect(surf, (55, 65, 81), (6, 16, 36, 5))
    pygame.draw.rect(surf, (31, 41, 55), (7, 108, 34, 4))

    pygame.draw.polygon(surf, (229, 231, 235), [(8, 88), (0, 114), (8, 110)])
    pygame.draw.polygon(surf, (156, 163, 175), [(8, 110), (0, 114), (6, 114)])
    pygame.draw.polygon(surf, (229, 231, 235), [(40, 88), (48, 114), (40, 110)])
    pygame.draw.polygon(surf, (156, 163, 175), [(40, 110), (48, 114), (42, 114)])

    nozzles = [(12, 110), (24, 110), (36, 110)]
    for nx, ny in nozzles:
        pygame.draw.polygon(surf, (45, 50, 60), [(nx - 5, ny), (nx + 5, ny), (nx + 7, ny + 18), (nx - 7, ny + 18)])
        pygame.draw.polygon(surf, (75, 85, 100), [(nx - 4, ny), (nx + 4, ny), (nx + 6, ny + 18), (nx - 6, ny + 18)], 1)
        pygame.draw.ellipse(surf, (255, 140, 30), (nx - 5, ny + 14, 10, 4))

    return surf


def create_saturn_v_upper_stage_sprite() -> pygame.Surface:
    """Apollo CSM / Launch Escape System / S-IVB Upper Stage."""
    w, h = 48, 130
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    pygame.draw.line(surf, (203, 213, 225), (24, 0), (24, 18), 2)
    pygame.draw.polygon(surf, (241, 245, 249), [(22, 18), (26, 18), (25, 28), (23, 28)])
    pygame.draw.line(surf, (148, 163, 184), (20, 28), (24, 18), 1)
    pygame.draw.line(surf, (148, 163, 184), (28, 28), (24, 18), 1)

    pygame.draw.polygon(surf, (248, 250, 252), [(24, 28), (33, 46), (15, 46)])
    pygame.draw.polygon(surf, (15, 23, 42), [(21, 35), (27, 35), (28, 39), (20, 39)])

    pygame.draw.rect(surf, (203, 213, 225), (14, 46, 20, 26))
    pygame.draw.line(surf, (100, 116, 139), (14, 54), (34, 54), 1)
    pygame.draw.line(surf, (100, 116, 139), (14, 64), (34, 64), 1)

    pygame.draw.polygon(surf, (51, 65, 85), [(20, 72), (28, 72), (30, 82), (18, 82)])

    pygame.draw.rect(surf, (241, 245, 249), (11, 82, 26, 36))
    pygame.draw.rect(surf, (15, 23, 42), (11, 88, 13, 14))

    pygame.draw.polygon(surf, (51, 65, 85), [(18, 118), (30, 118), (33, 128), (15, 128)])
    pygame.draw.ellipse(surf, (255, 160, 40), (18, 125, 12, 4))

    return surf


def create_apollo_lem_sprite() -> pygame.Surface:
    """Apollo Lunar Module (Eagle) with gold foil and struts."""
    w, h = 64, 64
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    pygame.draw.line(surf, (161, 140, 100), (22, 38), (6, 56), 2)
    pygame.draw.line(surf, (161, 140, 100), (42, 38), (58, 56), 2)
    pygame.draw.ellipse(surf, (217, 180, 74), (2, 55, 9, 4))
    pygame.draw.ellipse(surf, (217, 180, 74), (53, 55, 9, 4))
    pygame.draw.ellipse(surf, (217, 180, 74), (27, 56, 10, 4))

    gold_dark = (180, 130, 16)
    gold_light = (245, 200, 45)
    pygame.draw.rect(surf, gold_dark, (18, 32, 28, 16))
    for fx in range(19, 45, 3):
        pygame.draw.line(surf, gold_light, (fx, 33), (fx + 1, 47), 1)

    pygame.draw.polygon(surf, (51, 65, 85), [(25, 48), (39, 48), (42, 57), (22, 57)])
    pygame.draw.ellipse(surf, (255, 160, 40), (25, 55, 14, 3))

    pygame.draw.rect(surf, (203, 213, 225), (20, 18, 24, 15))
    pygame.draw.rect(surf, (30, 41, 59), (29, 23, 6, 9))

    pygame.draw.polygon(surf, (15, 23, 42), [(23, 20), (27, 20), (25, 24)])
    pygame.draw.polygon(surf, (15, 23, 42), [(37, 20), (41, 20), (39, 24)])

    pygame.draw.line(surf, (148, 163, 184), (32, 18), (32, 10), 1)
    pygame.draw.arc(surf, (241, 245, 249), (28, 8, 8, 8), math.pi * 0.2, math.pi * 0.8, 2)

    for rx, ry in [(18, 24), (46, 24)]:
        pygame.draw.circle(surf, (100, 116, 139), (rx, ry), 2)
        pygame.draw.line(surf, (71, 85, 105), (rx - 3, ry), (rx + 3, ry), 1)
        pygame.draw.line(surf, (71, 85, 105), (rx, ry - 3), (rx, ry + 3), 1)

    return surf


def create_mars_rover_sprite() -> pygame.Surface:
    """Perseverance / Curiosity Mars Rover with Rocker-Bogie, Mastcam-Z, and MMRTG."""
    w, h = 64, 48
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    wheels = [(8, 36), (20, 36), (56, 36), (8, 42), (32, 42), (56, 42)]
    for wx, wy in wheels:
        pygame.draw.rect(surf, (51, 65, 85), (wx - 4, wy - 3, 8, 6), border_radius=1)
        pygame.draw.line(surf, (100, 116, 139), (wx - 2, wy), (wx + 2, wy), 1)

    pygame.draw.line(surf, (148, 163, 184), (12, 36), (32, 28), 2)
    pygame.draw.line(surf, (148, 163, 184), (32, 28), (52, 36), 2)
    pygame.draw.circle(surf, (71, 85, 105), (32, 28), 3)

    pygame.draw.rect(surf, (241, 245, 249), (16, 16, 34, 14), border_radius=2)
    pygame.draw.rect(surf, (217, 160, 30), (18, 18, 12, 8))

    pygame.draw.rect(surf, (51, 65, 85), (46, 14, 12, 10), border_radius=1)
    for fx in range(48, 58, 2):
        pygame.draw.line(surf, (100, 116, 139), (fx, 13), (fx, 25), 1)

    pygame.draw.line(surf, (148, 163, 184), (22, 16), (22, 5), 2)
    pygame.draw.rect(surf, (30, 41, 59), (18, 2, 10, 5), border_radius=1)
    pygame.draw.circle(surf, (56, 189, 248), (21, 4), 1)
    pygame.draw.circle(surf, (56, 189, 248), (25, 4), 1)

    pygame.draw.line(surf, (100, 116, 139), (16, 24), (8, 26), 2)
    pygame.draw.circle(surf, (71, 85, 105), (7, 26), 3)

    return surf


def create_docking_target_sprite() -> pygame.Surface:
    """International Docking Adapter (IDA) with precision laser crosshairs."""
    size = 180
    surf = pygame.Surface((size, size), pygame.SRCALPHA)
    cx, cy = size // 2, size // 2

    pygame.draw.circle(surf, (30, 41, 59), (cx, cy), 85)
    pygame.draw.circle(surf, (71, 85, 105), (cx, cy), 85, 2)

    pygame.draw.circle(surf, (15, 23, 42), (cx, cy), 65)
    pygame.draw.circle(surf, (148, 163, 184), (cx, cy), 65, 2)

    for i in range(3):
        ang = i * (2 * math.pi / 3) - math.pi / 2
        px = cx + math.cos(ang) * 60
        py = cy + math.sin(ang) * 60
        pygame.draw.circle(surf, (203, 213, 225), (int(px), int(py)), 7)
        pygame.draw.circle(surf, (15, 23, 42), (int(px), int(py)), 3)

    pygame.draw.circle(surf, (4, 8, 16), (cx, cy), 38)
    pygame.draw.circle(surf, (56, 189, 248), (cx, cy), 38, 1)

    pygame.draw.line(surf, (56, 189, 248), (cx - 28, cy), (cx + 28, cy), 1)
    pygame.draw.line(surf, (56, 189, 248), (cx, cy - 28), (cx, cy + 28), 1)
    pygame.draw.circle(surf, (56, 189, 248), (cx, cy), 8, 1)

    for lx, ly in [(cx - 72, cy), (cx + 72, cy), (cx, cy - 72), (cx, cy + 72)]:
        pygame.draw.circle(surf, (245, 158, 11), (lx, ly), 3)
        pygame.draw.circle(surf, (255, 255, 255), (lx, ly), 1)

    return surf


def create_jwst_telescope_sprite() -> pygame.Surface:
    """James Webb Space Telescope with 18 Gold Beryllium Hexagons and 5-Layer Sunshield."""
    w, h = 96, 72
    surf = pygame.Surface((w, h), pygame.SRCALPHA)
    cx, cy = w // 2, h // 2

    shield_pts = [(cx, 4), (w - 8, cy), (cx, h - 6), (8, cy)]
    pygame.draw.polygon(surf, (148, 163, 184), shield_pts)
    pygame.draw.polygon(surf, (203, 213, 225), [(cx, 8), (w - 14, cy), (cx, h - 10), (14, cy)])
    pygame.draw.polygon(surf, (71, 85, 105), shield_pts, 1)

    gold = (245, 195, 35)
    gold_border = (180, 130, 15)
    for row in range(-2, 3):
        for col in range(-2, 3):
            if abs(row) + abs(col) <= 3 and not (row == 0 and col == 0):
                hx = cx + col * 7
                hy = cy + row * 6 + (col % 2) * 3
                pygame.draw.circle(surf, gold, (hx, hy), 4)
                pygame.draw.circle(surf, gold_border, (hx, hy), 4, 1)

    pygame.draw.circle(surf, (15, 23, 42), (cx, cy), 4)

    pygame.draw.line(surf, (203, 213, 225), (cx, cy), (cx - 14, cy - 16), 1)
    pygame.draw.line(surf, (203, 213, 225), (cx, cy), (cx + 14, cy - 16), 1)
    pygame.draw.line(surf, (203, 213, 225), (cx, cy), (cx, cy + 18), 1)
    pygame.draw.circle(surf, (100, 116, 139), (cx, cy), 3)

    return surf


def create_voyager_probe_sprite() -> pygame.Surface:
    """Voyager Interstellar Probe with High-Gain Dish and Golden Record."""
    w, h = 80, 80
    surf = pygame.Surface((w, h), pygame.SRCALPHA)
    cx, cy = w // 2, h // 2

    pygame.draw.circle(surf, (241, 245, 249), (cx, cy - 6), 26)
    pygame.draw.circle(surf, (148, 163, 184), (cx, cy - 6), 26, 2)
    pygame.draw.circle(surf, (51, 65, 85), (cx, cy - 6), 5)

    pygame.draw.rect(surf, (217, 160, 24), (cx - 10, cy + 12, 20, 14), border_radius=2)

    pygame.draw.circle(surf, (255, 215, 0), (cx - 14, cy + 18), 6)
    pygame.draw.circle(surf, (180, 130, 10), (cx - 14, cy + 18), 6, 1)

    pygame.draw.line(surf, (100, 116, 139), (cx + 10, cy + 18), (cx + 34, cy + 22), 2)
    for rx in range(cx + 18, cx + 34, 5):
        pygame.draw.rect(surf, (30, 41, 59), (rx, cy + 19, 4, 7))

    pygame.draw.line(surf, (148, 163, 184), (cx - 10, cy + 14), (cx - 36, cy + 6), 1)
    pygame.draw.circle(surf, (203, 213, 225), (cx - 36, cy + 6), 2)

    return surf


SPRITES = {
    'saturn_stage1': create_saturn_v_stage1_sprite(),
    'saturn_upper': create_saturn_v_upper_stage_sprite(),
    'apollo_lem': create_apollo_lem_sprite(),
    'mars_rover': create_mars_rover_sprite(),
    'docking_target': create_docking_target_sprite(),
    'jwst': create_jwst_telescope_sprite(),
    'voyager': create_voyager_probe_sprite(),
}
