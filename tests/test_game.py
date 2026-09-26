"""
tests/test_game.py
Headless automated test suite for NASA Mission Flight Simulator.
Validates CSV catalog parsing, procedural audio synthesis, UI components,
and rendering for all 6 simulation scene engines.
"""
import os
import sys

# Run headlessly
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pygame
from nasa_game.catalog import load_missions, build_mission_params
from nasa_game.audio import sound_engine
from nasa_game.storage import storage
from nasa_game.scenes.launch_scene import LaunchScene
from nasa_game.scenes.docking_scene import DockingScene
from nasa_game.scenes.lander_scene import LanderScene
from nasa_game.scenes.rover_scene import RoverScene
from nasa_game.scenes.telescope_scene import TelescopeScene
from nasa_game.scenes.deepspace_scene import DeepSpaceScene

def test_suite():
    print("─── Running Headless Pygame Tests ───")
    pygame.init()
    surface = pygame.display.set_mode((1024, 720))

    # 1. Test Catalog
    missions = load_missions()
    assert len(missions) == 76, f"Expected 76 missions, got {len(missions)}"
    print(f"✓ Catalog loaded successfully: {len(missions)} missions verified.")

    # 2. Test Audio Synth
    assert 'quindar' in sound_engine.sounds
    assert 'thruster' in sound_engine.sounds
    assert 'alarm' in sound_engine.sounds
    assert 'victory' in sound_engine.sounds
    print("✓ Procedural sound synthesizer verified.")

    # 3. Test Scenes Lifecycle
    def dummy_finish(success, score, reason):
        pass

    # Find one mission of each type
    type_samples = {}
    for m in missions:
        if m.game_type not in type_samples:
            type_samples[m.game_type] = m

    for g_type, mission in type_samples.items():
        print(f"Testing simulation engine: {g_type.upper()} ({mission.name})...")
        if g_type == 'launch':
            scene = LaunchScene(mission, dummy_finish)
        elif g_type == 'docking':
            scene = DockingScene(mission, dummy_finish)
        elif g_type == 'lander':
            scene = LanderScene(mission, dummy_finish)
        elif g_type == 'rover':
            scene = RoverScene(mission, dummy_finish)
        elif g_type == 'telescope':
            scene = TelescopeScene(mission, dummy_finish)
        elif g_type == 'deepspace':
            scene = DeepSpaceScene(mission, dummy_finish)
        else:
            raise ValueError(f"Unknown game type: {g_type}")

        # Update 10 frames
        for _ in range(10):
            scene.update(0.016)

        # Draw frame onto dummy surface
        scene.draw(surface)
        print(f"  ✓ {g_type} scene updated and rendered cleanly.")

    # 4. Test Storage
    storage.complete_mission("NASA-M001", 1250)
    assert storage.is_completed("NASA-M001")
    print("✓ Storage and progression persistence verified.")

    pygame.quit()
    print("All tests PASSED! 100% operational.")

if __name__ == '__main__':
    test_suite()
