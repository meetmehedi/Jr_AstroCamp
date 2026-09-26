"""
nasa_game/graphics.py
High-Definition Procedural Sprite Generator & Particle Simulation System.
Creates authentic NASA spacecraft sprites (Saturn V, Apollo LM, ISS Docking Port,
Mars Perseverance Rover, JWST, Voyager), particle effects, and cinematic shaders.
"""
import math
import random
from typing import List, Tuple, Optional
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
        progress = self.life / self.max_life

        s = max(1.0, self.size * (progress if self.shrink else 1.0))
        r, g, b = self.color
        alpha = int(255 * (progress if self.fade else 1.0))

        if px < -s or px > surface.get_width() + s or py < -s or py > surface.get_height() + s:
            return

        part_surf = pygame.Surface((int(s * 2 + 2), int(s * 2 + 2)), pygame.SRCALPHA)
        center = (int(s + 1), int(s + 1))
        pygame.draw.circle(part_surf, (r, g, b, alpha), center, int(s))

        if self.blend_add:
            surface.blit(part_surf, (px - int(s + 1), py - int(s + 1)), special_flags=pygame.BLEND_ADD)
        else:
            surface.blit(part_surf, (px - int(s + 1), py - int(s + 1)))

class ParticleSystem:
    def __init__(self):
        self.particles: List[Particle] = []

    def emit_flame(self, x: float, y: float, angle_deg: float, speed: float = 240.0, count: int = 4):
        rad = math.radians(angle_deg)
        for _ in range(count):
            spread = random.uniform(-0.25, 0.25)
            s = speed * random.uniform(0.7, 1.3)
            vx = -math.sin(rad + spread) * s
            vy = math.cos(rad + spread) * s
            life = random.uniform(0.18, 0.45)
            size = random.uniform(5.0, 11.0)
            # Yellow to fiery orange core
            c_val = random.random()
            if c_val > 0.6:
                color = (255, 240, 120)  # Core plasma
            elif c_val > 0.25:
                color = (255, 140, 20)   # Hot flame
            else:
                color = (230, 40, 10)    # Outer flame
            self.particles.append(Particle(x, y, vx, vy, color, life, size, shrink=True, fade=True, blend_add=True))

    def emit_smoke(self, x: float, y: float, vx_base: float = 0, vy_base: float = 0, count: int = 2):
        for _ in range(count):
            vx = vx_base + random.uniform(-25, 25)
            vy = vy_base + random.uniform(-15, 15)
            life = random.uniform(0.6, 1.4)
            size = random.uniform(8.0, 22.0)
            gray = random.randint(110, 180)
            self.particles.append(Particle(x, y, vx, vy, (gray, gray, gray), life, size, shrink=False, fade=True, blend_add=False))

    def emit_rcs(self, x: float, y: float, vx: float, vy: float, count: int = 3):
        for _ in range(count):
            spread_x = vx + random.uniform(-12, 12)
            spread_y = vy + random.uniform(-12, 12)
            life = random.uniform(0.12, 0.25)
            size = random.uniform(2.5, 5.5)
            color = (200, 235, 255)
            self.particles.append(Particle(x, y, spread_x, spread_y, color, life, size, shrink=True, fade=True, blend_add=True))

    def emit_dust(self, x: float, y: float, color: Tuple[int, int, int] = (195, 180, 160), count: int = 3):
        for _ in range(count):
            vx = random.uniform(-60, 60)
            vy = random.uniform(-30, -5)
            life = random.uniform(0.3, 0.8)
            size = random.uniform(3.0, 7.0)
            self.particles.append(Particle(x, y, vx, vy, color, life, size, shrink=True, fade=True, blend_add=False))

    def emit_explosion(self, x: float, y: float, count: int = 35):
        for _ in range(count):
            ang = random.uniform(0, math.pi * 2)
            spd = random.uniform(40, 280)
            vx = math.cos(ang) * spd
            vy = math.sin(ang) * spd
            life = random.uniform(0.3, 0.9)
            size = random.uniform(4.0, 12.0)
            c = random.choice([(255, 240, 100), (255, 120, 20), (255, 40, 0), (240, 240, 240)])
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
# PROCEDURAL SPACECRAFT SPRITES (HD Hand-Crafted Surfaces)
# ─────────────────────────────────────────────────────────────────────────────

