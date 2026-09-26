"""
nasa_game/ui.py
Jr_AstroCamp UI System – vibrant, kid-friendly widgets.
Big buttons, bright colors, animated glow, progress bars.
"""
from typing import Callable, List, Optional, Tuple
import math
import pygame

# ── Jr_AstroCamp Vibrant Palette ─────────────────────────────────────────────
COLOR_BG          = (4, 9, 28)            # Deep cosmos navy
COLOR_PANEL       = (12, 22, 54)          # Panel dark blue
COLOR_PANEL_BORDER= (40, 68, 140)         # Electric blue border
COLOR_CYAN        = (0, 212, 255)         # Neon cyan
COLOR_GOLD        = (255, 210, 0)         # Bright gold / star yellow
COLOR_EMERALD     = (0, 230, 120)         # Go-green
COLOR_RED         = (255, 60, 60)         # Alert red
COLOR_ORANGE      = (255, 145, 0)         # Warning orange
COLOR_PURPLE      = (180, 80, 255)        # Rocket purple
COLOR_PINK        = (255, 80, 180)        # Fun pink highlight
COLOR_TEXT        = (230, 240, 255)       # Crisp white-blue
COLOR_TEXT_DIM    = (130, 155, 200)       # Muted text
COLOR_STAR        = (255, 248, 180)       # Warm star yellow


