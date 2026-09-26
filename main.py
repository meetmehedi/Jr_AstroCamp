"""
main.py
NASA Mission Flight Simulator: 76 Historical Playable Missions in Pygame.
Developed for NASA International Space Apps Challenge 2026 by Team Mysterio.
"""
import sys
import pygame
from typing import Optional

from nasa_game.catalog import load_missions, Mission
from nasa_game.scenes.campaign import CampaignScene
from nasa_game.scenes.briefing import BriefingScene
from nasa_game.scenes.launch_scene import LaunchScene
from nasa_game.scenes.docking_scene import DockingScene
from nasa_game.scenes.lander_scene import LanderScene
from nasa_game.scenes.rover_scene import RoverScene
from nasa_game.scenes.telescope_scene import TelescopeScene
from nasa_game.scenes.deepspace_scene import DeepSpaceScene
from nasa_game.scenes.debrief import DebriefScene

class GameManager:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("NASA Mission Flight Simulator · Team Mysterio")
        self.screen = pygame.display.set_mode((1024, 720))
        self.clock = pygame.time.Clock()
        self.running = True

        # Load all 76 missions
        self.missions = load_missions()
        self.current_mission_idx = 0

        # State management
        self.current_scene = None
        self.switch_to_campaign()

    def switch_to_campaign(self):
        self.current_scene = CampaignScene(
            self.missions,
            on_select_mission=self.switch_to_briefing,
        )

    def switch_to_briefing(self, mission: Mission):
        # Update current mission index
        try:
            self.current_mission_idx = next(i for i, m in enumerate(self.missions) if m.id == mission.id)
        except StopIteration:
            self.current_mission_idx = 0

        self.current_scene = BriefingScene(
            mission,
            on_start_flight=self.launch_simulation,
            on_back=self.switch_to_campaign,
        )

    def launch_simulation(self, mission: Mission):
        def on_finish(success: bool, score: int, reason: str):
            self.switch_to_debrief(mission, success, score, reason)

        g_type = mission.game_type
        if g_type == 'launch':
            self.current_scene = LaunchScene(mission, on_finish)
        elif g_type == 'docking':
            self.current_scene = DockingScene(mission, on_finish)
        elif g_type == 'lander':
            self.current_scene = LanderScene(mission, on_finish)
        elif g_type == 'rover':
            self.current_scene = RoverScene(mission, on_finish)
        elif g_type == 'telescope':
            self.current_scene = TelescopeScene(mission, on_finish)
        elif g_type == 'deepspace':
            self.current_scene = DeepSpaceScene(mission, on_finish)
        else:
            self.current_scene = LaunchScene(mission, on_finish)

    def switch_to_debrief(self, mission: Mission, success: bool, score: int, reason: str):
        next_idx = self.current_mission_idx + 1
        has_next = next_idx < len(self.missions)

        def next_callback():
            if has_next:
                self.switch_to_briefing(self.missions[next_idx])

        self.current_scene = DebriefScene(
            mission=mission,
            success=success,
            score=score,
            reason=reason,
            on_replay=self.launch_simulation,
            on_next=next_callback if has_next else None,
            on_campaign=self.switch_to_campaign,
        )

    def run(self):
        while self.running:
            dt = self.clock.tick(60) / 1000.0

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        # Escape returns to campaign
                        if not isinstance(self.current_scene, CampaignScene):
                            self.switch_to_campaign()
                    elif event.key == pygame.K_F11:
                        # Toggle Fullscreen
                        is_fullscreen = bool(self.screen.get_flags() & pygame.FULLSCREEN)
                        if is_fullscreen:
                            self.screen = pygame.display.set_mode((1024, 720))
                        else:
                            self.screen = pygame.display.set_mode((1024, 720), pygame.FULLSCREEN)
                    else:
                        if self.current_scene and hasattr(self.current_scene, 'handle_event'):
                            self.current_scene.handle_event(event)
                else:
                    if self.current_scene and hasattr(self.current_scene, 'handle_event'):
                        self.current_scene.handle_event(event)

            if self.current_scene and hasattr(self.current_scene, 'update'):
                self.current_scene.update(dt)

            if self.current_scene and hasattr(self.current_scene, 'draw'):
                self.current_scene.draw(self.screen)

            pygame.display.flip()

        pygame.quit()
        sys.exit(0)

if __name__ == '__main__':
    game = GameManager()
    game.run()