def create_saturn_v_stage1_sprite() -> pygame.Surface:
    """Saturn V First Stage (S-IC) with F-1 Engine Cluster and Decals."""
    w, h = 48, 140
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    # Main Booster Body (Cylinder with shaded highlights)
    body_rect = pygame.Rect(8, 20, 32, 90)
    for x_offset in range(32):
        shade = int(220 + 35 * math.sin((x_offset / 32) * math.pi))
        col = (shade, shade, shade)
        pygame.draw.line(surf, col, (8 + x_offset, 20), (8 + x_offset, 110))

    # Roll Pattern Stripes (Iconic Saturn V Black & White segments)
    pygame.draw.rect(surf, (20, 20, 25), (8, 35, 16, 28))
    pygame.draw.rect(surf, (20, 20, 25), (24, 75, 16, 25))

    # USA & NASA Insignia Decal lines
    pygame.draw.line(surf, (180, 20, 20), (20, 50), (28, 50), 2)  # Red line
    pygame.draw.line(surf, (20, 60, 180), (20, 54), (28, 54), 2)  # Blue line

    # Forward Interstage ring
    pygame.draw.rect(surf, (70, 75, 85), (6, 16, 36, 6))

    # Fins (4 aerodynamic stabilizing fins)
    pygame.draw.polygon(surf, (230, 230, 235), [(8, 90), (0, 112), (8, 110)])
    pygame.draw.polygon(surf, (230, 230, 235), [(40, 90), (48, 112), (40, 110)])

    # F-1 Engine Bells (Gimbaled titanium nozzles with fiery interior)
    nozzle_coords = [(12, 110), (24, 110), (36, 110)]
    for nx, ny in nozzle_coords:
        pygame.draw.polygon(surf, (60, 65, 75), [(nx - 5, ny), (nx + 5, ny), (nx + 7, ny + 16), (nx - 7, ny + 16)])
        pygame.draw.ellipse(surf, (255, 160, 40), (nx - 5, ny + 12, 10, 5))

    return surf

def create_saturn_v_upper_stage_sprite() -> pygame.Surface:
    """Saturn V Upper Stages (S-II / S-IVB + Apollo CSM & Launch Escape Tower)."""
    w, h = 48, 130
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    # Launch Escape Tower (Spire needle + truss)
    pygame.draw.line(surf, (220, 220, 220), (24, 0), (24, 16), 2)
    pygame.draw.polygon(surf, (240, 240, 245), [(22, 16), (26, 16), (25, 26), (23, 26)])
    pygame.draw.line(surf, (160, 160, 170), (21, 26), (24, 16), 1)
    pygame.draw.line(surf, (160, 160, 170), (27, 26), (24, 16), 1)

    # Apollo Command Module (White conical heat-shield capsule)
    pygame.draw.polygon(surf, (245, 245, 250), [(24, 26), (32, 44), (16, 44)])
    pygame.draw.polygon(surf, (40, 45, 55), [(22, 34), (26, 34), (27, 37), (21, 37)]) # Window

    # Service Module (Silver cylinder with radiator panels)
    pygame.draw.rect(surf, (215, 220, 230), (14, 44, 20, 26))
    pygame.draw.line(surf, (120, 130, 145), (14, 52), (34, 52), 1)
    pygame.draw.line(surf, (120, 130, 145), (14, 62), (34, 62), 1)
    # SPS Engine Nozzle
    pygame.draw.polygon(surf, (70, 70, 80), [(21, 70), (27, 70), (29, 80), (19, 80)])

    # S-IVB Third Stage Body
    pygame.draw.rect(surf, (240, 240, 245), (11, 80, 26, 36))
    pygame.draw.rect(surf, (25, 25, 30), (11, 88, 13, 14)) # Black roll marking
    # J-2 Engine Bell
    pygame.draw.polygon(surf, (80, 85, 95), [(18, 116), (30, 116), (33, 128), (15, 128)])
    pygame.draw.ellipse(surf, (255, 180, 60), (18, 124, 12, 5))

    return surf

