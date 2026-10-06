"""
nasa_game/scenes/briefing.py
NASA Astronaut Flight Readiness Briefing (FRR) Screen.
Features comprehensive vehicle specifications, flight rules, primary objectives,
and systems telemetry checklists before ignition.
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
    COLOR_PURPLE, COLOR_TEXT, COLOR_TEXT_DIM,
    draw_wrapped_text, draw_star_field, draw_hud_panel, get_font
)

TYPE_META = {
    'launch':    ((56, 189, 248),   "ORBITAL LAUNCH",       "Ascent Trajectory & Staging Insertion"),
    'docking':   ((168, 85, 247),  "ORBITAL DOCKING",      "Rendezvous, Proximity & Hard Capture"),
    'lander':    ((245, 158, 11),   "LUNAR LANDER",         "Powered Descent Initiation (PDI)"),
    'rover':     ((16, 185, 129),   "MARS SURFACE ROVER",   "Planetary Mobility & Sample Retrieval"),
    'telescope': ((249, 115, 22),   "DEEP SPACE OBSERVATORY","Astronomical Fine Guidance & Imaging"),
    'deepspace': ((236, 72, 153),   "INTERPLANETARY PROBE", "N-Body Gravity Assist & Escape"),
}

CONTROLS = {
    'launch':    [
        "[W / UP]     THROTTLE REGULATION (0-100%)",
        "[S / DOWN]   THROTTLE DAMPING",
        "[A / D]      GIMBAL PITCH ANGLE (GRAVITY TURN)",
        "[SPACE]      STAGE SEPARATION ADVISORY (MECO)",
    ],
    'docking':   [
        "[W A S D]    RCS MULTI-AXIS TRANSLATION",
        "[Q / E]      CLOSING VELOCITY (+ / - SPEED)",
        "[STATUS]     HOLD ALIGNMENT IN DOCKING CONE",
    ],
    'lander':    [
        "[W / UP]     MAIN DESCENT ENGINE THROTTLE",
        "[A / D]      RCS ATTITUDE STEERING (MAX ±12°)",
        "[LIMIT]      TOUCHDOWN SPEED < 2.5 M/S",
    ],
    'rover':     [
        "[W / S]      KINEMATIC DRIVE / REVERSE",
        "[A / D]      AZIMUTH HEADING STEERING",
        "[SPACE]      DRILL & CACHE SAMPLE CORES",
    ],
    'telescope': [
        "[WASD/MOUSE] POINT OPTICAL TELESCOPE APERTURE",
        "[TAB / F]    CYCLE SPECTRAL INFRARED FILTERS",
        "[TARGET]     INTEGRATE PHOTONS UNTIL 100%",
    ],
    'deepspace': [
        "[W A S D]    RCS COURSE CORRECTION BURNS",
        "[GRAVITY]    FLYBY PLANETS FOR HYPERBOLIC BOOST",
        "[OBJECTIVE]  REACH INTERSTELLAR HELIOPAUSE",
    ],
}

STEM_CURRICULUM = {
    'launch': (
        "AEROSPACE STEM: Orbital Mechanics & Tsiolkovsky Rocket Equation",
        "Multi-stage rockets overcome gravity/drag via a gravity turn to reach orbital velocity (~7.8 km/s).",
        "Δv = Isp · g₀ · ln(m₀/mf)   |   v_orbit = √(GM/r)"
    ),
    'docking': (
        "AEROSPACE STEM: Relative Orbital Dynamics & Proximity Capture",
        "Clohessy-Wiltshire rendezvous: firing thrusters changes both speed AND altitude simultaneously.",
        "F = m·a   |   Approach Rate < 0.5 m/s"
    ),
    'lander': (
        "AEROSPACE STEM: Terminal Powered Descent & Gravitational Braking",
        "Braking from orbital velocity to touchdown requires managing T/W ratio and fuel reserves precisely.",
        "v² = v₀² + 2a·d   |   Max Impact Speed < 2.5 m/s"
    ),
    'rover': (
        "AEROSPACE STEM: Planetary Mobility & Regolith Friction Coefficients",
        "Terrain gradient, wheel slip, and battery energy per meter govern safe planetary surface mobility.",
        "F_friction = μ·N   |   Safe Slope Angle < 25°"
    ),
    'telescope': (
        "AEROSPACE STEM: Astronomical Optics, Diffraction & Photon Integration",
        "Diffraction limits resolution; photon collection efficiency depends on aperture diameter and exposure time.",
        "Diffraction: θ = 1.22 · λ/D   |   Photon SNR = signal/√noise"
    ),
    'deepspace': (
        "AEROSPACE STEM: N-Body Gravity Assists & Hyperbolic Trajectories",
        "Gravitational slingshots provide free velocity boosts via the Oberth effect at planetary periapsis.",
        "Oberth: ΔE = m·v·Δv   |   v_∞ = √(v² − v_esc²)"
    ),
}

class BriefingScene:
    W, H = 1024, 720

    def __init__(self, mission: Mission, on_start_flight: Callable[[Mission], None],
                 on_back: Callable[[], None]):
        self.mission = mission
        self.on_start_flight = on_start_flight
        self.on_back = on_back
        self.t = 0.0

        self.stars = [
            (random.randint(0, self.W), random.randint(0, self.H),
             random.random(), random.uniform(0.6, 2.0))
            for _ in range(140)
        ]

        self.font_title    = get_font(20, bold=True, mono=True)
        self.font_heading  = get_font(13, bold=True, mono=True)
        self.font_body     = get_font(12, bold=False, mono=True)
        self.font_ctrl     = get_font(12, bold=True, mono=True)
        self.font_mono     = get_font(11, bold=True, mono=True)
        self.font_stem     = get_font(11, bold=True, mono=True)

        type_col, type_label, tagline = TYPE_META.get(
            mission.game_type, (COLOR_CYAN, 'FLIGHT MISSION', 'NASA Mission Flight Profile'))
        self.type_col = type_col

        self.btn_launch = Button(
            pygame.Rect(660, 640, 320, 52),
            "AUTHORIZE FLIGHT // GO FOR LAUNCH",
            on_click=self._launch,
            color=(255, 255, 255),
            bg_color=(6, 95, 70),
            font_size=13,
        )
        self.btn_back = Button(
            pygame.Rect(44, 640, 200, 52),
            "◄ RETURN TO MANIFEST",
            on_click=self._back,
            color=COLOR_TEXT_DIM,
            bg_color=(15, 23, 42),
            font_size=12,
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

        type_col, type_label, tagline = TYPE_META.get(
            self.mission.game_type, (COLOR_CYAN, 'FLIGHT MISSION', ''))

        # ── Header Banner ────────────────────────────────────────────────────
        draw_hud_panel(surface, pygame.Rect(12, 12, self.W - 24, 96), title="NASA FLIGHT READINESS REVIEW (FRR)")

        # Mission ID & Classification
        meta = f"MISSION ID: {self.mission.id} // PROGRAM: {self.mission.program.upper()} // YEAR: {self.mission.year} // STATUS: {self.mission.status.upper()}"
        surface.blit(self.font_mono.render(meta, True, COLOR_TEXT_DIM), (26, 32))

        # Mission Name
        surface.blit(self.font_title.render(self.mission.name.upper(), True, COLOR_CYAN), (26, 52))

        # Discipline and Tagline
        surface.blit(self.font_heading.render(f"DISCIPLINE: [{type_label}] - {tagline.upper()}", True, type_col), (26, 80))

        # ── Main Content Area (two columns + STEM box at bottom) ──────────────
        main_top = 118
        main_h   = 346  # shortened to make room for STEM box

        # Left Column: Primary Objectives & NASA Mission Archives
        draw_hud_panel(surface, pygame.Rect(24, main_top, 470, main_h), title="FLIGHT DIRECTIVE & OBJECTIVES")

        y = main_top + 28
        surface.blit(self.font_heading.render("PRIMARY MISSION OBJECTIVE:", True, COLOR_GOLD), (40, y)); y += 22
        y = draw_wrapped_text(surface, self.mission.objective, 40, y, 436, self.font_body, COLOR_TEXT, 5)

        y += 12
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (40, y), (480, y), 1); y += 12

        surface.blit(self.font_heading.render("HISTORICAL NASA FLIGHT CONTEXT:", True, COLOR_CYAN), (40, y)); y += 20
        proto = self.mission.protocol.replace("Manual Protocol:", "").strip()
        if len(proto) > 340:
            proto = proto[:337] + "..."
        draw_wrapped_text(surface, proto, 40, y, 436, self.font_body, (196, 181, 253), 5)

        # Right Column: Avionics & Flight Rules
        draw_hud_panel(surface, pygame.Rect(510, main_top, 490, main_h), title="AVIONICS & FLIGHT CONTROL RULES")

        ry = main_top + 28
        surface.blit(self.font_heading.render("COCKPIT FLIGHT CONTROLS:", True, COLOR_EMERALD), (526, ry)); ry += 24

        ctrl_lines = CONTROLS.get(self.mission.game_type, ["Standard telemetry controls."])
        for line in ctrl_lines:
            surface.blit(self.font_ctrl.render(line, True, COLOR_TEXT), (526, ry)); ry += 26

        ry += 12
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (526, ry), (980, ry), 1); ry += 14

        surface.blit(self.font_heading.render("VEHICLE & FLIGHT PARAMETERS:", True, type_col), (526, ry)); ry += 22

        params = self.mission.params
        param_font = get_font(12, bold=True, mono=True)
        if 'target_alt' in params:
            surface.blit(param_font.render(f"  TARGET ORBITAL ALTITUDE : {params['target_alt']:.0f} KM", True, COLOR_TEXT_DIM), (526, ry)); ry += 20
        if 'target_vel' in params:
            surface.blit(param_font.render(f"  TARGET ORBITAL VELOCITY : {params['target_vel']:.1f} KM/S", True, COLOR_TEXT_DIM), (526, ry)); ry += 20
        if 'fuel' in params:
            surface.blit(param_font.render(f"  PROPELLANT BUDGET       : {params['fuel']:.0f} UNITS", True, COLOR_TEXT_DIM), (526, ry)); ry += 20
        if 'time_limit' in params:
            surface.blit(param_font.render(f"  MAX TIMELINE WINDOW     : {params['time_limit']:.0f} SECONDS", True, COLOR_TEXT_DIM), (526, ry)); ry += 20
        if 'waypoints' in params:
            surface.blit(param_font.render(f"  SCIENTIFIC SAMPLE CORES : {int(params['waypoints'])} TARGETS", True, COLOR_TEXT_DIM), (526, ry)); ry += 20
        if 'targets' in params:
            surface.blit(param_font.render(f"  ASTRONOMICAL TARGETS    : {int(params['targets'])} OBJECTS", True, COLOR_TEXT_DIM), (526, ry)); ry += 20

        # High Score status
        if storage.is_completed(self.mission.id):
            best = storage.scores.get(self.mission.id, 0)
            ry += 10
            pygame.draw.rect(surface, (6, 95, 70), (526, ry, 456, 32), border_radius=2)
            surface.blit(self.font_heading.render(f"PERSONAL BEST: {best} PTS — MISSION ALREADY FLOWN ✓", True, COLOR_EMERALD), (538, ry + 8))

        # ── STEM CURRICULUM BOX (What the student will be taught) ────────────
        stem_top = main_top + main_h + 10
        stem_h = 108
        pygame.draw.rect(surface, (20, 10, 40), (24, stem_top, self.W - 48, stem_h), border_radius=4)
        pygame.draw.rect(surface, (139, 92, 246), (24, stem_top, self.W - 48, stem_h), 1, border_radius=4)

        stem = STEM_CURRICULUM.get(self.mission.game_type, (
            "AEROSPACE STEM: Engineering & Mission Planning",
            "Learn real NASA systems engineering: checklists, failure modes, and crew safety protocols.",
            "NASA SP-6105: Systems Engineering Handbook"
        ))

        # Purple accent bar on left
        pygame.draw.rect(surface, (139, 92, 246), (24, stem_top, 4, stem_h), border_radius=2)

        sx = 36
        sy = stem_top + 10

        # Label
        label_surf = self.font_stem.render("🎓  WHAT YOU WILL BE TAUGHT:", True, (192, 132, 252))
        surface.blit(label_surf, (sx, sy)); sy += 20

        # Concept title
        concept_surf = self.font_heading.render(stem[0], True, (255, 255, 255))
        surface.blit(concept_surf, (sx, sy)); sy += 20

        # Description
        desc = stem[1]
        if len(desc) > 130:
            desc = desc[:127] + "..."
        desc_surf = self.font_body.render(desc, True, (203, 213, 225))
        surface.blit(desc_surf, (sx, sy)); sy += 18

        # Formula
        formula_surf = self.font_stem.render(f"PHYSICAL FORMULA: {stem[2]}", True, (74, 222, 128))
        surface.blit(formula_surf, (sx, sy))

        # ── Buttons ──────────────────────────────────────────────────────────
        self.btn_back.draw(surface)
        self.btn_launch.draw(surface)

