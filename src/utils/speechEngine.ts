/**
 * speechEngine.ts
 * Professional, rock-solid Speech Synthesis Engine for Space Outpost Command.
 * Resolves Chrome/Safari autoplay policies, async voice loading, Chrome GC cutoff,
 * and includes Apollo Quindar radio comms audio synthesis.
 */

import { soundFx } from './audioEffects';

export type SpeakerRole = 'CADET_MAYA' | 'COMMANDER_DADU' | 'HOUSTON_CAPCOM' | 'SYSTEM_AI' | 'DEFAULT';

class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private keepAliveInterval: number | null = null;
  private voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
  }

  private initVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesReadyPromise) return this.voicesReadyPromise;

    this.voicesReadyPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return resolve([]);
      }

      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        this.voices = available;
        return resolve(available);
      }

      const onVoicesChanged = () => {
        const updated = window.speechSynthesis.getVoices();
        if (updated && updated.length > 0) {
          this.voices = updated;
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(updated);
        }
      };

      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

      // Fallback timer if voiceschanged does not trigger
      setTimeout(() => {
        this.voices = window.speechSynthesis.getVoices() || [];
        resolve(this.voices);
      }, 500);
    });

    return this.voicesReadyPromise;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking || this.currentUtterance !== null;
  }

  public stop() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Fallback
      }
    }
    this.currentUtterance = null;
  }

  /**
   * Speak text with character-specific pitch, rate, and voice profile
   */
  public async speak(
    text: string,
    role: SpeakerRole = 'DEFAULT',
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    // Always play authentic Apollo radio burst beep on transmission start
    soundFx.playRadioChirp();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Fallback sound if speech synthesis is not supported on this platform
      soundFx.playTelemetryChirp();
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    try {
      // Unfreeze Chrome speech synthesis if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Stop any running speech
      this.stop();

      // Ensure voices are ready
      const allVoices = this.voices.length > 0 ? this.voices : await this.initVoices();

      // Clean text of characters that trip up TTS engines
      const cleanText = text
        .replace(/["“”«»]/g, '')
        .replace(/--|—/g, ', ')
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Retain utterance in global set to prevent Chrome aggressive GC
      if (!(window as unknown as { __activeTTSSet: Set<SpeechSynthesisUtterance> }).__activeTTSSet) {
        (window as unknown as { __activeTTSSet: Set<SpeechSynthesisUtterance> }).__activeTTSSet = new Set();
      }
      (window as unknown as { __activeTTSSet: Set<SpeechSynthesisUtterance> }).__activeTTSSet.add(utterance);

      // Character Persona Pitch & Rate calibration
      const enPool = allVoices.filter((v) => v.lang.toLowerCase().startsWith('en'));
      const pool = enPool.length > 0 ? enPool : allVoices;

      if (role === 'CADET_MAYA') {
        utterance.rate = 1.05;
        utterance.pitch = 1.35;
        const femaleVoice = pool.find((v) =>
          /samantha|karen|victoria|zira|female|fiona|moira|tessa/i.test(v.name)
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (role === 'COMMANDER_DADU') {
        utterance.rate = 0.92;
        utterance.pitch = 0.88;
        const maleVoice = pool.find((v) =>
          /alex|daniel|fred|george|david|male|oliver|arthur/i.test(v.name)
        );
        if (maleVoice) utterance.voice = maleVoice;
      } else if (role === 'HOUSTON_CAPCOM') {
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        const capcomVoice = pool.find((v) =>
          /daniel|tom|alex|rishi|en-us/i.test(v.name)
        );
        if (capcomVoice) utterance.voice = capcomVoice;
      } else if (role === 'SYSTEM_AI') {
        utterance.rate = 0.88;
        utterance.pitch = 0.7;
        const robotVoice = pool.find((v) =>
          /fred|zarvox|trinoids|whisper|google|alva/i.test(v.name)
        );
        if (robotVoice) utterance.voice = robotVoice;
      } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      }

      // Cleanup helper
      const cleanup = () => {
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        }
        (window as unknown as { __activeTTSSet: Set<SpeechSynthesisUtterance> }).__activeTTSSet?.delete(utterance);
        this.currentUtterance = null;
      };

      utterance.onend = () => {
        cleanup();
        soundFx.playClick(600, 0.03); // End-of-transmission radio click
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        cleanup();
        if (e.error === 'interrupted' || e.error === 'canceled') {
          // Normal cancellation when user advances to next dialogue
          return;
        }
        if (e.error === 'not-allowed') {
          console.info('SpeechSynthesis waiting for user interaction gesture.');
          return;
        }
        console.warn('SpeechSynthesis error:', e.error || e);
        soundFx.playClick(440, 0.08);
        if (onError) onError();
        else if (onEnd) onEnd();
      };

      // Keepalive heartbeat for long sentences in Chrome (prevents 15-second cutoff)
      this.keepAliveInterval = window.setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          cleanup();
        }
      }, 10000);

      // Short delay after cancel before speak to avoid Chrome asynchronous cancel bug
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('speak() call failed:', err);
          cleanup();
          if (onError) onError();
        }
      }, 50);

    } catch (err) {
      console.warn('SpeechEngine general error:', err);
      soundFx.playTelemetryChirp();
      if (onError) onError();
    }
  }
}

export const speechEngine = new SpeechEngine();