def create_apollo_lem_sprite() -> pygame.Surface:
    """Apollo Lunar Module (Eagle) with Gold Foil, Thruster Quads, and Footpads."""
    w, h = 64, 64
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    # 1. Landing Gear Struts & Footpads (Descent Stage Base)
    # Legs (Angular trusses extending to 4 corners)
    pygame.draw.line(surf, (180, 160, 120), (22, 38), (6, 56), 2)
    pygame.draw.line(surf, (180, 160, 120), (42, 38), (58, 56), 2)
    # Footpad dishes
    pygame.draw.ellipse(surf, (220, 190, 80), (2, 55, 9, 4))
    pygame.draw.ellipse(surf, (220, 190, 80), (53, 55, 9, 4))
    pygame.draw.ellipse(surf, (220, 190, 80), (27, 56, 10, 4)) # Center leg

    # 2. Descent Stage (Octagonal Box covered in crumpled Kapton Gold Thermal Foil)
    gold_base = (212, 160, 23)
    gold_highlight = (245, 205, 50)
    pygame.draw.rect(surf, gold_base, (18, 32, 28, 16))
    # Foil wrinkle texture lines
    for fx in range(19, 45, 4):
        pygame.draw.line(surf, gold_highlight, (fx, 33), (fx + 2, 47), 1)

    # Descent Engine Bell
    pygame.draw.polygon(surf, (70, 75, 80), [(26, 48), (38, 48), (41, 56), (23, 56)])
    pygame.draw.ellipse(surf, (255, 170, 40), (26, 54, 12, 4))

    # 3. Ascent Stage (Cabin, Triangular Windows, Rendezvous Radar, RCS)
    # Midsection cabin
    pygame.draw.rect(surf, (210, 215, 220), (20, 18, 24, 15))
    # Front hatch & EVA porch
    pygame.draw.rect(surf, (50, 55, 65), (29, 23, 6, 9))
    # Triangular Astronaut Windows
    pygame.draw.polygon(surf, (30, 40, 60), [(23, 20), (27, 20), (25, 24)])
    pygame.draw.polygon(surf, (30, 40, 60), [(37, 20), (41, 20), (39, 24)])

    # Rendezvous Radar Antenna on top
    pygame.draw.line(surf, (160, 160, 170), (32, 18), (32, 10), 1)
    pygame.draw.arc(surf, (240, 240, 250), (28, 8, 8, 8), math.pi * 0.2, math.pi * 0.8, 2)

    # Reaction Control System (RCS) 4-Way Thruster Quads
    rcs_coords = [(18, 24), (46, 24)]
    for rx, ry in rcs_coords:
        pygame.draw.circle(surf, (120, 120, 130), (rx, ry), 2)
        pygame.draw.line(surf, (80, 85, 90), (rx - 3, ry), (rx + 3, ry), 1)
        pygame.draw.line(surf, (80, 85, 90), (rx, ry - 3), (rx, ry + 3), 1)

    return surf

