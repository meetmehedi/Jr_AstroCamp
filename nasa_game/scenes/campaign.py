"""
nasa_game/scenes/campaign.py
Jr_AstroCamp Mission Control Hub – vibrant, kid-friendly campaign map.
76 real NASA missions with animated star background, colorful mission cards,
age-adapted difficulty labels, and glowing era banners.
"""
import math
import random
from typing import Callable, List, Optional
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.storage import storage
from nasa_game.ui import (
    Button, COLOR_BG, COLOR_PANEL, COLOR_PANEL_BORDER, COLOR_CYAN, COLOR_GOLD,
    COLOR_EMERALD, COLOR_RED, COLOR_ORANGE, COLOR_PURPLE, COLOR_PINK,
    COLOR_TEXT, COLOR_TEXT_DIM, COLOR_STAR,
    draw_star_field, draw_kid_badge,
)

# Game-type to emoji + color map
TYPE_META = {
    'launch':    ('🚀', (0, 200, 255),   "ROCKET LAUNCH"),
    'docking':   ('🛸', (180, 80, 255),  "SPACE DOCKING"),
    'lander':    ('🌑', (255, 210, 0),   "LUNAR LANDER"),
    'rover':     ('🤖', (0, 230, 120),   "MARS ROVER"),
    'telescope': ('🔭', (255, 145, 0),   "TELESCOPE"),
    'deepspace': ('☄️', (255, 80, 180),  "DEEP SPACE"),
}

AGE_LABELS = {1: "⭐ EASY",  2: "⭐⭐ EASY", 3: "⭐⭐⭐ MEDIUM",
              4: "⭐⭐⭐⭐ HARD", 5: "⭐⭐⭐⭐⭐ EXPERT"}


