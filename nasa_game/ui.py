"""
nasa_game/ui.py
Authentic NASA Glass Cockpit & Mission Control Telemetry UI System.
High-precision Multi-Function Displays (MFDs), telemetry gauges,
attitude director indicators, and technical HUD brackets.
"""
from typing import Callable, List, Optional, Tuple, Union
import math
import pygame

# ── Authentic NASA Glass Cockpit & Telemetry Palette ─────────────────────────
COLOR_BG          = (6, 10, 18)           # Deep obsidian space black
COLOR_PANEL       = (11, 19, 32)          # Cockpit MFD slate dark
COLOR_PANEL_BORDER= (38, 56, 84)          # Beveled precision titanium border
COLOR_CYAN        = (56, 189, 248)        # Precision aerospace vector cyan
COLOR_GOLD        = (245, 158, 11)        # Master caution telemetry amber
COLOR_EMERALD     = (16, 185, 129)        # Nominal telemetry go-green
COLOR_RED         = (239, 68, 68)         # Master warning abort red
COLOR_ORANGE      = (249, 115, 22)        # Staging / thermal caution
COLOR_PURPLE      = (168, 85, 247)        # Deep space orbital node
COLOR_PINK        = (236, 72, 153)        # Target intercept vector
COLOR_TEXT        = (241, 245, 249)       # High-contrast flight readout white
COLOR_TEXT_DIM    = (148, 163, 184)       # Subdued avionics label gray
COLOR_STAR        = (255, 255, 255)       # High-luminosity point stars
COLOR_GRID        = (22, 36, 56)          # Radar & trajectory gridlines


def get_font(size: int, bold: bool = True, mono: bool = True) -> pygame.font.Font:
    """Helper to return high-legibility monospace or aerospace fonts across OS platforms."""
    font_names = ["consolas", "menlo", "dejavusansmono", "couriernew", "monospace"] if mono else ["sfprodisplay", "arial", "helvetica", "sans"]
    for name in font_names:
        try:
            f = pygame.font.SysFont(name, size, bold=bold)
            if f:
                return f
        except Exception:
            continue
    return pygame.font.SysFont("monospace", size, bold=bold)


