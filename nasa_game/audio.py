"""
nasa_game/audio.py
Procedural Sound Synthesis Engine using Pygame Mixer and NumPy.
Generates retro NASA space telemetry audio, rocket rumble, Quindar beeps,
and thruster sound effects on-the-fly without external audio files.
"""
import math
import numpy as np
import pygame

class SoundEngine:
    def __init__(self):
        self.enabled = False
        self.muted = False
        self.sounds = {}
        try:
            pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=512)
            self.enabled = True
            self._generate_sounds()
        except Exception as e:
            print(f"[SoundEngine] Audio init warning (running in silent mode): {e}")

    def _generate_sounds(self):
        sample_rate = 44100

        # 1. Quindar Comms Beep (2524 Hz tone, 0.12s)
        dur = 0.12
        n_samples = int(sample_rate * dur)
        t = np.linspace(0, dur, n_samples, False)
        wave = 0.25 * np.sin(2 * np.pi * 2524 * t)
        env = np.linspace(1.0, 0.05, n_samples)
        wave = (wave * env * 32767).astype(np.int16)
        stereo = np.column_stack((wave, wave))
        self.sounds['quindar'] = pygame.sndarray.make_sound(stereo)

        # 2. UI Click / Blip
        dur = 0.05
        n_samples = int(sample_rate * dur)
        t = np.linspace(0, dur, n_samples, False)
        wave = 0.2 * np.sin(2 * np.pi * 880 * t)
        env = np.linspace(1.0, 0.01, n_samples)
        wave = (wave * env * 32767).astype(np.int16)
        stereo = np.column_stack((wave, wave))
        self.sounds['click'] = pygame.sndarray.make_sound(stereo)

        # 3. Thruster Burst / RCS Puff
        dur = 0.18
        n_samples = int(sample_rate * dur)
        t_thrust = np.linspace(0, dur, n_samples, False)
        noise = np.random.uniform(-0.35, 0.35, n_samples)
        env = np.exp(-t_thrust * 12.0)
        wave = (noise * env * 32767).astype(np.int16)
        stereo = np.column_stack((wave, wave))
        self.sounds['thruster'] = pygame.sndarray.make_sound(stereo)

        # 4. Critical Alarm Klaxon
        dur = 0.35
        n_samples = int(sample_rate * dur)
        t = np.linspace(0, dur, n_samples, False)
        freq = np.linspace(600, 950, n_samples)
        wave = 0.3 * np.sin(2 * np.pi * freq * t)
        wave = (wave * 32767).astype(np.int16)
        stereo = np.column_stack((wave, wave))
        self.sounds['alarm'] = pygame.sndarray.make_sound(stereo)

        # 5. Victory Chime / Mission Accomplished
        chime_samples = []
        notes = [523.25, 659.25, 783.99, 1046.50]  # C5, E5, G5, C6
        note_dur = 0.10
        n_n_samples = int(sample_rate * note_dur)
        t_note = np.linspace(0, note_dur, n_n_samples, False)
        for freq in notes:
            wave = 0.28 * np.sin(2 * np.pi * freq * t_note)
            env = np.linspace(1.0, 0.2, n_n_samples)
            chime_samples.extend(wave * env)
        chime_arr = (np.array(chime_samples) * 32767).astype(np.int16)
        stereo = np.column_stack((chime_arr, chime_arr))
        self.sounds['victory'] = pygame.sndarray.make_sound(stereo)

        # 6. Rocket Engine Rumble (continuous loop capability)
        dur = 1.0
        n_samples = int(sample_rate * dur)
        t = np.linspace(0, dur, n_samples, False)
        rumble = (
            0.2 * np.sin(2 * np.pi * 55 * t) +
            0.15 * np.sin(2 * np.pi * 85 * t) +
            0.12 * np.random.uniform(-0.2, 0.2, n_samples)
        )
        rumble = (rumble * 32767).astype(np.int16)
        stereo = np.column_stack((rumble, rumble))
        self.sounds['rocket'] = pygame.sndarray.make_sound(stereo)

    def play(self, sound_name: str, loop: int = 0):
        if not self.enabled or self.muted:
            return
        snd = self.sounds.get(sound_name)
        if snd:
            snd.play(loop)

    def stop(self, sound_name: str):
        if not self.enabled:
            return
        snd = self.sounds.get(sound_name)
        if snd:
            snd.stop()

    def toggle_mute(self) -> bool:
        self.muted = not self.muted
        if self.muted:
            pygame.mixer.stop()
        return self.muted

# Global singleton
sound_engine = SoundEngine()