def create_mars_rover_sprite() -> pygame.Surface:
    """Mars Rover (Perseverance/Curiosity) with Rocker-Bogie Suspension & Mastcam."""
    w, h = 64, 48
    surf = pygame.Surface((w, h), pygame.SRCALPHA)

    # 6 Cleated Aluminum Wheels
    wheel_col = (70, 75, 80)
    wheels = [(8, 36), (20, 36), (56, 36), (8, 42), (32, 42), (56, 42)]
    for wx, wy in wheels:
        pygame.draw.rect(surf, wheel_col, (wx - 4, wy - 3, 8, 6), border_radius=2)
        pygame.draw.line(surf, (130, 135, 140), (wx - 2, wy), (wx + 2, wy), 1)

    # Rocker-Bogie Titanium Suspension Struts
    pygame.draw.line(surf, (150, 155, 160), (12, 36), (32, 28), 2)
    pygame.draw.line(surf, (150, 155, 160), (32, 28), (52, 36), 2)
    pygame.draw.circle(surf, (100, 105, 110), (32, 28), 3)

    # Main Rover Chassis (White insulated warm electronics box)
    pygame.draw.rect(surf, (235, 235, 240), (16, 16, 34, 14), border_radius=3)
    pygame.draw.rect(surf, (200, 150, 30), (18, 18, 12, 8)) # Gold thermal blanket zone

    # MMRTG Nuclear Power Unit (Rear cylindrical finned heat radiator)
    pygame.draw.rect(surf, (60, 65, 70), (46, 14, 12, 10), border_radius=2)
    for fx in range(48, 58, 2):
        pygame.draw.line(surf, (120, 125, 130), (fx, 13), (fx, 25), 1)

    # Remote Sensing Mast & Mastcam-Z Dual Eyes
    pygame.draw.line(surf, (180, 180, 190), (22, 16), (22, 5), 2)
    pygame.draw.rect(surf, (50, 55, 60), (18, 2, 10, 5), border_radius=1)
    pygame.draw.circle(surf, (56, 189, 248), (21, 4), 1) # Camera eye 1
    pygame.draw.circle(surf, (56, 189, 248), (25, 4), 1) # Camera eye 2

    # Robotic Sample Arm (Front articulated arm with drill turret)
    pygame.draw.line(surf, (140, 145, 150), (16, 24), (8, 26), 2)
    pygame.draw.circle(surf, (80, 85, 90), (7, 26), 3)

    return surf

def create_docking_target_sprite() -> pygame.Surface:
    """Space Station International Docking Adapter (IDA) with Guide Petals."""
    size = 180
    surf = pygame.Surface((size, size), pygame.SRCALPHA)
    cx, cy = size // 2, size // 2

    # Outer Station Module Hull
    pygame.draw.circle(surf, (40, 48, 64), (cx, cy), 85)
    pygame.draw.circle(surf, (71, 85, 105), (cx, cy), 85, 3)

    # Docking Adapter Collar
    pygame.draw.circle(surf, (30, 35, 45), (cx, cy), 65)
    pygame.draw.circle(surf, (148, 163, 184), (cx, cy), 65, 2)

    # 3 Peripheral Guide Petals (120 deg apart)
    for i in range(3):
        ang = i * (2 * math.pi / 3) - math.pi / 2
        px = cx + math.cos(ang) * 60
        py = cy + math.sin(ang) * 60
        pygame.draw.circle(surf, (203, 213, 225), (int(px), int(py)), 8)
        pygame.draw.circle(surf, (15, 23, 42), (int(px), int(py)), 4)

    # Inner Transfer Hatch Tunnel (Black void into pressurized module)
    pygame.draw.circle(surf, (6, 9, 16), (cx, cy), 38)
    pygame.draw.circle(surf, (56, 189, 248), (cx, cy), 38, 1)

    # Optical Target Crosshairs & Alignment Bars
    pygame.draw.line(surf, (56, 189, 248), (cx - 28, cy), (cx + 28, cy), 1)
    pygame.draw.line(surf, (56, 189, 248), (cx, cy - 28), (cx, cy + 28), 1)
    pygame.draw.circle(surf, (56, 189, 248), (cx, cy), 8, 1)

    # 4 Flashing LED Alignment Strobes
    leds = [(cx - 72, cy), (cx + 72, cy), (cx, cy - 72), (cx, cy + 72)]
    for lx, ly in leds:
        pygame.draw.circle(surf, (251, 191, 36), (lx, ly), 4)
        pygame.draw.circle(surf, (255, 255, 255), (lx, ly), 2)

    return surf