class Button:
    """Sleek aerospace beveled Multi-Function Display (MFD) bezel button."""
    def __init__(
        self,
        rect: pygame.Rect,
        text: str,
        on_click: Optional[Callable[[], None]] = None,
        color: Tuple[int, int, int] = COLOR_CYAN,
        bg_color: Tuple[int, int, int] = (15, 23, 42),
        font_size: int = 15,
        emoji: str = "",
    ):
        self.rect = rect
        self.text = text
        self.emoji = emoji
        self.on_click = on_click
        self.color = color
        self.bg_color = bg_color
        self.font = get_font(font_size, bold=True, mono=True)
        self.hovered = False
        self.enabled = True
        self._anim = 0.0
        self._click_flash = 0.0

    def handle_event(self, event: pygame.event.Event) -> bool:
        if not self.enabled:
            return False
        if event.type == pygame.MOUSEMOTION:
            self.hovered = self.rect.collidepoint(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.rect.collidepoint(event.pos):
                self._click_flash = 0.2
                if self.on_click:
                    self.on_click()
                return True
        return False

    def update(self, dt: float):
        self._anim += dt
        if self._click_flash > 0:
            self._click_flash -= dt

    def draw(self, surface: pygame.Surface):
        flash = self._click_flash > 0
        r, g, b = self.bg_color
        if self.hovered or flash:
            r = min(255, r + 24)
            g = min(255, g + 32)
            b = min(255, b + 48)

        # MFD Bezel Frame
        pygame.draw.rect(surface, (r, g, b), self.rect, border_radius=4)
        
        # Precision Corner Reticles (Cockpit HUD aesthetic)
        border_col = self.color if (self.hovered or flash) else COLOR_PANEL_BORDER
        pygame.draw.rect(surface, border_col, self.rect, width=1, border_radius=4)

        # Status indicator LED tick on left edge
        led_col = self.color if (self.hovered or flash) else (40, 60, 85)
        pygame.draw.rect(surface, led_col, (self.rect.left + 3, self.rect.top + 4, 3, self.rect.height - 8), border_radius=1)

        # Text label
        label = f"{self.emoji} {self.text}".strip() if self.emoji else self.text
        txt_col = (255, 255, 255) if (self.hovered or flash) else self.color
        txt_surf = self.font.render(label, True, txt_col)
        txt_rect = txt_surf.get_rect(center=self.rect.center)
        surface.blit(txt_surf, txt_rect)


def draw_hud_panel(surface: pygame.Surface, rect: pygame.Rect, title: str = "", border_color: Tuple[int, int, int] = COLOR_PANEL_BORDER, fill_alpha: int = 210):
    """Draw a cockpit telemetry MFD panel with chamfered corner lines and title bar."""
    panel_surf = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
    panel_surf.fill((*COLOR_PANEL, fill_alpha))
    surface.blit(panel_surf, rect.topleft)

    # Clean technical borders
    pygame.draw.rect(surface, border_color, rect, width=1, border_radius=3)

    # Precision Corner Marks (L-brackets)
    c_len = 8
    x, y, w, h = rect.x, rect.y, rect.width, rect.height
    pygame.draw.lines(surface, border_color, False, [(x, y + c_len), (x, y), (x + c_len, y)], 2)
    pygame.draw.lines(surface, border_color, False, [(x + w - c_len, y), (x + w, y), (x + w, y + c_len)], 2)
    pygame.draw.lines(surface, border_color, False, [(x, y + h - c_len), (x, y + h), (x + c_len, y + h)], 2)
    pygame.draw.lines(surface, border_color, False, [(x + w - c_len, y + h), (x + w, y + h), (x + w, y + h - c_len)], 2)

    if title:
        font = get_font(11, bold=True, mono=True)
        t_surf = font.render(f"// {title.upper()} //", True, COLOR_TEXT_DIM)
        surface.blit(t_surf, (x + 10, y + 4))


def draw_gauge(
    surface: pygame.Surface,
    x: int,
    y: int,
    width: int,
    height: int,
    val_or_fraction: float,
    max_val_or_label: Union[float, int, str],
    label_or_color=None,
    color: Tuple[int, int, int] = COLOR_CYAN,
):
    """Cockpit Bar Gauge with segmented tick marks and numeric readouts."""
    if isinstance(max_val_or_label, (int, float)):
        max_val = float(max_val_or_label)
        fraction = (val_or_fraction / max_val) if max_val > 0 else 0.0
        label = str(label_or_color) if label_or_color is not None else ""
        fill_color = color
    else:
        fraction = float(val_or_fraction)
        label = str(max_val_or_label)
        fill_color = label_or_color if label_or_color is not None else COLOR_CYAN

    fraction = max(0.0, min(1.0, fraction))

    # Background Track
    pygame.draw.rect(surface, (10, 16, 26), (x, y, width, height), border_radius=2)
    pygame.draw.rect(surface, COLOR_PANEL_BORDER, (x, y, width, height), 1, border_radius=2)

    # Filled telemetry level
    fill_w = int((width - 4) * fraction)
    if fill_w > 0:
        pygame.draw.rect(surface, fill_color, (x + 2, y + 2, fill_w, height - 4), border_radius=1)

    # Segmented Tick Marks (Every 20%)
    for tick_i in range(1, 5):
        tx = x + int(width * (tick_i / 5.0))
        pygame.draw.line(surface, (50, 70, 95), (tx, y), (tx, y + height - 1), 1)

    # Monospace Text Readout
    font = get_font(max(10, height - 5), bold=True, mono=True)
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
    line_spacing: int = 5,
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
    """Draw authentic multi-magnitude realistic stellar field."""
    for sx, sy, sb, spd in stars:
        twinkle = abs(math.sin(t * spd + sb * 6.28)) * 0.4 + 0.6
        lum = int(sb * 230 * twinkle)
        lum = max(20, min(255, lum))
        c = (lum, lum, min(255, int(lum * 1.08)))
        size = 1 if sb < 0.75 else 2
        pygame.draw.circle(surface, c, (int(sx), int(sy)), size)


def draw_arrow_hint(surface: pygame.Surface, x: int, y: int, direction: str, t: float,
                    label: str = "", color: Tuple[int, int, int] = COLOR_GOLD):
    """Precision Flight Director / Trajectory guidance chevrons."""
    pulse = abs(math.sin(t * 3.5)) * 0.35 + 0.65
    col = tuple(int(c * pulse) for c in color)
    font = get_font(12, bold=True, mono=True)

    if direction == "up":
        pts = [(x, y - 14), (x - 8, y), (x - 4, y), (x - 4, y + 8), (x + 4, y + 8), (x + 4, y), (x + 8, y)]
    elif direction == "down":
        pts = [(x, y + 14), (x - 8, y), (x - 4, y), (x - 4, y - 8), (x + 4, y - 8), (x + 4, y), (x + 8, y)]
    elif direction == "left":
        pts = [(x - 14, y), (x, y - 8), (x, y - 4), (x + 8, y - 4), (x + 8, y + 4), (x, y + 4), (x, y + 8)]
    else:
        pts = [(x + 14, y), (x, y - 8), (x, y - 4), (x - 8, y - 4), (x - 8, y + 4), (x, y + 4), (x, y + 8)]

    pygame.draw.polygon(surface, col, pts)
    if label:
        surf = font.render(label, True, col)
        if direction == "up":
            surface.blit(surf, (x - surf.get_width() // 2, y + 14))
        elif direction == "down":
            surface.blit(surf, (x - surf.get_width() // 2, y - 26))
        elif direction == "left":
            surface.blit(surf, (x + 16, y - surf.get_height() // 2))
        else:
            surface.blit(surf, (x - surf.get_width() - 16, y - surf.get_height() // 2))


def draw_kid_badge(surface: pygame.Surface, text: str, x: int, y: int,
                   color: Tuple[int, int, int] = COLOR_GOLD, font_size: int = 14):
    """Draw a technical status badge / mission patch callout."""
    font = get_font(font_size, bold=True, mono=True)
    surf = font.render(text.upper(), True, color)
    w, h = surf.get_size()
    pad_x, pad_y = 8, 4
    
    bg = pygame.Surface((w + pad_x * 2, h + pad_y * 2), pygame.SRCALPHA)
    bg.fill((11, 19, 32, 220))
    pygame.draw.rect(bg, color, (0, 0, w + pad_x * 2, h + pad_y * 2), 1, border_radius=2)
    surface.blit(bg, (x - pad_x, y - pad_y))
    surface.blit(surf, (x, y))
