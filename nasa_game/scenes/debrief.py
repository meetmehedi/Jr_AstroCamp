"""
nasa_game/scenes/debrief.py
Jr_AstroCamp Post-Mission Debrief Screen.
Exciting, encouraging results screen with fireworks for success,
score breakdown, badges, and clear next-action buttons.
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
    Button, COLOR_BG, COLOR_CYAN, COLOR_GOLD, COLOR_EMERALD, COLOR_RED,
    COLOR_ORANGE, COLOR_PURPLE, COLOR_PINK, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_star_field,
)

SUCCESS_MESSAGES = [
    "🎉 AMAZING! You're a real astronaut!",
    "🌟 STELLAR PERFORMANCE, Junior Astronaut!",
    "🚀 OUT OF THIS WORLD! Mission accomplished!",
    "🏆 INCREDIBLE! NASA would be proud!",
    "⭐ SPECTACULAR! You nailed it!",
]
FAIL_MESSAGES = [
    "💪 Keep trying! Every astronaut trains hard!",
    "🔄 Great attempt! Real astronauts never give up!",
    "🌍 That's okay — try again and fly higher!",
    "🧑‍🚀 Astronauts learn from every flight!",
]

GRADE_LABELS = {
    (900, "🏆 S-RANK  · ASTRONAUT LEGEND"),
    (750, "🌟 A-RANK  · EXPERT PILOT"),
    (500, "⭐ B-RANK  · MISSION SUCCESS"),
    (250, "👍 C-RANK  · GOOD EFFORT"),
    (0,   "💪 D-RANK  · KEEP TRAINING"),
}


def get_grade(score: int) -> str:
    if score >= 900: return "🏆 S-RANK · ASTRONAUT LEGEND"
    if score >= 750: return "🌟 A-RANK · EXPERT PILOT"
    if score >= 500: return "⭐ B-RANK · MISSION SUCCESS"
    if score >= 250: return "👍 C-RANK · GOOD EFFORT"
    return "💪 D-RANK · KEEP TRAINING"


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

        # Save progress
        if success:
            storage.mark_completed(mission.id, score)

        # Stars + fireworks particles
        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.8, 2.2))
            for _ in range(160)
        ]
        self.particles = ParticleSystem()
        self._firework_timer = 0.0

        # Pick message
        import random as _rnd
        self.message = _rnd.choice(SUCCESS_MESSAGES if success else FAIL_MESSAGES)
        self.grade   = get_grade(score) if success else "💪 D-RANK · KEEP TRAINING"

        # Fonts
        self.font_huge  = pygame.font.SysFont("arial", 52, bold=True)
        self.font_large = pygame.font.SysFont("arial", 28, bold=True)
        self.font_med   = pygame.font.SysFont("arial", 18, bold=True)
        self.font_body  = pygame.font.SysFont("arial", 15)
        self.font_score = pygame.font.SysFont("arial", 42, bold=True)

        # Buttons
        btn_y = 588
        self.btn_replay = Button(
            pygame.Rect(54, btn_y, 250, 56),
            "🔄  PLAY AGAIN",
            on_click=lambda: self.on_replay(self.mission),
            color=COLOR_CYAN, bg_color=(5, 30, 80), font_size=18,
        )
        self.btn_next = Button(
            pygame.Rect(388, btn_y, 248, 56),
            "▶  NEXT MISSION",
            on_click=self.on_next if self.on_next else lambda: None,
            color=COLOR_EMERALD, bg_color=(5, 50, 20), font_size=18,
        )
        if not self.on_next:
            self.btn_next.enabled = False

        self.btn_map = Button(
            pygame.Rect(720, btn_y, 250, 56),
            "🗺  MISSION MAP",
            on_click=self.on_campaign,
            color=COLOR_GOLD, bg_color=(50, 30, 0), font_size=18,
        )

    def handle_event(self, event):
        self.btn_replay.handle_event(event)
        if self.on_next:
            self.btn_next.handle_event(event)
        self.btn_map.handle_event(event)

    def update(self, dt):
        self.t += dt
        self.particles.update(dt)
        self._firework_timer -= dt
        if self.success and self._firework_timer <= 0:
            # Burst fireworks periodically
            fx = random.randint(100, self.W - 100)
            fy = random.randint(80, self.H // 2)
            self.particles.emit_explosion(fx, fy, count=40)
            self._firework_timer = random.uniform(0.6, 1.8)

        self.btn_replay.update(dt)
        self.btn_next.update(dt)
        self.btn_map.update(dt)

    def draw(self, surface: pygame.Surface):
        # Background
        bg_col = (3, 18, 8) if self.success else (18, 4, 4)
        surface.fill(bg_col)
        draw_star_field(surface, self.stars, self.t)

        # Fireworks particles
        if self.success:
            self.particles.draw(surface, (0, 0))

        # ── BIG result text ───────────────────────────────────────────────
        result_col = COLOR_EMERALD if self.success else COLOR_RED
        result_text = "MISSION SUCCESS! 🎉" if self.success else "MISSION FAILED 💔"

        # Pulsing scale
        pulse = abs(math.sin(self.t * 2.5)) * 0.08 + 0.92
        huge_surf = self.font_huge.render(result_text, True, result_col)
        scaled = pygame.transform.rotozoom(huge_surf, 0, pulse)
        surface.blit(scaled, (self.W//2 - scaled.get_width()//2, 40))

        # Encouraging message
        msg_col = COLOR_GOLD if self.success else (255, 160, 80)
        msg_surf = self.font_large.render(self.message, True, msg_col)
        surface.blit(msg_surf, (self.W//2 - msg_surf.get_width()//2, 120))

        # Mission name
        name_surf = self.font_med.render(
            f"Mission: {self.mission.name}", True, COLOR_TEXT_DIM)
        surface.blit(name_surf, (self.W//2 - name_surf.get_width()//2, 162))

        # ── Score card ────────────────────────────────────────────────────
        card_rect = pygame.Rect(self.W//2 - 240, 196, 480, 186)
        card_col = (5, 40, 12) if self.success else (40, 5, 5)
        pygame.draw.rect(surface, card_col, card_rect, border_radius=16)
        pygame.draw.rect(surface, result_col, card_rect, 3, border_radius=16)

        # Score
        score_col = COLOR_GOLD if self.success else COLOR_RED
        score_surf = self.font_score.render(f"SCORE: {self.score:,} PTS", True, score_col)
        surface.blit(score_surf, (card_rect.centerx - score_surf.get_width()//2, card_rect.top + 18))

        # Grade
        grade_surf = self.font_med.render(self.grade, True, result_col)
        surface.blit(grade_surf, (card_rect.centerx - grade_surf.get_width()//2, card_rect.top + 82))

        # Best score badge
        best = storage.scores.get(self.mission.id, 0)
        best_surf = self.font_body.render(
            f"🏆 All-time Best Score: {best:,} PTS", True, COLOR_GOLD)
        surface.blit(best_surf, (card_rect.centerx - best_surf.get_width()//2, card_rect.top + 118))

        # ── Reason text ───────────────────────────────────────────────────
        reason_short = self.reason[:100] + ("…" if len(self.reason) > 100 else "")
        reason_surf = self.font_body.render(reason_short, True, (170, 185, 210))
        surface.blit(reason_surf, (self.W//2 - reason_surf.get_width()//2, 400))

        # ── Overall progress bar ──────────────────────────────────────────
        from nasa_game.catalog import load_missions
        total = 76
        try:
            total = len(load_missions())
        except Exception:
            pass
        completed = storage.total_completed()
        prog_frac = completed / max(1, total)

        prog_label = self.font_med.render(
            f"🌌 Jr_AstroCamp Progress: {completed} / {total} missions", True, COLOR_CYAN)
        surface.blit(prog_label, (self.W//2 - prog_label.get_width()//2, 430))

        bar_x, bar_y, bar_w, bar_h = self.W//2 - 300, 464, 600, 22
        pygame.draw.rect(surface, (10, 25, 60), (bar_x, bar_y, bar_w, bar_h), border_radius=8)
        fill_w = int(bar_w * prog_frac)
        if fill_w > 0:
            pygame.draw.rect(surface, COLOR_CYAN, (bar_x, bar_y, fill_w, bar_h), border_radius=8)
        pct_surf = self.font_body.render(f"{int(prog_frac*100)}% COMPLETE", True, COLOR_TEXT)
        surface.blit(pct_surf, (self.W//2 - pct_surf.get_width()//2, bar_y + 4))

        # ── Stars earned display ──────────────────────────────────────────
        earned_stars = min(3, (self.score // 334) + (1 if self.success else 0))
        star_str = "⭐" * earned_stars + "☆" * (3 - earned_stars)
        star_surf = self.font_large.render(star_str, True, COLOR_GOLD)
        surface.blit(star_surf, (self.W//2 - star_surf.get_width()//2, 500))

        # ── Bottom bar ────────────────────────────────────────────────────
        bot = pygame.Surface((self.W, 76), pygame.SRCALPHA)
        bot.fill((4, 12, 30, 220))
        surface.blit(bot, (0, 578))
        pygame.draw.line(surface, result_col, (0, 578), (self.W, 578), 2)

        self.btn_replay.draw(surface)
        if self.on_next:
            self.btn_next.draw(surface)
        self.btn_map.draw(surface)