def create_jwst_telescope_sprite() -> pygame.Surface:
    """James Webb Space Telescope with 18 Gold Hexagonal Mirrors and Sunshield."""
    w, h = 96, 72
    surf = pygame.Surface((w, h), pygame.SRCALPHA)
    cx, cy = w // 2, h // 2

    # 5-Layer Silver/Pink Kapton Sunshield (Kite shape)
    shield_pts = [(cx, 4), (w - 8, cy), (cx, h - 6), (8, cy)]
    pygame.draw.polygon(surf, (180, 190, 210), shield_pts)
    pygame.draw.polygon(surf, (220, 180, 200), [(cx, 8), (w - 14, cy), (cx, h - 10), (14, cy)])
    pygame.draw.polygon(surf, (71, 85, 105), shield_pts, 1)

    # Central Primary Mirror Array (Golden Beryllium Hexagons)
    gold = (245, 195, 35)
    gold_dark = (190, 140, 15)
    for row in range(-2, 3):
        for col in range(-2, 3):
            if abs(row) + abs(col) <= 3 and not (row == 0 and col == 0):
                hx = cx + col * 7
                hy = cy + row * 6 + (col % 2) * 3
                pygame.draw.circle(surf, gold, (hx, hy), 4)
                pygame.draw.circle(surf, gold_dark, (hx, hy), 4, 1)

    # Center Instrument Core
    pygame.draw.circle(surf, (30, 35, 45), (cx, cy), 4)

    # Secondary Mirror Support Tripod
    pygame.draw.line(surf, (220, 225, 230), (cx, cy), (cx - 14, cy - 16), 1)
    pygame.draw.line(surf, (220, 225, 230), (cx, cy), (cx + 14, cy - 16), 1)
    pygame.draw.line(surf, (220, 225, 230), (cx, cy), (cx, cy + 18), 1)
    pygame.draw.circle(surf, (150, 160, 170), (cx, cy), 3)

    return surf

def create_voyager_probe_sprite() -> pygame.Surface:
    """Voyager Interstellar Probe with High-Gain Dish, RTG & Golden Record."""
    w, h = 80, 80
    surf = pygame.Surface((w, h), pygame.SRCALPHA)
    cx, cy = w // 2, h // 2

    # High-Gain Parabolic Antenna Dish (White 3.7m reflector)
    pygame.draw.circle(surf, (240, 242, 245), (cx, cy - 6), 26)
    pygame.draw.circle(surf, (200, 205, 215), (cx, cy - 6), 26, 2)
    pygame.draw.circle(surf, (70, 75, 85), (cx, cy - 6), 5) # Sub-reflector feed

    # Spacecraft Bus Body (10-sided box)
    pygame.draw.rect(surf, (212, 160, 23), (cx - 10, cy + 12, 20, 14), border_radius=2)

    # The Golden Record (Gold Phonograph disc mounted on the side)
    pygame.draw.circle(surf, (255, 215, 0), (cx - 14, cy + 18), 6)
    pygame.draw.circle(surf, (160, 120, 10), (cx - 14, cy + 18), 6, 1)
    pygame.draw.circle(surf, (80, 60, 5), (cx - 14, cy + 18), 2)

    # RTG Boom (Radioisotope Thermoelectric Generators extending to right)
    pygame.draw.line(surf, (120, 125, 135), (cx + 10, cy + 18), (cx + 34, cy + 22), 2)
    for rx in range(cx + 18, cx + 34, 5):
        pygame.draw.rect(surf, (40, 45, 50), (rx, cy + 19, 4, 7))

    # Magnetometer Boom extending to left
    pygame.draw.line(surf, (160, 165, 175), (cx - 10, cy + 14), (cx - 36, cy + 6), 1)
    pygame.draw.circle(surf, (220, 220, 230), (cx - 36, cy + 6), 2)

    return surf

# Global Cache of Pre-Rendered Spacecraft Sprites
SPRITES = {
    'saturn_stage1': create_saturn_v_stage1_sprite(),
    'saturn_upper': create_saturn_v_upper_stage_sprite(),
    'apollo_lem': create_apollo_lem_sprite(),
    'mars_rover': create_mars_rover_sprite(),
    'docking_target': create_docking_target_sprite(),
    'jwst': create_jwst_telescope_sprite(),
    'voyager': create_voyager_probe_sprite(),
}