class Button:
    def __init__(
        self,
        rect: pygame.Rect,
        text: str,
        on_click: Optional[Callable[[], None]] = None,
        color: Tuple[int, int, int] = COLOR_CYAN,
        bg_color: Tuple[int, int, int] = (10, 30, 80),
        font_size: int = 18,
        emoji: str = "",
    ):
        self.rect = rect
        self.text = text
        self.emoji = emoji
        self.on_click = on_click
        self.color = color
        self.bg_color = bg_color
        self.font = pygame.font.SysFont("arial", font_size, bold=True)
        self.hovered = False
        self.enabled = True
        self._anim = 0.0      # glow animation time
        self._click_flash = 0.0

    def handle_event(self, event: pygame.event.Event) -> bool:
        if not self.enabled:
            return False
        if event.type == pygame.MOUSEMOTION:
            self.hovered = self.rect.collidepoint(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.rect.collidepoint(event.pos):
                self._click_flash = 0.25
                if self.on_click:
                    self.on_click()
                return True
        return False

    def update(self, dt: float):
        self._anim += dt
        if self._click_flash > 0:
            self._click_flash -= dt

    def draw(self, surface: pygame.Surface):
        glow = abs(math.sin(self._anim * 2.2)) * 0.35 + 0.65   # 0.65..1.0
        flash = self._click_flash > 0

        r, g, b = self.bg_color
        if self.hovered or flash:
            r = min(255, int(r + 40 + 60 * glow))
            g = min(255, int(g + 40 + 60 * glow))
            b = min(255, int(b + 60 + 80 * glow))
        fill = (r, g, b)

        # Rounded rect fill
        pygame.draw.rect(surface, fill, self.rect, border_radius=12)

        # Glow border
        bw = 3 if self.hovered else 2
        bcol = (
            min(255, int(self.color[0] * glow)),
            min(255, int(self.color[1] * glow)),
            min(255, int(self.color[2] * glow)),
        )
        pygame.draw.rect(surface, bcol, self.rect, width=bw, border_radius=12)

        # Text
        label = f"{self.emoji} {self.text}" if self.emoji else self.text
        txt_col = (255, 255, 255) if (self.hovered or flash) else self.color
        txt_surf = self.font.render(label, True, txt_col)
        txt_rect = txt_surf.get_rect(center=self.rect.center)
        surface.blit(txt_surf, txt_rect)


def draw_gauge(
    surface: pygame.Surface,
    x: int,
    y: int,
    width: int,
    height: int,
    val_or_fraction: float,
    max_val_or_label,
    label_or_color=None,
    color: Tuple[int, int, int] = COLOR_CYAN,
):
    if isinstance(max_val_or_label, (int, float)):
        max_val = max_val_or_label
        fraction = (val_or_fraction / max_val) if max_val > 0 else 0.0
        label = str(label_or_color) if label_or_color is not None else ""
        fill_color = color
    else:
        fraction = val_or_fraction
        label = str(max_val_or_label)
        fill_color = label_or_color if label_or_color is not None else COLOR_CYAN

    fraction = max(0.0, min(1.0, float(fraction)))

    # Background track
    pygame.draw.rect(surface, (8, 18, 48), (x, y, width, height), border_radius=6)
    pygame.draw.rect(surface, COLOR_PANEL_BORDER, (x, y, width, height), 1, border_radius=6)

    # Filled segment with gradient feel (lighter tip)
    fill_w = int((width - 4) * fraction)
    if fill_w > 0:
        pygame.draw.rect(surface, fill_color, (x + 2, y + 2, fill_w, height - 4), border_radius=4)
        # Bright tip
        tip_w = min(8, fill_w)
        tip_col = tuple(min(255, c + 80) for c in fill_color)
        pygame.draw.rect(surface, tip_col,
                         (x + 2 + fill_w - tip_w, y + 2, tip_w, height - 4), border_radius=4)

    # Label
    font = pygame.font.SysFont("arial", max(10, height - 4), bold=True)
    txt_surf = font.render(label, True, COLOR_TEXT)
    surface.blit(txt_surf, (x + 8, y + (height - txt_surf.get_height()) // 2))


def draw_wrapped_text(
    surface: pygame.Surface,
    text: str,
    x: int,
    y: int,
    max_width: int,
    font: pygame.font.Font,
    color: Tuple[int, int, int] = COLOR_TEXT,
    line_spacing: int = 6,
) -> int:
    words = text.split(' ')
    lines: List[str] = []
    current_line: List[str] = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        w, _ = font.size(test_line)
        if w <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))

    curr_y = y
    for line in lines:
        surf = font.render(line, True, color)
        surface.blit(surf, (x, curr_y))
        curr_y += font.get_height() + line_spacing

    return curr_y


def draw_star_field(surface: pygame.Surface, stars: list, t: float):
    """Draw animated twinkling star field."""
    for sx, sy, sb, spd in stars:
        twinkle = abs(math.sin(t * spd + sb * 6.28)) * 0.6 + 0.4
        v = int(sb * 220 * twinkle)
        v = max(0, min(255, v))
        c = (v, v, min(255, v + 30))
        size = 1 if sb < 0.5 else 2
        pygame.draw.circle(surface, c, (sx, sy), size)


def draw_arrow_hint(surface: pygame.Surface, x: int, y: int, direction: str, t: float,
                    label: str = "", color: Tuple[int,int,int] = COLOR_GOLD):
    """Animated pulsing arrow hint for kid guidance."""
    pulse = abs(math.sin(t * 3.0)) * 0.4 + 0.6
    col = tuple(int(c * pulse) for c in color)

    font = pygame.font.SysFont("arial", 14, bold=True)
    if direction == "up":
        points = [(x, y-18), (x-12, y), (x-5, y), (x-5, y+14), (x+5, y+14), (x+5, y), (x+12, y)]
    elif direction == "down":
        points = [(x, y+18), (x-12, y), (x-5, y), (x-5, y-14), (x+5, y-14), (x+5, y), (x+12, y)]
    elif direction == "left":
        points = [(x-18, y), (x, y-12), (x, y-5), (x+14, y-5), (x+14, y+5), (x, y+5), (x, y+12)]
    else:  # right
        points = [(x+18, y), (x, y-12), (x, y-5), (x-14, y-5), (x-14, y+5), (x, y+5), (x, y+12)]

    pygame.draw.polygon(surface, col, points)
    if label:
        surf = font.render(label, True, col)
        if direction == "up":
            surface.blit(surf, (x - surf.get_width()//2, y + 20))
        elif direction == "down":
            surface.blit(surf, (x - surf.get_width()//2, y - 34))
        elif direction == "left":
            surface.blit(surf, (x + 24, y - surf.get_height()//2))
        else:
            surface.blit(surf, (x - surf.get_width() - 24, y - surf.get_height()//2))


def draw_kid_badge(surface: pygame.Surface, text: str, x: int, y: int,
                   color: Tuple[int,int,int] = COLOR_GOLD, font_size: int = 16):
    """Draw a glowing badge label."""
    font = pygame.font.SysFont("arial", font_size, bold=True)
    surf = font.render(text, True, color)
    w, h = surf.get_size()
    pad = 10
    bg = pygame.Surface((w + pad*2, h + pad), pygame.SRCALPHA)
    bg.fill((0, 0, 0, 0))
    pygame.draw.rect(bg, (*color, 40), (0, 0, w+pad*2, h+pad), border_radius=8)
    pygame.draw.rect(bg, (*color, 180), (0, 0, w+pad*2, h+pad), 2, border_radius=8)
    surface.blit(bg, (x - pad, y - pad//2))
    surface.blit(surf, (x, y))
