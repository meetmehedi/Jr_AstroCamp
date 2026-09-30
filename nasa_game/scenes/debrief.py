"""
nasa_game/scenes/debrief.py
NASA Post-Flight Mission Debrief & Evaluation Directorate.
Features telemetry score certification, flight failure root-cause analysis,
astronaut rating classification, and official flight log updates.
"""
import math
import random
from typing import Callable, Optional
import pygame
from nasa_game.catalog import Mission
from nasa_game.audio import sound_engine
from nasa_game.storage import storage
from nasa_game.graphics import ParticleSystem
from nasa_game.ui import (
    Button, COLOR_BG, COLOR_PANEL, COLOR_PANEL_BORDER, COLOR_CYAN, COLOR_GOLD,
    COLOR_EMERALD, COLOR_RED, COLOR_ORANGE, COLOR_PURPLE, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_star_field, draw_hud_panel, get_font
)

def get_performance_grade(score: int) -> str:
    if score >= 900: return "DISTINGUISHED FLIGHT COMMANDER // GRADE S"
    if score >= 750: return "SUPERIOR MISSION PERFORMANCE // GRADE A"
    if score >= 500: return "FLIGHT OBJECTIVES SATISFIED // GRADE B"
    if score >= 250: return "PARTIAL MISSION SUCCESS // GRADE C"
    return "OFF-NOMINAL PROFILE // RE-SIMULATION RECOMMENDED"

