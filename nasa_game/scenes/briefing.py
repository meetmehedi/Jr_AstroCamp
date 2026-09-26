"""
nasa_game/scenes/briefing.py
Jr_AstroCamp Mission Briefing Screen.
Vibrant, exciting kid-friendly briefing with mission art,
simplified objectives, controls guide, and big LAUNCH button.
"""
import math
import random
from typing import Callable
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.storage import storage
from nasa_game.ui import (
    Button, COLOR_BG, COLOR_PANEL, COLOR_PANEL_BORDER,
    COLOR_CYAN, COLOR_GOLD, COLOR_EMERALD, COLOR_RED, COLOR_ORANGE,
    COLOR_PURPLE, COLOR_PINK, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_wrapped_text, draw_star_field, draw_kid_badge,
)

TYPE_META = {
    'launch':    ('🚀', (0, 200, 255),   "ROCKET LAUNCH",   "Fire the engines and blast into space!"),
    'docking':   ('🛸', (180, 80, 255),  "SPACE DOCKING",   "Navigate your spacecraft to dock with the station!"),
    'lander':    ('🌑', (255, 210, 0),   "LUNAR LANDER",    "Land your spacecraft softly on the Moon!"),
    'rover':     ('🤖', (0, 230, 120),   "MARS ROVER",      "Drive your rover across Mars to collect samples!"),
    'telescope': ('🔭', (255, 145, 0),   "TELESCOPE",       "Aim your telescope at distant stars and galaxies!"),
    'deepspace': ('☄️', (255, 80, 180),  "DEEP SPACE",      "Fly past planets using gravity to reach deep space!"),
}

CONTROLS = {
    'launch':    [
        "⬆  W or ↑ Arrow  =  Throttle UP  (go faster!)",
        "⬇  S or ↓ Arrow  =  Throttle DOWN",
        "◀  A or ← Arrow  =  Tilt rocket LEFT",
        "▶  D or → Arrow  =  Tilt rocket RIGHT",
        "🔴  SPACE  =  Stage Separation (drop empty fuel tank)",
    ],
    'docking':   [
        "⬆⬇◀▶  WASD or Arrow Keys  =  Move spacecraft",
        "🔴  Q / E  =  Speed up / Slow approach",
        "✅  Hold reticle in the docking port to latch!",
    ],
    'lander':    [
        "⬆  W or ↑  =  Fire descent thruster (slow down!)",
        "◀▶  A / D  =  Tilt left or right",
        "✅  Land GENTLY in the green landing zone!",
        "⚠️  Touch down < 2.5 m/s or you'll crash!",
    ],
    'rover':     [
        "⬆⬇  W / S  =  Drive forward / backward",
        "◀▶  A / D  =  Steer left / right",
        "🎯  Drive over all the glowing SAMPLE waypoints!",
        "⚡  Watch your battery – don't run out of power!",
    ],
    'telescope': [
        "🖱  MOUSE or ↑↓◀▶  =  Aim your telescope",
        "✅  Hold the crosshair on the glowing star to scan it!",
        "🎯  Scan all the target stars before time runs out!",
    ],
    'deepspace': [
        "⬆⬇◀▶  WASD or Arrow Keys  =  Fire thrusters",
        "🌍  Fly close to planets to get a GRAVITY ASSIST boost!",
        "🎯  Reach the final destination target ring!",
    ],
}

AGE_TIPS = {
    1: "✨ Super Easy – Perfect for beginners! Take your time!",
    2: "🌟 Easy – Read the controls above and you'll be great!",
    3: "⭐ Medium – Focus on the goal bar at the top!",
    4: "💫 Hard – Use fuel carefully and watch your speed!",
    5: "🔥 Expert – Challenge yourself, junior astronaut!",
}


class BriefingScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_start_flight: Callable[[Mission], None],
                 on_back: Callable[[], None]):
        self.mission = mission
        self.on_start_flight = on_start_flight
        self.on_back = on_back
        self.t = 0.0

        # Stars
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.8, 2.2))
            for _ in range(140)
        ]

        self.font_title    = pygame.font.SysFont("arial", 26, bold=True)
        self.font_heading  = pygame.font.SysFont("arial", 16, bold=True)
        self.font_body     = pygame.font.SysFont("arial", 14)
        self.font_ctrl     = pygame.font.SysFont("arial", 14, bold=True)
        self.font_mono     = pygame.font.SysFont("monospace", 12)
        self.font_badge    = pygame.font.SysFont("arial", 20, bold=True)

        emoji, type_col, type_label, tagline = TYPE_META.get(
            mission.game_type, ('🚀', COLOR_CYAN, 'LAUNCH', 'Fly into space!'))
        self.type_col = type_col

        self.btn_launch = Button(
            pygame.Rect(640, 636, 330, 60),
            f"{emoji}  LAUNCH MISSION!",
            on_click=self._launch,
            color=(255, 255, 255),
            bg_color=(5, 80, 30),
            font_size=20,
        )
        self.btn_back = Button(
            pygame.Rect(54, 636, 220, 60),
            "◄  BACK TO MAP",
            on_click=self._back,
            color=COLOR_TEXT_DIM,
            bg_color=(10, 20, 60),
            font_size=16,
        )

    def _launch(self):
        sound_engine.play('quindar')
        self.on_start_flight(self.mission)

    def _back(self):
        sound_engine.play('click')
        self.on_back()

    def handle_event(self, event):
        self.btn_launch.handle_event(event)
        self.btn_back.handle_event(event)

    def update(self, dt):
        self.t += dt
        self.btn_launch.update(dt)
        self.btn_back.update(dt)

    def draw(self, surface: pygame.Surface):
        surface.fill(COLOR_BG)
        draw_star_field(surface, self.stars, self.t)

        emoji, type_col, type_label, tagline = TYPE_META.get(
            self.mission.game_type, ('🚀', COLOR_CYAN, 'LAUNCH', ''))

        # ── Top Banner ────────────────────────────────────────────────────
        banner = pygame.Surface((self.W, 110), pygame.SRCALPHA)
        banner.fill((4, 12, 48, 235))
        surface.blit(banner, (0, 0))
        pygame.draw.line(surface, type_col, (0, 110), (self.W, 110), 3)

        # Type label badge
        type_surf = self.font_heading.render(f"{emoji}  {type_label}", True, type_col)
        surface.blit(type_surf, (28, 14))

        # Mission ID + year pill
        meta = f"  #{self.mission.id} · {self.mission.program} · {self.mission.year} · {self.mission.status.upper()}  "
        meta_surf = self.font_mono.render(meta, True, (180, 200, 230))
        surface.blit(meta_surf, (28, 38))

        # Mission name (big)
        name = self.mission.name
        name_surf = self.font_title.render(name, True, COLOR_TEXT)
        surface.blit(name_surf, (28, 60))

        # Tagline
        tag_surf = self.font_body.render(tagline, True, (170, 190, 240))
        surface.blit(tag_surf, (28, 90))

        # Difficulty stars (right)
        diff_str = "⭐" * self.mission.difficulty + "☆" * (5 - self.mission.difficulty)
        diff_surf = self.font_heading.render(diff_str, True, COLOR_GOLD)
        surface.blit(diff_surf, (self.W - diff_surf.get_width() - 24, 18))
        diff_label = pygame.font.SysFont("arial", 12).render(
            AGE_TIPS.get(self.mission.difficulty, ""), True, COLOR_GOLD)
        surface.blit(diff_label, (self.W - diff_label.get_width() - 24, 50))

        # ── Main content area ─────────────────────────────────────────────
        main_top = 120
        main_h   = 500

        # Left column: Objective + Protocol
        left_rect = pygame.Rect(28, main_top, 490, main_h)
        pygame.draw.rect(surface, (8, 20, 58, 220), left_rect, border_radius=12)
        pygame.draw.rect(surface, type_col, left_rect, 2, border_radius=12)

        y = main_top + 16

        # Primary Objective
        h1 = self.font_heading.render("🎯  YOUR MISSION:", True, COLOR_GOLD)
        surface.blit(h1, (44, y)); y += 28
        y = draw_wrapped_text(surface, self.mission.objective, 44, y, 460,
                              self.font_body, COLOR_TEXT, 6)

        y += 16
        pygame.draw.line(surface, (40, 60, 130), (44, y), (502, y), 1); y += 14

        # Historical protocol
        h2 = self.font_heading.render("📜  REAL NASA HISTORY:", True, COLOR_CYAN)
        surface.blit(h2, (44, y)); y += 28
        proto = self.mission.protocol.replace("Manual Protocol:", "").strip()
        # Limit to keep within box
        if len(proto) > 350:
            proto = proto[:347] + "…"
        y = draw_wrapped_text(surface, proto, 44, y, 460,
                              self.font_body, (196, 181, 253), 5)

        # Right column: Controls + tip + previous score
        right_rect = pygame.Rect(534, main_top, 462, main_h)
        pygame.draw.rect(surface, (8, 20, 58, 220), right_rect, border_radius=12)
        pygame.draw.rect(surface, type_col, right_rect, 2, border_radius=12)

        ry = main_top + 16
        h3 = self.font_heading.render("🕹️  HOW TO PLAY:", True, COLOR_EMERALD)
        surface.blit(h3, (550, ry)); ry += 30

        ctrl_lines = CONTROLS.get(self.mission.game_type, ["Standard flight controls."])
        for line in ctrl_lines:
            ls = self.font_ctrl.render(line, True, COLOR_TEXT)
            surface.blit(ls, (550, ry)); ry += 32

        ry += 10
        pygame.draw.line(surface, (40, 60, 130), (550, ry), (980, ry), 1); ry += 14

        # Age tip box
        tip = AGE_TIPS.get(self.mission.difficulty, "")
        tip_surf = self.font_body.render(tip, True, COLOR_GOLD)
        surface.blit(tip_surf, (550, ry)); ry += 36

        # Simulation params summary
        params = self.mission.params
        pygame.draw.line(surface, (40, 60, 130), (550, ry), (980, ry), 1); ry += 12
        ph = self.font_heading.render("📊  SIMULATION SPECS:", True, type_col)
        surface.blit(ph, (550, ry)); ry += 26

        param_font = pygame.font.SysFont("monospace", 12)
        if 'target_alt' in params:
            surface.blit(param_font.render(f"  Target Altitude : {params['target_alt']:.0f} km", True, (180, 200, 230)), (550, ry)); ry += 18
        if 'target_vel' in params:
            surface.blit(param_font.render(f"  Target Velocity : {params['target_vel']:.1f} km/s", True, (180, 200, 230)), (550, ry)); ry += 18
        if 'fuel' in params:
            surface.blit(param_font.render(f"  Fuel Budget     : {params['fuel']:.0f} units", True, (180, 200, 230)), (550, ry)); ry += 18
        if 'time_limit' in params:
            surface.blit(param_font.render(f"  Time Limit      : {params['time_limit']:.0f} seconds", True, (180, 200, 230)), (550, ry)); ry += 18
        if 'waypoints' in params:
            surface.blit(param_font.render(f"  Waypoints       : {int(params['waypoints'])}", True, (180, 200, 230)), (550, ry)); ry += 18
        if 'targets' in params:
            surface.blit(param_font.render(f"  Star Targets    : {int(params['targets'])}", True, (180, 200, 230)), (550, ry)); ry += 18

        # Previous score badge
        if storage.is_completed(self.mission.id):
            best = storage.scores.get(self.mission.id, 0)
            ry += 10
            pygame.draw.rect(surface, (10, 60, 20), (550, ry, 420, 46), border_radius=10)
            pygame.draw.rect(surface, COLOR_EMERALD, (550, ry, 420, 46), 2, border_radius=10)
            done_surf = self.font_heading.render(
                f"✅ COMPLETED!  🏆 HIGH SCORE: {best} PTS", True, COLOR_EMERALD)
            surface.blit(done_surf, (560, ry + 14))

        # ── Bottom Bar ────────────────────────────────────────────────────
        bot = pygame.Surface((self.W, 84), pygame.SRCALPHA)
        bot.fill((4, 12, 40, 230))
        surface.blit(bot, (0, 636))
        pygame.draw.line(surface, type_col, (0, 636), (self.W, 636), 2)

        self.btn_back.draw(surface)
        self.btn_launch.draw(surface)

        # Pulsing "ready?" label between buttons
        pulse = abs(math.sin(self.t * 2.5))
        ready_col = tuple(int(c * (0.5 + 0.5 * pulse)) for c in type_col)
        ready = self.font_heading.render("Ready, Astronaut? 👨‍🚀", True, ready_col)
        surface.blit(ready, (self.W//2 - ready.get_width()//2, 658))