class CampaignScene:
    WIDTH  = 1024
    HEIGHT = 720

    def __init__(self, missions: List[Mission], on_select_mission: Callable[[Mission], None]):
        self.missions = missions
        self.on_select_mission = on_select_mission

        self.filter_type: Optional[str] = None
        self.page: int = 0
        self.page_size: int = 6
        self.t: float = 0.0   # animation clock

        # Fonts
        self.font_title  = pygame.font.SysFont("arial", 28, bold=True)
        self.font_sub    = pygame.font.SysFont("arial", 14, bold=True)
        self.font_card_t = pygame.font.SysFont("arial", 14, bold=True)
        self.font_card_b = pygame.font.SysFont("arial", 12)
        self.font_tiny   = pygame.font.SysFont("arial", 11)

        # Star field
        self.stars = [
            (random.randint(0, self.WIDTH), random.randint(0, self.HEIGHT),
             random.random(), random.uniform(0.8, 2.5))
            for _ in range(180)
        ]
        # Floating planet decorations
        self.planets = [
            {'x': 920, 'y': 80,  'r': 48, 'col': (255, 130, 30),  'ring': True},
            {'x': 80,  'y': 600, 'r': 32, 'col': (100, 220, 255),  'ring': False},
            {'x': 960, 'y': 560, 'r': 22, 'col': (200, 80, 255),   'ring': False},
        ]

        # Filter buttons row
        self.filter_buttons: List[Button] = []
        self._build_filter_buttons()

        # Pagination
        self.btn_prev = Button(
            pygame.Rect(40, 658, 140, 42),
            "◄ PREV", on_click=self._prev_page,
            color=COLOR_CYAN, bg_color=(5, 25, 65), font_size=15,
        )
        self.btn_next = Button(
            pygame.Rect(844, 658, 140, 42),
            "NEXT ►", on_click=self._next_page,
            color=COLOR_CYAN, bg_color=(5, 25, 65), font_size=15,
        )
        self.btn_audio = Button(
            pygame.Rect(870, 22, 130, 34),
            "🔊 SOUND: ON", on_click=self._toggle_audio,
            color=COLOR_TEXT_DIM, bg_color=(8, 18, 48), font_size=12,
        )

        self.card_buttons: List[Button] = []
        self._update_cards()

    def _build_filter_buttons(self):
        filters = [
            ("ALL 🌌", None),
            ("🚀 LAUNCH",   "launch"),
            ("🛸 DOCKING",  "docking"),
            ("🌑 LANDER",   "lander"),
            ("🤖 ROVER",    "rover"),
            ("🔭 SCOPE",    "telescope"),
            ("☄️ DEEP",     "deepspace"),
        ]
        self.filter_buttons = []
        x = 40
        for label, f_type in filters:
            col = COLOR_CYAN if self.filter_type == f_type else COLOR_TEXT_DIM
            btn = Button(
                pygame.Rect(x, 78, 120, 32),
                label,
                on_click=lambda t=f_type: self._set_filter(t),
                color=col, bg_color=(5, 20, 60), font_size=11,
            )
            self.filter_buttons.append(btn)
            x += 128

    def _set_filter(self, f_type: Optional[str]):
        self.filter_type = f_type
        self.page = 0
        sound_engine.play('click')
        self._build_filter_buttons()
        self._update_cards()

    def _get_filtered(self) -> List[Mission]:
        if self.filter_type:
            return [m for m in self.missions if m.game_type == self.filter_type]
        return self.missions

    def _update_cards(self):
        filtered = self._get_filtered()
        total_pages = max(1, math.ceil(len(filtered) / self.page_size))
        self.page = min(self.page, total_pages - 1)
        page_missions = filtered[self.page * self.page_size: (self.page + 1) * self.page_size]

        self.card_buttons = []
        for i, mission in enumerate(page_missions):
            col = i % 2
            row = i // 2
            cx = 28 + col * 492
            cy = 122 + row * 176
            btn = Button(
                pygame.Rect(cx, cy, 480, 164),
                mission.id,
                on_click=lambda m=mission: self._select(m),
                color=TYPE_META.get(mission.game_type, ('', COLOR_CYAN, ''))[1],
                bg_color=(8, 20, 55),
                font_size=13,
            )
            btn._mission = mission
            self.card_buttons.append(btn)

    def _select(self, mission: Mission):
        sound_engine.play('quindar')
        self.on_select_mission(mission)

    def _prev_page(self):
        self.page = max(0, self.page - 1)
        sound_engine.play('click')
        self._update_cards()

    def _next_page(self):
        filtered = self._get_filtered()
        max_page = max(0, math.ceil(len(filtered) / self.page_size) - 1)
        self.page = min(max_page, self.page + 1)
        sound_engine.play('click')
        self._update_cards()

    def _toggle_audio(self):
        sound_engine.muted = not sound_engine.muted
        self.btn_audio.text = "🔊 SOUND: ON" if not sound_engine.muted else "🔇 SOUND: OFF"

    def handle_event(self, event: pygame.event.Event):
        self.btn_prev.handle_event(event)
        self.btn_next.handle_event(event)
        self.btn_audio.handle_event(event)
        for btn in self.filter_buttons:
            btn.handle_event(event)
        for btn in self.card_buttons:
            btn.handle_event(event)

    def update(self, dt: float):
        self.t += dt
        for btn in self.filter_buttons:
            btn.update(dt)
        self.btn_prev.update(dt)
        self.btn_next.update(dt)
        self.btn_audio.update(dt)
        for btn in self.card_buttons:
            btn.update(dt)

    def draw(self, surface: pygame.Surface):
        # ── Space background ─────────────────────────────────────────────
        surface.fill(COLOR_BG)
        draw_star_field(surface, self.stars, self.t)

        # Floating decorative planets
        for p in self.planets:
            bob = math.sin(self.t * 0.6 + p['x']) * 5
            px, py = int(p['x']), int(p['y'] + bob)
            pygame.draw.circle(surface, p['col'], (px, py), p['r'])
            # Shading
            shade = pygame.Surface((p['r']*2, p['r']*2), pygame.SRCALPHA)
            pygame.draw.circle(shade, (0,0,0,70), (p['r']+4, p['r']-4), p['r'])
            surface.blit(shade, (px - p['r'], py - p['r']))
            if p.get('ring'):
                ring_r = int(p['r'] * 1.6)
                pygame.draw.ellipse(surface, (*p['col'], 120),
                    (px - ring_r, py - 10, ring_r*2, 20), 3)

        # ── Header ───────────────────────────────────────────────────────
        hdr = pygame.Surface((self.WIDTH, 70), pygame.SRCALPHA)
        hdr.fill((4, 12, 45, 220))
        surface.blit(hdr, (0, 0))
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (0, 70), (self.WIDTH, 70), 2)

        # Pulsing title
        pulse = abs(math.sin(self.t * 1.5)) * 30
        title_col = (
            min(255, 0 + int(pulse)),
            min(255, 200 + int(pulse // 2)),
            255,
        )
        title_surf = self.font_title.render("🚀 Jr_AstroCamp · MISSION CONTROL", True, title_col)
        surface.blit(title_surf, (24, 18))

        # Progress counter
        completed = sum(1 for m in self.missions if storage.is_completed(m.id))
        prog_surf = self.font_sub.render(
            f"✅ {completed} / {len(self.missions)} MISSIONS COMPLETED", True, COLOR_GOLD)
        surface.blit(prog_surf, (24, 52))

        self.btn_audio.draw(surface)

        # ── Filter Row ───────────────────────────────────────────────────
        for btn in self.filter_buttons:
            btn.draw(surface)

        pygame.draw.line(surface, COLOR_PANEL_BORDER, (0, 118), (self.WIDTH, 118), 1)

        # ── Mission Cards ────────────────────────────────────────────────
        filtered = self._get_filtered()
        total_pages = max(1, math.ceil(len(filtered) / self.page_size))
        page_missions = filtered[self.page * self.page_size: (self.page + 1) * self.page_size]

        for i, (btn, mission) in enumerate(zip(self.card_buttons, page_missions)):
            col = i % 2
            row = i // 2
            cx = 28 + col * 492
            cy = 122 + row * 176

            # Card background
            card_rect = pygame.Rect(cx, cy, 480, 164)
            is_done = storage.is_completed(mission.id)

            # Card bg with subtle gradient effect
            card_surf = pygame.Surface((480, 164), pygame.SRCALPHA)
            base_col = (8, 20, 55) if not is_done else (5, 40, 20)
            card_surf.fill((*base_col, 230))
            surface.blit(card_surf, (cx, cy))

            # Hover glow
            if btn.hovered:
                glow = pygame.Surface((480, 164), pygame.SRCALPHA)
                type_col = TYPE_META.get(mission.game_type, ('', COLOR_CYAN, ''))[1]
                glow.fill((*type_col, 25))
                surface.blit(glow, (cx, cy))

            # Border
            border_col = (0, 200, 80) if is_done else TYPE_META.get(mission.game_type, ('', COLOR_CYAN, ''))[1]
            bw = 2 if not btn.hovered else 3
            pygame.draw.rect(surface, border_col, card_rect, bw, border_radius=12)

            # Type emoji + name header bar
            emoji, type_col, type_label = TYPE_META.get(mission.game_type, ('🚀', COLOR_CYAN, 'LAUNCH'))
            pygame.draw.rect(surface, (*type_col, 80), (cx, cy, 480, 32), border_radius=12)

            type_surf = self.font_sub.render(f"{emoji}  {type_label}", True, type_col)
            surface.blit(type_surf, (cx + 12, cy + 8))

            # Completed badge
            if is_done:
                done_surf = self.font_sub.render("✅ COMPLETED", True, COLOR_EMERALD)
                surface.blit(done_surf, (cx + 480 - done_surf.get_width() - 10, cy + 8))

            # Mission name
            name = mission.name if len(mission.name) <= 42 else mission.name[:40] + "…"
            name_surf = self.font_card_t.render(name, True, COLOR_TEXT)
            surface.blit(name_surf, (cx + 12, cy + 40))

            # Year + difficulty stars
            diff_str = AGE_LABELS.get(mission.difficulty, "⭐")
            info_surf = self.font_tiny.render(
                f"📅 {mission.year}  |  {diff_str}  |  #{mission.id}", True, COLOR_TEXT_DIM)
            surface.blit(info_surf, (cx + 12, cy + 60))

            # Objective (truncated)
            obj = mission.objective[:95] + "…" if len(mission.objective) > 95 else mission.objective
            obj_surf = self.font_card_b.render(obj, True, (180, 195, 230))
            surface.blit(obj_surf, (cx + 12, cy + 82))

            # Best score
            if is_done:
                best = storage.scores.get(mission.id, 0)
                sc_surf = self.font_sub.render(f"🏆 HIGH SCORE: {best} PTS", True, COLOR_GOLD)
                surface.blit(sc_surf, (cx + 12, cy + 106))
            else:
                # "Click to play!" hint
                play_surf = self.font_sub.render("▶  CLICK TO START MISSION!", True, type_col)
                surface.blit(play_surf, (cx + 12, cy + 106))

            # Progress bar for score
            if is_done:
                best = storage.scores.get(mission.id, 0)
                frac = min(1.0, best / 1000.0)
                bar_w = int(450 * frac)
                pygame.draw.rect(surface, (20, 40, 80), (cx+12, cy+140, 450, 10), border_radius=5)
                if bar_w > 0:
                    pygame.draw.rect(surface, COLOR_GOLD, (cx+12, cy+140, bar_w, 10), border_radius=5)

        # ── Pagination bar ───────────────────────────────────────────────
        page_bg = pygame.Surface((self.WIDTH, 56), pygame.SRCALPHA)
        page_bg.fill((4, 12, 40, 200))
        surface.blit(page_bg, (0, 650))

        self.btn_prev.draw(surface)
        self.btn_next.draw(surface)

        page_label = f"📄  PAGE {self.page + 1} / {total_pages}  ·  {len(filtered)} MISSIONS"
        pl_surf = self.font_sub.render(page_label, True, COLOR_TEXT_DIM)
        surface.blit(pl_surf, (self.WIDTH//2 - pl_surf.get_width()//2, 672))