class DebriefScene:
    W, H = 1024, 720

    def __init__(
        self,
        mission: Mission,
        success: bool,
        score: int,
        reason: str,
        on_replay: Callable[[Mission], None],
        on_next: Optional[Callable[[], None]],
        on_campaign: Callable[[], None],
    ):
        self.mission = mission
        self.success = success
        self.score   = score
        self.reason  = reason
        self.on_replay   = on_replay
        self.on_next     = on_next
        self.on_campaign = on_campaign
        self.t = 0.0

        if success:
            storage.mark_completed(mission.id, score)

        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.6, 2.0))
            for _ in range(160)
        ]
        self.particles = ParticleSystem()
        self.grade = get_performance_grade(score) if success else "MISSION ABORT // PROFILE RE-RUN REQUIRED"

        # Fonts
        self.font_title  = get_font(24, bold=True, mono=True)
        self.font_large  = get_font(18, bold=True, mono=True)
        self.font_med    = get_font(14, bold=True, mono=True)
        self.font_body   = get_font(12, bold=False, mono=True)
        self.font_score  = get_font(32, bold=True, mono=True)

        btn_y = 620
        self.btn_replay = Button(
            pygame.Rect(44, btn_y, 240, 52),
            "↺ RE-SIMULATE FLIGHT",
            on_click=lambda: self.on_replay(self.mission),
            color=COLOR_CYAN,
            bg_color=(15, 23, 42),
            font_size=12,
        )
        self.btn_campaign = Button(
            pygame.Rect(304, btn_y, 250, 52),
            "◄ FLIGHT MANIFEST HUB",
            on_click=self.on_campaign,
            color=COLOR_TEXT_DIM,
            bg_color=(15, 23, 42),
            font_size=12,
        )

        if on_next:
            self.btn_next = Button(
                pygame.Rect(690, btn_y, 290, 52),
                "PROCEED TO NEXT MISSION ►",
                on_click=self.on_next,
                color=(255, 255, 255),
                bg_color=(6, 95, 70) if success else (30, 41, 59),
                font_size=12,
            )
        else:
            self.btn_next = None

    def handle_event(self, event):
        self.btn_replay.handle_event(event)
        self.btn_campaign.handle_event(event)
        if self.btn_next:
            self.btn_next.handle_event(event)

    def update(self, dt):
        self.t += dt
        self.particles.update(dt)
        self.btn_replay.update(dt)
        self.btn_campaign.update(dt)
        if self.btn_next:
            self.btn_next.update(dt)

    def draw(self, surface: pygame.Surface):
        surface.fill(COLOR_BG)
        draw_star_field(surface, self.stars, self.t)
        self.particles.draw(surface, (0, 0))

        # ── Header Panel ──────────────────────────────────────────────────────
        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 82), title="NASA FLIGHT OPERATIONS // POST-FLIGHT DEBRIEF")

        status_col = COLOR_EMERALD if self.success else COLOR_RED
        status_txt = "MISSION OUTCOME: SUCCESSFUL FLIGHT INSERTION" if self.success else "MISSION OUTCOME: OFF-NOMINAL ABORT"
        surface.blit(self.font_title.render(status_txt, True, status_col), (26, 30))

        sub_txt = f"VEHICLE: {self.mission.name.upper()} // RECORD ID: {self.mission.id} // PROGRAM: {self.mission.program.upper()}"
        surface.blit(self.font_body.render(sub_txt, True, COLOR_TEXT_DIM), (26, 60))

        # ── Main Debrief Box ──────────────────────────────────────────────────
        main_top = 104
        main_h   = 496
        draw_hud_panel(surface, pygame.Rect(24, main_top, self.W - 48, main_h), title="TELEMETRY PERFORMANCE & ROOT CAUSE EVALUATION")

        # Telemetry Score Certificate
        pygame.draw.rect(surface, (15, 23, 42), (48, main_top + 30, 420, 110), border_radius=2)
        pygame.draw.rect(surface, status_col, (48, main_top + 30, 420, 110), 1, border_radius=2)

        surface.blit(self.font_med.render("EVALUATED TELEMETRY SCORE:", True, COLOR_TEXT_DIM), (64, main_top + 42))
        surface.blit(self.font_score.render(f"{self.score} PTS", True, status_col), (64, main_top + 68))
        surface.blit(self.font_body.render(f"RATING: {self.grade}", True, COLOR_GOLD), (64, main_top + 112))

        # Flight Outcome Directive Reason
        pygame.draw.rect(surface, (15, 23, 42), (490, main_top + 30, 480, 110), border_radius=2)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (490, main_top + 30, 480, 110), 1, border_radius=2)

        surface.blit(self.font_med.render("FLIGHT DIRECTOR NARRATIVE:", True, COLOR_CYAN), (506, main_top + 42))
        clean_reason = self.reason.replace("🎉", "").replace("🚀", "").replace("✅", "").replace("💥", "").strip()
        from nasa_game.ui import draw_wrapped_text
        draw_wrapped_text(surface, clean_reason, 506, main_top + 68, 450, self.font_body, COLOR_TEXT, 5)

        # Historical Mission Debrief & Scientific Learnings
        dy = main_top + 160
        surface.blit(self.font_large.render("NASA HISTORICAL FLIGHT ARCHIVE & TAKEAWAYS:", True, COLOR_CYAN), (48, dy))
        dy += 28

        proto = self.mission.protocol.replace("Manual Protocol:", "").strip()
        draw_wrapped_text(surface, f"Historical Protocol: {proto}", 48, dy, 920, self.font_body, (203, 213, 225), 6)

        # Campaign Progress Record
        completed_count = storage.total_completed()
        best_score = storage.scores.get(self.mission.id, self.score)
        dy += 180
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (48, dy), (976, dy), 1)
        dy += 16

        prog_txt = f"TOTAL MISSIONS CERTIFIED: {completed_count}/76 ({storage.get_progress_pct(76)}%)  |  PERSONAL BEST ON THIS FLIGHT: {best_score} PTS"
        surface.blit(self.font_med.render(prog_txt, True, COLOR_EMERALD), (48, dy))

        # ── Bottom Action Buttons ─────────────────────────────────────────────
        self.btn_replay.draw(surface)
        self.btn_campaign.draw(surface)
        if self.btn_next:
            self.btn_next.draw(surface)
