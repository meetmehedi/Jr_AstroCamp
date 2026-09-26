"""
nasa_game/catalog.py
Loads, parses, and classifies all 76 NASA missions from nasa_missions_catalog.csv
into interactive simulation specifications.
"""
from dataclasses import dataclass, field
from pathlib import Path
import csv
from typing import Dict, List, Optional, Literal

GameType = Literal['launch', 'docking', 'lander', 'rover', 'telescope', 'deepspace']

@dataclass
class Mission:
    id: str
    program: str
    name: str
    year: str
    mission_type: str
    status: str
    objective: str
    protocol: str
    game_type: GameType
    difficulty: int  # 1 to 5
    era: str
    params: Dict[str, float] = field(default_factory=dict)

def determine_game_type(m_id: str, program: str, name: str, m_type: str, protocol: str) -> GameType:
    name_l = name.lower()
    prog_l = program.lower()
    proto_l = protocol.lower()

    # 1. Surface Rovers
    if any(k in name_l or k in proto_l for k in ['rover', 'curiosity', 'perseverance', 'sojourner', 'spirit', 'opportunity', 'pathfinder', 'viking']):
        return 'rover'

    # 2. Telescopes / Observatories
    if any(k in name_l or k in proto_l for k in ['telescope', 'hubble', 'webb', 'jwst', 'chandra', 'kepler', 'spitzer', 'roman', 'tess', 'observatory']):
        return 'telescope'

    # 3. Lunar & Planetary Landers
    if any(k in name_l or k in proto_l for k in ['lunar module', 'lunar landing', 'eagle', 'apollo 11', 'apollo 12', 'apollo 14', 'apollo 15', 'apollo 16', 'apollo 17', 'artemis iii', 'surveyor', 'lander', 'touchdown']):
        return 'lander'

    # 4. Docking & Orbital Rendezvous
    if any(k in proto_l or k in name_l for k in ['docking', 'rendezvous', 'station-keeping', 'iss assembly', 'mir', 'gemini 6a', 'gemini 8', 'gemini 12', 'sts-71', 'sts-88', 'dragon', 'starliner', 'cygnus']):
        return 'docking'

    # 5. Deep Space / Gravity Slingshots
    if any(k in name_l or k in proto_l for k in ['voyager', 'cassini', 'new horizons', 'pioneer', 'galileo', 'juno', 'flyby', 'interplanetary', 'gravity assist', 'heliopause', 'pluto', 'jupiter', 'saturn']):
        return 'deepspace'

    # Default to Launch & Ascent (e.g. Mercury, Apollo qualification, early test flights, shuttle launches)
    return 'launch'

def determine_era(program: str, year: str) -> str:
    p = program.lower()
    if 'mercury' in p or 'gemini' in p:
        return 'Early Spaceflight (1961–1966)'
    if 'apollo' in p or 'surveyor' in p or 'ranger' in p:
        return 'Lunar Race (1967–1975)'
    if 'shuttle' in p or 'sts' in p:
        return 'Space Shuttle Era (1981–2011)'
    if 'station' in p or 'iss' in p:
        return 'International Space Station'
    if 'mars' in p or 'rover' in p or 'viking' in p:
        return 'Mars Exploration'
    if 'observatory' in p or 'astrophysics' in p or 'hubble' in p or 'webb' in p:
        return 'Great Observatories'
    if 'outer planets' in p or 'voyager' in p or 'planetary' in p:
        return 'Interplanetary & Deep Space'
    if 'artemis' in p or 'commercial' in p:
        return 'Artemis & Commercial Era (2020+)'
    try:
        yr = int(year.split('-')[0].split('–')[0].strip())
        if yr < 1970:
            return 'Early Spaceflight (1961–1966)'
        elif yr < 1980:
            return 'Lunar Race (1967–1975)'
        elif yr < 2000:
            return 'Space Shuttle Era (1981–2011)'
        elif yr < 2020:
            return 'Modern Exploration'
        else:
            return 'Artemis & Commercial Era (2020+)'
    except Exception:
        return 'NASA Historic Programs'

def calculate_difficulty(year: str, game_type: GameType, mission_id: str) -> int:
    try:
        idx = int(mission_id.replace('NASA-M', ''))
        base = (idx % 5) + 1
    except Exception:
        base = 3
    if game_type in ['deepspace', 'lander']:
        base = min(5, base + 1)
    return max(1, min(5, base))

