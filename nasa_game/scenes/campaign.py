"""
nasa_game/scenes/campaign.py
NASA Mission Flight Operations Directorate & Campaign Manifest Hub.
Features 76 historical NASA missions categorized across 6 aerospace disciplines,
real-time telemetry stats, historical era filtering, and flight readiness status.
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
    COLOR_EMERALD, COLOR_RED, COLOR_ORANGE, COLOR_PURPLE, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_star_field, draw_hud_panel, get_font
)

TYPE_META = {
    'launch':    ('ROCKET LAUNCH',     (56, 189, 248),  "ORBITAL INSERTION"),
    'docking':   ('SPACE DOCKING',     (168, 85, 247),  "RENDEZVOUS & PROX"),
    'lander':    ('LUNAR LANDER',      (245, 158, 11),  "TERMINAL DESCENT"),
    'rover':     ('MARS ROVER',        (16, 185, 129),  "SURFACE MOBILITY"),
    'telescope': ('OBSERVATORY',       (249, 115, 22),  "DEEP FIELD IMAGING"),
    'deepspace': ('DEEP SPACE PROBE',  (236, 72, 153),  "GRAVITY SLINGSHOT"),
}

DIFFICULTY_LABELS = {
    1: "CADET (TIER 1)",
    2: "PILOT (TIER 2)",
    3: "COMMANDER (TIER 3)",
    4: "FLIGHT DIRECTOR (TIER 4)",
    5: "VETERAN ASTRONAUT (TIER 5)"
}

class CampaignScene:
    WIDTH  = 1024
    HEIGHT = 720

    def __init__(self, missions: List[Mission], on_select_mission: Callable[[Mission], None]):
        self.missions = missions
        self.on_select_mission = on_select_mission

        self.filter_type: Optional[str] = None
        self.page: int = 0
        self.page_size: int = 6
        self.t: float = 0.0

        # Fonts
        self.font_title  = get_font(22, bold=True, mono=True)
        self.font_sub    = get_font(13, bold=True, mono=True)
        self.font_card_t = get_font(13, bold=True, mono=True)
        self.font_card_b = get_font(11, bold=False, mono=True)
        self.font_tiny   = get_font(10, bold=True, mono=True)

        self.stars = [
            (random.randint(0, self.WIDTH), random.randint(0, self.HEIGHT),
             random.random(), random.uniform(0.6, 2.0))
            for _ in range(160)
        ]

        self.filter_buttons: List[Button] = []
        self._build_filter_buttons()

        self.btn_prev = Button(
            pygame.Rect(40, 658, 140, 38),
            "◄ PREV PAGE", on_click=self._prev_page,
            color=COLOR_CYAN, bg_color=(15, 23, 42), font_size=13,
        )
        self.btn_next = Button(
            pygame.Rect(844, 658, 140, 38),
            "NEXT PAGE ►", on_click=self._next_page,
            color=COLOR_CYAN, bg_color=(15, 23, 42), font_size=13,
        )
        self.btn_audio = Button(
            pygame.Rect(860, 22, 140, 32),
            "AUDIO: ACTIVE", on_click=self._toggle_audio,
            color=COLOR_TEXT_DIM, bg_color=(15, 23, 42), font_size=11,
        )

        self.card_buttons: List[Button] = []
        self._update_cards()

    def _build_filter_buttons(self):
        filters = [
            ("ALL MISSIONS", None),
            ("LAUNCH",       "launch"),
            ("DOCKING",      "docking"),
            ("LANDER",       "lander"),
            ("ROVER",        "rover"),
            ("OBSERVATORY",  "telescope"),
            ("DEEP SPACE",   "deepspace"),
        ]
        self.filter_buttons.clear()
        x = 40
        btn_w = 126
        for label, ftype in filters:
            rect = pygame.Rect(x, 90, btn_w, 32)
            btn = Button(
                rect, label,
                on_click=lambda t=ftype: self._set_filter(t),
                color=COLOR_CYAN if self.filter_type == ftype else COLOR_TEXT_DIM,
                bg_color=(15, 23, 42) if self.filter_type == ftype else (10, 16, 26),
                font_size=11,
            )
            self.filter_buttons.append(btn)
            x += btn_w + 10

    def _set_filter(self, ftype: Optional[str]):
        self.filter_type = ftype
        self.page = 0
        sound_engine.play('click')
        self._build_filter_buttons()
        self._update_cards()

    def _get_filtered_missions(self) -> List[Mission]:
        if not self.filter_type:
            return self.missions
        return [m for m in self.missions if m.game_type == self.filter_type]

    def _update_cards(self):
        filtered = self._get_filtered_missions()
        start = self.page * self.page_size
        page_missions = filtered[start:start + self.page_size]

        self.card_buttons.clear()
        card_w, card_h = 448, 148
        positions = [
            (40,  140), (536, 140),
            (40,  304), (536, 304),
            (40,  468), (536, 468),
        ]

        for i, mission in enumerate(page_missions):
            pos = positions[i]
            rect = pygame.Rect(pos[0], pos[1], card_w, card_h)
            btn = Button(
                rect, "",
                on_click=lambda m=mission: self._select_mission(m),
                bg_color=(11, 19, 32),
            )
            self.card_buttons.append(btn)

    def _select_mission(self, mission: Mission):
        sound_engine.play('click')
        self.on_select_mission(mission)

    def _prev_page(self):
        if self.page > 0:
            self.page -= 1
            sound_engine.play('click')
            self._update_cards()

    def _next_page(self):
        filtered = self._get_filtered_missions()
        max_page = (len(filtered) - 1) // self.page_size
        if self.page < max_page:
            self.page += 1
            sound_engine.play('click')
            self._update_cards()

    def _toggle_audio(self):
        sound_engine.toggle_mute()
        is_muted = sound_engine.is_muted()
        self.btn_audio.text = "AUDIO: MUTED" if is_muted else "AUDIO: ACTIVE"
        self.btn_audio.color = COLOR_RED if is_muted else COLOR_TEXT_DIM

    def handle_event(self, event: pygame.event.Event):
        for btn in self.filter_buttons:
            if btn.handle_event(event):
                return
        for btn in self.card_buttons:
            if btn.handle_event(event):
                return
        if self.btn_prev.handle_event(event):
            return
        if self.btn_next.handle_event(event):
            return
        if self.btn_audio.handle_event(event):
            return

    def update(self, dt: float):
        self.t += dt
        for btn in self.filter_buttons:
            btn.update(dt)
        for btn in self.card_buttons:
            btn.update(dt)
        self.btn_prev.update(dt)
        self.btn_next.update(dt)
        self.btn_audio.update(dt)

    def draw(self, surface: pygame.Surface):
        # 1. Background Void
        surface.fill(COLOR_BG)
        draw_star_field(surface, self.stars, self.t)

        # 2. Header Panel
        draw_hud_panel(surface, pygame.Rect(12, 12, self.WIDTH - 24, 64), title="NASA FLIGHT OPERATIONS DIRECTORATE")
        
        title_txt = "NASA MISSION CAMPAIGN MANIFEST"
        surface.blit(self.font_title.render(title_txt, True, COLOR_CYAN), (26, 26))

        # Progress & Total Manifest
        completed_count = storage.total_completed()
        pct = storage.get_progress_pct(len(self.missions))
        prog_str = f"76 HISTORICAL FLIGHTS // COMPLETED: {completed_count}/{len(self.missions)} ({pct}%)"
        surface.blit(self.font_sub.render(prog_str, True, COLOR_EMERALD), (28, 50))

        # 3. Controls
        for btn in self.filter_buttons:
            btn.draw(surface)
        self.btn_audio.draw(surface)

        # 4. Mission Cards
        filtered = self._get_filtered_missions()
        start = self.page * self.page_size
        page_missions = filtered[start:start + self.page_size]

        for i, mission in enumerate(page_missions):
            btn = self.card_buttons[i]
            btn.draw(surface)
            r = btn.rect

            # Draw card inner content
            completed = storage.is_completed(mission.id)
            type_label, type_col, discipline = TYPE_META.get(mission.game_type, ("MISSION", COLOR_CYAN, "FLIGHT"))

            # Card Header Bar
            pygame.draw.rect(surface, (15, 23, 42), (r.x, r.y, r.width, 30), border_radius=3)
            pygame.draw.line(surface, COLOR_PANEL_BORDER, (r.x, r.y + 30), (r.x + r.width, r.y + 30), 1)

            # Discipline tag
            surface.blit(self.font_tiny.render(f"[{discipline}]", True, type_col), (r.x + 12, r.y + 8))

            # Mission ID and Era Year (Placed cleanly in center to avoid overlap with FLOWN badge)
            meta_str = f"{mission.id} · {mission.year}"
            surface.blit(self.font_tiny.render(meta_str, True, COLOR_TEXT_DIM), (r.x + 175, r.y + 8))

            # Completion Checkmark
            if completed:
                pygame.draw.rect(surface, (6, 95, 70), (r.right - 76, r.y + 4, 66, 22), border_radius=2)
                surface.blit(self.font_tiny.render("FLOWN ✓", True, COLOR_EMERALD), (r.right - 69, r.y + 8))

            # Mission Name
            name_col = (255, 255, 255) if btn.hovered else COLOR_TEXT
            surface.blit(self.font_card_t.render(mission.name[:38], True, name_col), (r.x + 12, r.y + 38))

            # Program & Mission Type
            veh_str = f"PROGRAM: {mission.program} // TYPE: {mission.mission_type}"
            surface.blit(self.font_card_b.render(veh_str, True, COLOR_TEXT_DIM), (r.x + 12, r.y + 62))

            # Mission Objective Brief
            desc_snip = mission.objective[:72] + "..." if len(mission.objective) > 72 else mission.objective
            surface.blit(self.font_card_b.render(desc_snip, True, (160, 175, 195)), (r.x + 12, r.y + 82))

            # Difficulty tier badge
            diff_label = DIFFICULTY_LABELS.get(mission.difficulty, f"TIER {mission.difficulty}")
            surface.blit(self.font_tiny.render(f"RATING: {diff_label}", True, COLOR_GOLD), (r.x + 12, r.y + 116))

            # High Score if completed
            score = storage.scores.get(mission.id, 0)
            if score > 0:
                surface.blit(self.font_tiny.render(f"SCORE: {score} PTS", True, COLOR_EMERALD), (r.right - 130, r.y + 116))

        # 5. Pagination Bar
        total_pages = max(1, (len(filtered) - 1) // self.page_size + 1)
        page_str = f"PAGE {self.page + 1} OF {total_pages} // {len(filtered)} MANIFEST RECORDS"
        p_surf = self.font_sub.render(page_str, True, COLOR_TEXT_DIM)
        surface.blit(p_surf, (self.WIDTH // 2 - p_surf.get_width() // 2, 668))

        if self.page > 0:
            self.btn_prev.draw(surface)
        if self.page < total_pages - 1:
            self.btn_next.draw(surface)
