import React, { useState, useEffect, useRef } from 'react';
import { CURRICULUM_MODULES, type CurriculumModulePackage, type AudioLessonBeat } from '../data/curriculumNotesAudioVideo';
import { Play, Pause, RotateCcw, Volume2, Radio, Sparkles, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface AudioLessonPlayerViewProps {
  initialModuleId?: number;
  onLaunchMission?: (missionId: string) => void;
}

export const AudioLessonPlayerView: React.FC<AudioLessonPlayerViewProps> = ({
  initialModuleId = 1,
  onLaunchMission,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(initialModuleId);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeatIdx, setCurrentBeatIdx] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentModule: CurriculumModulePackage =
    CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];
  const { audio } = currentModule;
  const transcript = audio.storyBeats.transcript;

  // Stop audio on unmount or module switch
  useEffect(() => {
    stopPlayback();
    setCurrentBeatIdx(0);
    return () => {
      stopPlayback();
    };
  }, [selectedModuleId]);

  const stopPlayback = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const speakBeat = (beatIndex: number) => {
    if (!window.speechSynthesis || beatIndex >= transcript.length) {
      stopPlayback();
      return;
    }

    const beat: AudioLessonBeat = transcript[beatIndex];
    window.speechSynthesis.cancel();

    // Radio beep effect between speaker changes
    if (beat.speaker === 'CAPCOM') {
      soundFx.playClick(600);
    } else {
      soundFx.playTelemetryChirp();
    }

    const utterance = new SpeechSynthesisUtterance(beat.text);
    utterance.rate = playbackRate;
    
    // Character voice modulation
    const voices = window.speechSynthesis.getVoices();
    if (beat.speaker === 'CAPCOM') {
      utterance.pitch = 0.9; // Lower, authoritative radio tone
      const maleVoice = voices.find(v => v.name.includes('David') || v.name.includes('Alex') || v.name.includes('Daniel') || v.lang.startsWith('en'));
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      utterance.pitch = 1.35; // Bright, youthful cadet tone
      const femaleVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.lang.startsWith('en'));
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      if (beatIndex + 1 < transcript.length) {
        setCurrentBeatIdx(beatIndex + 1);
        speakBeat(beatIndex + 1);
      } else {
        stopPlayback();
        soundFx.playFlagPlant();
      }
    };

    utterance.onerror = () => {
      stopPlayback();
    };

    setCurrentBeatIdx(beatIndex);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      speakBeat(currentBeatIdx);
    }
  };

  const handleRestart = () => {
    stopPlayback();
    setCurrentBeatIdx(0);
    setTimeout(() => {
      speakBeat(0);
    }, 200);
  };

  const handleJumpToBeat = (index: number) => {
    stopPlayback();
    setCurrentBeatIdx(index);
    setTimeout(() => {
      speakBeat(index);
    }, 150);
  };

  return (
    <div className="audio-lesson-wrapper">
      {/* ── TOP MODULE SELECTOR BAR ────────────────────────────────────────── */}
      <div className="audio-module-pills">
        {CURRICULUM_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setSelectedModuleId(mod.id)}
            className={`audio-pill-btn ${mod.id === selectedModuleId ? 'active' : ''}`}
            style={{
              borderColor: mod.id === selectedModuleId ? mod.themeColor : 'rgba(255,255,255,0.1)'
            }}
          >
            <span>Mod {mod.id}</span>
            <strong>{mod.name.split(':')[1]?.split('—')[0]?.trim()}</strong>
          </button>
        ))}
      </div>

      {/* ── MAIN AUDIO PLAYER DECK ─────────────────────────────────────────── */}
      <div className="audio-player-deck">
        <div className="audio-deck-header">
          <div className="audio-deck-badge" style={{ background: currentModule.themeColor }}>
            <Radio size={14} /> AUDIO EPISODE #{currentModule.id}
          </div>
          <span className="audio-deck-duration">⏱️ {audio.duration} Lesson</span>
        </div>

        <h3 className="audio-deck-title">{audio.title}</h3>

        {/* 20-Second Narrative Hook */}
        <div className="audio-deck-hook">
          <span className="audio-hook-tag">MISSION HOOK:</span>
          "{audio.hook}"
        </div>

        {/* Character Voice Indicator Badges */}
        <div className="audio-speakers-legend">
          <div className="audio-speaker-pill capcom">
            <span>📡</span>
            <div>
              <strong>Houston CapCom</strong>
              <small>Flight Operations Director</small>
            </div>
          </div>
          <div className="audio-speaker-pill cadet">
            <span>🧒</span>
            <div>
              <strong>Cadet Maya</strong>
              <small>Junior Flight Engineer</small>
            </div>
          </div>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="audio-controls-panel">
          <div className="audio-btns-row">
            <button
              onClick={handleTogglePlay}
              className={`audio-main-play-btn ${isPlaying ? 'playing' : ''}`}
              style={{ background: currentModule.themeColor }}
            >
              {isPlaying ? <Pause size={18} fill="#020617" /> : <Play size={18} fill="#020617" />}
              <span>{isPlaying ? 'Pause Audio Lesson' : 'Listen to Full Lesson'}</span>
            </button>

            <button onClick={handleRestart} className="audio-sec-btn" title="Restart Lesson from Beginning">
              <RotateCcw size={15} /> Restart
            </button>

            {/* Speed Selector */}
            <div className="audio-speed-selector">
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Speed:</span>
              {[1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    if (isPlaying) {
                      handleJumpToBeat(currentBeatIdx);
                    }
                  }}
                  className={`audio-speed-btn ${playbackRate === rate ? 'active' : ''}`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="audio-progress-bar-wrap">
            <div
              className="audio-progress-bar-fill"
              style={{
                width: `${((currentBeatIdx + 1) / transcript.length) * 100}%`,
                background: currentModule.themeColor
              }}
            />
          </div>
          <div className="audio-beat-counter">
            Beat {currentBeatIdx + 1} of {transcript.length} · {transcript[currentBeatIdx]?.timestamp || '00:00'}
          </div>
        </div>

        {/* Simulator Tie-in Challenge Banner */}
        <div className="audio-sim-challenge-card" style={{ borderColor: `${currentModule.themeColor}60` }}>
          <div className="audio-challenge-left">
            <Sparkles size={18} style={{ color: currentModule.themeColor }} />
            <div>
              <div className="audio-challenge-label">TRY THIS IN THE SIMULATOR</div>
              <strong className="audio-challenge-title">{audio.simChallenge.title}</strong>
              <p className="audio-challenge-desc">{audio.simChallenge.instruction}</p>
            </div>
          </div>

          {onLaunchMission && (
            <button
              onClick={() => onLaunchMission(`NASA-M00${selectedModuleId}`)}
              className="audio-challenge-launch-btn"
              style={{ background: currentModule.themeColor }}
            >
              <span>Launch Sim</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── ACCESSIBILITY READ-ALONG TRANSCRIPT ────────────────────────────── */}
      <div className="audio-transcript-section">
        <div className="audio-transcript-header">
          <FileText size={15} />
          <h4>Interactive Read-Along Transcript (Click any line to jump)</h4>
        </div>

        <div className="audio-transcript-list">
          {transcript.map((beat, idx) => {
            const isCurrent = currentBeatIdx === idx;
            const isCapCom = beat.speaker === 'CAPCOM';

            return (
              <div
                key={idx}
                onClick={() => handleJumpToBeat(idx)}
                className={`audio-transcript-row ${isCurrent ? 'active' : ''}`}
              >
                <div className="audio-row-time">{beat.timestamp}</div>
                <div className={`audio-row-speaker-badge ${isCapCom ? 'capcom' : 'cadet'}`}>
                  {isCapCom ? '📡 CAPCOM' : '🧒 MAYA'}
                </div>
                <div className="audio-row-text">
                  {beat.text}
                </div>
                {isCurrent && (
                  <div className="audio-row-playing-indicator">
                    <Volume2 size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lesson 20-Second Recap Box */}
        <div className="audio-recap-box">
          <CheckCircle2 size={16} style={{ color: '#43ffa0' }} />
          <div>
            <strong>20-Second Recap: </strong>
            <span>{audio.recap}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
