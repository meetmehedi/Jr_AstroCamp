"""
nasa_game/storage.py
Player progression and mission flight profile persistence.
Saves completed missions, badges, and high scores to a local JSON file.
"""
import json
from pathlib import Path
from typing import Dict, List, Set, Any

SAVE_DIR = Path(__file__).resolve().parent.parent / "saves"
SAVE_FILE = SAVE_DIR / "profile.json"

class ProfileStorage:
    def __init__(self):
        self.completed_missions: Set[str] = set()
        self.scores: Dict[str, int] = {}
        self.flight_hours: float = 0.0
        self.callsign: str = "Cadet Mysterio"
        self._load()

    def _load(self):
        if not SAVE_FILE.exists():
            return
        try:
            with open(SAVE_FILE, "r", encoding="utf-8") as f:
                data: Dict[str, Any] = json.load(f)
                self.completed_missions = set(data.get("completed_missions", []))
                self.scores = data.get("scores", {})
                self.flight_hours = float(data.get("flight_hours", 0.0))
                self.callsign = data.get("callsign", "Cadet Mysterio")
        except Exception as e:
            print(f"[ProfileStorage] Error loading profile: {e}")

    def save(self):
        SAVE_DIR.mkdir(parents=True, exist_ok=True)
        data = {
            "completed_missions": list(self.completed_missions),
            "scores": self.scores,
            "flight_hours": round(self.flight_hours, 2),
            "callsign": self.callsign,
        }
        try:
            with open(SAVE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[ProfileStorage] Error saving profile: {e}")

    def complete_mission(self, mission_id: str, score: int, duration_sec: float = 60.0):
        self.completed_missions.add(mission_id)
        current_best = self.scores.get(mission_id, 0)
        if score > current_best:
            self.scores[mission_id] = score
        self.flight_hours += duration_sec / 3600.0
        self.save()

    def is_completed(self, mission_id: str) -> bool:
        return mission_id in self.completed_missions

    def get_progress_pct(self, total_missions: int = 76) -> int:
        if total_missions <= 0:
            return 0
        return int((len(self.completed_missions) / total_missions) * 100)

    def mark_completed(self, mission_id: str, score: int, duration_sec: float = 60.0):
        """Alias for complete_mission (kid-friendly name)."""
        self.complete_mission(mission_id, score, duration_sec)

    def total_completed(self) -> int:
        """Return total number of completed missions."""
        return len(self.completed_missions)

storage = ProfileStorage()
