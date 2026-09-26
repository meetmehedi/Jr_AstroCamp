import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ComicPanelData, SpeakerRole, IllustrationType } from '../types/game';
import { Volume2, VolumeX, ChevronRight, Maximize2, Minimize2, Radio } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { speechEngine } from '../utils/speechEngine';

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOREALISTIC ASSETS & SPEAKER METADATA
// ─────────────────────────────────────────────────────────────────────────────

const CHARACTER_PHOTOS: Record<SpeakerRole, {
  img: string;
  name: string;
  callsign: string;
  role: string;
  color: string;
  side: 'LEFT' | 'RIGHT';
  bio: string;
}> = {
  CADET_MAYA: {
    img: '/cinematic/maya.jpg',
    name: 'Cadet Maya',
    callsign: 'CALLSIGN: ASTRA-01',
    role: 'Junior Astronaut · EVA Specialist',
    color: '#38bdf8',
    side: 'LEFT',
    bio: 'BPM 78 · O2 98% · SUIT NOMINAL',
  },
  COMMANDER_DADU: {
    img: '/cinematic/commander.jpg',
    name: 'Commander Dadu',
    callsign: 'CALLSIGN: VANGUARD-LEAD',
    role: 'Veteran Flight Commander · Mission Lead',
    color: '#10b981',
    side: 'RIGHT',
    bio: 'BPM 68 · O2 96% · CORE STABLE',
  },
  HOUSTON_CAPCOM: {
    img: '/cinematic/capcom.jpg',
    name: 'CapCom · Houston',
    callsign: 'JSC FLIGHT CONTROL',
    role: 'NASA Flight Director · Deep Space Comms',
    color: '#f59e0b',
    side: 'RIGHT',
    bio: 'KU-BAND LINK: 296.8 MHz · DELAY 1.3s',
  },
  SYSTEM_AI: {
    img: '/cinematic/ai.jpg',
    name: 'Artemis Core AI',
    callsign: 'AEGIS-X QUANTUM CORE',
    role: 'Onboard Autonomous Life Support & Navigation',
    color: '#ef4444',
    side: 'LEFT',
    bio: 'QUANTUM STATE: OPTIMAL · TELEMETRY 100%',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOREALISTIC SPACE BACKGROUND ENGINE
// ─────────────────────────────────────────────────────────────────────────────

interface SpaceBackdropProps {
  type: IllustrationType;
  urgency: string;
}

const SpaceBackdrop: React.FC<SpaceBackdropProps> = ({ type, urgency }) => {
  const isCritical = urgency === 'CRITICAL';
  const isHigh = urgency === 'HIGH';

  // Determine photorealistic image source based on scenario
  let bgImage = '/cinematic/lunar_shackleton.jpg';
  if (type === 'SUN_FLARE' || type === 'LUNAR_NIGHT' || type === 'DUST_STORM') {
    bgImage = '/cinematic/gargantua.jpg';
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* 1. Photorealistic Base Plate with Slow Parallax Zoom */}
      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: isCritical
            ? 'contrast(1.25) saturate(1.2) brightness(0.95)'
            : 'contrast(1.15) brightness(1.02)',
          animation: 'interstellarDrift 28s ease-in-out infinite alternate',
          transformOrigin: 'center center',
        }}
      />

      {/* 2. Deep Space Contrast Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.1) 0%, rgba(3,7,18,0.7) 75%, rgba(0,0,0,0.95) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Anamorphic Blue Lens Flare Streak (Nolan Interstellar Style) */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '-20%',
          right: '-20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.05) 20%, rgba(56,189,248,0.85) 50%, rgba(147,197,253,0.9) 52%, rgba(56,189,248,0.05) 80%, transparent 100%)',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.8), 0 0 32px rgba(56, 189, 248, 0.4)',
          transform: 'rotate(-1.5deg)',
          pointerEvents: 'none',
          opacity: 0.75,
          animation: 'flareBreathe 6s ease-in-out infinite alternate',
        }}
      />

      {/* 4. Drifting Cosmic Micrometeoroid Particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, #fff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 60% 70%, #93c5fd, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 80% 20%, #fef08a, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 40% 80%, #fff, rgba(0,0,0,0)),
                            radial-gradient(2.5px 2.5px at 90% 65%, #67e8f9, rgba(0,0,0,0))`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 0.65,
          animation: 'dustDrift 18s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* 5. Emergency Red Klaxon Strobe for Critical Threats */}
      {(isCritical || isHigh) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isCritical
              ? 'radial-gradient(ellipse at center, transparent 35%, rgba(239, 68, 68, 0.35) 90%, rgba(185, 28, 28, 0.6) 100%)'
              : 'radial-gradient(ellipse at center, transparent 45%, rgba(245, 158, 11, 0.25) 90%, rgba(180, 83, 9, 0.4) 100%)',
            pointerEvents: 'none',
            animation: isCritical ? 'criticalKlaxon 1.4s ease-in-out infinite' : 'criticalKlaxon 2.4s ease-in-out infinite',
            zIndex: 6,
          }}
        />
      )}

      {/* 6. Cinematic Film Grain Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          opacity: 0.8,
          zIndex: 7,
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOREALISTIC ASTRONAUT HUD PORTRAIT
// ─────────────────────────────────────────────────────────────────────────────

interface AstronautCardProps {
  role: SpeakerRole;
  isTalking: boolean;
  size?: number;
}

const AstronautCard: React.FC<AstronautCardProps> = ({ role, isTalking, size = 110 }) => {
  const meta = CHARACTER_PHOTOS[role] ?? CHARACTER_PHOTOS.CADET_MAYA;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isTalking ? 'scale(1.05) translateY(-4px)' : 'scale(0.92)',
        opacity: isTalking ? 1 : 0.4,
        filter: isTalking ? 'none' : 'grayscale(0.6) brightness(0.65) blur(0.5px)',
      }}
    >
      {/* Portrait Ring Frame */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          padding: '4px',
          background: isTalking
            ? `radial-gradient(circle at 30% 30%, ${meta.color}, rgba(0,0,0,0.8))`
            : 'rgba(255,255,255,0.08)',
          boxShadow: isTalking
            ? `0 0 0 3px ${meta.color}44, 0 0 28px ${meta.color}66, 0 16px 40px rgba(0,0,0,0.9)`
            : '0 8px 24px rgba(0,0,0,0.7)',
        }}
      >
        {/* Real Photorealistic Astronaut Photo */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#070b14',
            position: 'relative',
          }}
        >
          <img
            src={meta.img}
            alt={meta.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: isTalking ? 'contrast(1.1) brightness(1.05)' : 'contrast(1.0)',
            }}
          />

          {/* Holographic Visor Scan Line */}
          {isTalking && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, transparent 45%, ${meta.color}33 50%, transparent 55%)`,
                animation: 'visorScan 2.2s linear infinite',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Live Audio Equalizer Waveform Badge */}
        {isTalking && (
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
              background: 'rgba(7, 11, 20, 0.92)',
              border: `1px solid ${meta.color}`,
              padding: '2px 6px',
              borderRadius: '10px',
              boxShadow: `0 0 10px ${meta.color}66`,
            }}
          >
            {[8, 14, 10, 16, 7].map((h, i) => (
              <span
                key={i}
                style={{
                  width: '2.5px',
                  height: `${h}px`,
                  backgroundColor: meta.color,
                  borderRadius: '1px',
                  animation: `equalizerPulse 0.4s ease-in-out infinite alternate ${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Holographic Callsign & Telemetry Tag */}
      <div
        style={{
          textAlign: 'center',
          background: 'rgba(3, 7, 18, 0.85)',
          padding: '3px 10px',
          borderRadius: '6px',
          border: `1px solid ${isTalking ? meta.color + '66' : 'rgba(255,255,255,0.06)'}`,
          backdropFilter: 'blur(8px)',
          maxWidth: '140px',
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isTalking ? meta.color : '#94a3b8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {meta.name}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '7.5px',
            letterSpacing: '0.06em',
            color: isTalking ? '#e2e8f0' : '#475569',
            marginTop: '1px',
            whiteSpace: 'nowrap',
          }}
        >
          {meta.bio}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CINEMATIC SCENE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface CinematicSceneProps {
  panels: ComicPanelData[];
  urgency?: 'INFO' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

export const CinematicScene: React.FC<CinematicSceneProps> = ({
  panels,
  urgency = 'INFO',
  isTheaterMode = false,
  onToggleTheaterMode,
}) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const [, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charRef = useRef(0);

  const panel = panels[Math.min(idx, panels.length - 1)];
  const currentSpeaker = panel?.speaker ?? 'CADET_MAYA';
  const meta = CHARACTER_PHOTOS[currentSpeaker];
  const urgencyColor = {
    INFO: '#38bdf8',
    MODERATE: '#fbbf24',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  }[urgency];

  // Reset index when panels change
  useEffect(() => {
    setIdx(0);
  }, [panels]);

  // Typewriter effect with procedural radio chirp
  const typewrite = useCallback((fullText: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    charRef.current = 0;
    setText('');
    setTyping(true);

    soundFx.playRadioChirp();

    const tick = () => {
      charRef.current += 1;
      setText(fullText.slice(0, charRef.current));
      if (charRef.current < fullText.length) {
        timerRef.current = setTimeout(tick, 18);
      } else {
        setTyping(false);
      }
    };
    timerRef.current = setTimeout(tick, 60);
  }, []);

  const playVoice = useCallback((dialogueText: string, role: SpeakerRole) => {
    setIsSpeakingVoice(true);
    speechEngine.speak(
      dialogueText,
      role,
      () => setIsSpeakingVoice(false),
      () => setIsSpeakingVoice(false)
    );
  }, []);

  useEffect(() => {
    if (!panel) return;
    setTransitioning(true);
    const t = setTimeout(() => {
      setTransitioning(false);
      typewrite(panel.dialogue);
    }, 200);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx, panel?.dialogue, typewrite]);

  // Voice narration (triggered only after user interaction or click)
  useEffect(() => {
    if (!voiceOn || !panel || !hasUserInteracted) return;
    playVoice(panel.dialogue, currentSpeaker);
    return () => speechEngine.stop();
  }, [idx, panel?.dialogue, voiceOn, currentSpeaker, hasUserInteracted, playVoice]);

  const handleNext = () => {
    setHasUserInteracted(true);
    if (typing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setText(panel.dialogue);
      setTyping(false);
    } else if (idx < panels.length - 1) {
      soundFx.playClick(920);
      setIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setHasUserInteracted(true);
    if (idx > 0) {
      soundFx.playClick(680);
      setIdx((prev) => prev - 1);
    }
  };

  if (!panel) return null;

  // Determine left and right actors
  const leftRole: SpeakerRole = currentSpeaker === 'SYSTEM_AI' ? 'SYSTEM_AI' : 'CADET_MAYA';
  const rightRole: SpeakerRole = currentSpeaker === 'HOUSTON_CAPCOM' ? 'HOUSTON_CAPCOM' : 'COMMANDER_DADU';

  const isLeftActive = currentSpeaker === leftRole;
  const isRightActive = currentSpeaker === rightRole;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: isTheaterMode ? '16px' : '12px',
        overflow: 'hidden',
        background: '#030712',
        border: `1px solid ${urgencyColor}44`,
        boxShadow: `0 0 0 1px ${urgencyColor}22, 0 24px 64px rgba(0,0,0,0.92)`,
        marginBottom: '16px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ── CINEMATIC 2.39:1 VIEWPORT ── */}
      <div
        style={{
          position: 'relative',
          height: isTheaterMode ? '420px' : '280px',
          overflow: 'hidden',
          cursor: typing ? 'pointer' : 'default',
          transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={typing ? handleNext : undefined}
        title={typing ? 'Click to fast-forward text' : undefined}
      >
        {/* Real Space Background */}
        <SpaceBackdrop type={panel.illustrationType} urgency={urgency} />

        {/* Top 2.39:1 Cinematic Letterbox Bar & HUD Telemetry */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '32px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.4))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 10,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: urgencyColor,
                boxShadow: `0 0 8px ${urgencyColor}`,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9.5px',
                fontWeight: 700,
                color: urgencyColor,
                letterSpacing: '0.12em',
              }}
            >
              {urgency === 'CRITICAL'
                ? 'EMERGENCY PROTOCOL ALPHA'
                : urgency === 'HIGH'
                ? 'HIGH THREAT TELEMETRY'
                : urgency === 'MODERATE'
                ? 'CAUTION: ANOMALY DETECTED'
                : 'INTERSTELLAR LIVE FEED · NOMINAL'}
            </span>
          </div>

          {/* Telemetry timestamp & Theater Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                color: '#64748b',
                letterSpacing: '0.08em',
              }}
            >
              UTC 14:22:09 · LAT 89.9°S · ALT 1840m
            </span>

            {onToggleTheaterMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTheaterMode();
                  soundFx.playClick(800);
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  color: '#e2e8f0',
                  fontSize: '9px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.2s',
                }}
                title={isTheaterMode ? 'Exit Cinema Scope' : 'Expand Cinema Scope'}
              >
                {isTheaterMode ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                <span>{isTheaterMode ? 'EXIT THEATER' : 'THEATER MODE'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom 2.39:1 Letterbox Shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, rgba(3,7,18,0.98), transparent)',
            zIndex: 8,
            pointerEvents: 'none',
          }}
        />

        {/* Left Astronaut Actor */}
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            left: isTheaterMode ? '40px' : '20px',
            zIndex: 9,
          }}
        >
          <AstronautCard role={leftRole} isTalking={isLeftActive} size={isTheaterMode ? 120 : 96} />
        </div>

        {/* Right Astronaut Actor */}
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            right: isTheaterMode ? '40px' : '20px',
            zIndex: 9,
          }}
        >
          <AstronautCard role={rightRole} isTalking={isRightActive} size={isTheaterMode ? 120 : 96} />
        </div>
      </div>

      {/* ── INTERSTELLAR DIALOGUE & COMMS CONSOLE ── */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(7, 11, 20, 0.98) 0%, rgba(3, 7, 18, 1) 100%)',
          borderTop: `1px solid ${urgencyColor}33`,
          padding: '16px 20px',
          position: 'relative',
        }}
      >
        {/* Top Header of Comms Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8.5px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: `${meta.color}22`,
                color: meta.color,
                border: `1px solid ${meta.color}44`,
                letterSpacing: '0.08em',
              }}
            >
              {meta.callsign}
            </span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                color: '#f8fafc',
              }}
            >
              {meta.name}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>·</span>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
              {meta.role}
            </span>
          </div>

          {/* Voice and Audio Controls Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Direct Play / Transmit Voice Button */}
            <button
              onClick={() => {
                setHasUserInteracted(true);
                if (isSpeakingVoice) {
                  speechEngine.stop();
                  setIsSpeakingVoice(false);
                } else {
                  playVoice(panel.dialogue, currentSpeaker);
                }
              }}
              style={{
                background: isSpeakingVoice ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                border: `1.5px solid ${isSpeakingVoice ? '#ef4444' : '#38bdf8'}`,
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: isSpeakingVoice ? '#fca5a5' : '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                boxShadow: isSpeakingVoice ? '0 0 12px rgba(239, 68, 68, 0.4)' : '0 0 8px rgba(56, 189, 248, 0.2)',
                transition: 'all 0.2s',
              }}
              title="Transmit & Hear Voice Audio"
            >
              {isSpeakingVoice ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isSpeakingVoice ? 'STOPPING VOICE' : '▶ SPEAK VOICE'}</span>
            </button>

            <button
              onClick={() => {
                const next = !voiceOn;
                setVoiceOn(next);
                if (!next) {
                  speechEngine.stop();
                  setIsSpeakingVoice(false);
                } else {
                  playVoice(panel.dialogue, currentSpeaker);
                }
                soundFx.playClick(700);
              }}
              style={{
                background: voiceOn ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${voiceOn ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: 600,
                color: voiceOn ? '#38bdf8' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
              title="Toggle Audio Voice Readout"
            >
              {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{voiceOn ? 'AUTO VOICE ON' : 'AUTO VOICE OFF'}</span>
            </button>

            {/* Sequence dots */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {panels.map((_, i) => (
                <span
                  key={i}
                  onClick={() => {
                    setIdx(i);
                    soundFx.playClick(750);
                  }}
                  style={{
                    width: i === idx ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: i === idx ? meta.color : 'rgba(255,255,255,0.18)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dialogue Text with Typewriter & Blinking Terminal Cursor */}
        <div
          onClick={handleNext}
          style={{
            minHeight: '62px',
            fontSize: isTheaterMode ? '16px' : '14px',
            lineHeight: 1.6,
            color: '#f1f5f9',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.01em',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ color: meta.color, fontWeight: 700, marginRight: '6px' }}>“</span>
          <span>{text}</span>
          {typing && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '14px',
                backgroundColor: meta.color,
                marginLeft: '4px',
                verticalAlign: 'middle',
                animation: 'cursorBlink 0.7s infinite',
              }}
            />
          )}
          <span style={{ color: meta.color, fontWeight: 700, marginLeft: '6px' }}>”</span>
        </div>

        {/* Dialogue Navigation Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={12} className="text-slate-500" />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9.5px',
                color: '#64748b',
              }}
            >
              TRANSMISSION {idx + 1} OF {panels.length} · ENCRYPTED CHANNEL
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {idx > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                BACK
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                padding: '5px 16px',
                background: idx === panels.length - 1
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : `linear-gradient(90deg, ${meta.color}, #0284c7)`,
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 0 16px ${meta.color}55`,
                transition: 'transform 0.15s ease',
              }}
            >
              <span>{idx === panels.length - 1 ? 'PROCEED TO COMMAND ACTIONS' : 'NEXT TRANSMISSION'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