def build_mission_params(game_type: GameType, difficulty: int) -> Dict[str, float]:
    """
    Kid-friendly generous parameters for Jr_AstroCamp (ages 3–19).
    Easier fuel, longer time limits, bigger tolerance zones.
    Difficulty 1 = very easy (youngest kids), 5 = challenging (teens).
    """
    # Scale difficulty so d=1 feels VERY easy and d=5 is manageable
    d = difficulty  # 1..5

    if game_type == 'launch':
        return {
            'target_alt':   130.0 + d * 25.0,          # km  (155..255)
            'target_vel':   5.5 + d * 0.4,              # km/s (5.9..7.5) – easier target
            'fuel':         140.0 - d * 8.0,            # seconds (132..108) – MUCH more fuel
            'drag_coeff':   0.10 + d * 0.03,
            'has_staging':  1.0 if d >= 3 else 0.0,     # No staging for beginners
            'time_limit':   120.0 - d * 8.0,            # sec (112..80) – double original
        }
    elif game_type == 'docking':
        return {
            'distance':           200.0 + d * 40.0,     # meters (240..400)
            'max_approach_speed': max(0.8, 2.5 - d * 0.25),  # m/s – easier tolerance
            'tolerance_px':       max(30.0, 70.0 - d * 6.0), # bigger tolerance zone
            'fuel':               130.0 - d * 8.0,      # generous fuel
            'time_limit':         110.0 - d * 8.0,      # sec (102..70)
        }
    elif game_type == 'lander':
        return {
            'gravity':            1.62,                  # Always Moon gravity (easier)
            'fuel':               140.0 - d * 10.0,     # generous fuel (130..90)
            'max_touchdown_speed':max(2.5, 5.0 - d * 0.4),  # easier landing speed
            'zone_width':         max(120.0, 300.0 - d * 30.0),  # BIGGER landing zone
            'time_limit':         120.0 - d * 8.0,      # sec
        }
    elif game_type == 'rover':
        return {
            'waypoints':          min(5, 2 + d),        # fewer waypoints for beginners
            'hazard_density':     max(0.0, 0.06 + d * 0.04),  # fewer hazards
            'battery':            150.0 - d * 10.0,     # generous battery
            'sandstorm_chance':   max(0.0, 0.05 + d * 0.07),  # less frequent storms
            'time_limit':         120.0 - d * 8.0,
        }
    elif game_type == 'telescope':
        return {
            'targets':            min(5, 1 + d),        # fewer targets
            'lock_time':          max(0.8, 3.5 - d * 0.5),  # easier lock (shorter)
            'shimmer_amp':        max(1.0, 2.0 + d * 2.0),  # less shimmer at low difficulty
            'tolerance_radius':   max(30.0, 80.0 - d * 8.0),  # BIGGER tolerance
            'time_limit':         120.0 - d * 8.0,
        }
    elif game_type == 'deepspace':
        return {
            'planets':            min(3, d // 2 + 1),
            'required_assists':   1,                     # always just 1 assist needed
            'fuel':               130.0 - d * 8.0,
            'target_radius':      max(50.0, 100.0 - d * 8.0),  # BIGGER target zone
            'time_limit':         120.0 - d * 8.0,
        }
    return {}

def load_missions(csv_path: Optional[str] = None) -> List[Mission]:
    if csv_path is None:
        csv_path = str(Path(__file__).resolve().parent.parent / "nasa_missions_catalog.csv")

    missions: List[Mission] = []
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"NASA Catalog CSV not found at {csv_path}")

    with open(path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            m_id = row.get("Mission_ID", "").strip()
            if not m_id:
                continue

            prog = row.get("Program_Name", "").strip()
            name = row.get("Mission_Name", "").strip()
            year = row.get("Launch_Year", "").strip()
            m_type = row.get("Mission_Type", "").strip()
            status = row.get("Status", "").strip()
            obj = row.get("Primary_Objective", "").strip()
            proto = row.get("Operational_Guide_Summary", "").strip()

            g_type = determine_game_type(m_id, prog, name, m_type, proto)
            diff = calculate_difficulty(year, g_type, m_id)
            era = determine_era(prog, year)
            params = build_mission_params(g_type, diff)

            mission = Mission(
                id=m_id,
                program=prog,
                name=name,
                year=year,
                mission_type=m_type,
                status=status,
                objective=obj,
                protocol=proto,
                game_type=g_type,
                difficulty=diff,
                era=era,
                params=params,
            )
            missions.append(mission)

    return missions

if __name__ == '__main__':
    catalog = load_missions()
    print(f"Loaded {len(catalog)} missions from CSV.")
    types_count: Dict[str, int] = {}
    for m in catalog:
        types_count[m.game_type] = types_count.get(m.game_type, 0) + 1
    print("Missions breakdown by game type:")
    for k, v in types_count.items():
        print(f"  - {k}: {v} missions")
