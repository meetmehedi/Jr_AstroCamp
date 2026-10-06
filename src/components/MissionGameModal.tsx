import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  Compass,
  Rocket,
  ShieldAlert,
  Info,
  ExternalLink,
  Bot,
  Eye,
  Layers,
  Box,
} from 'lucide-react';
import { MISSION_GAME_DATA, type MissionGameConfig } from '../game/missionGameData';
import { startPhaserMissionGame, destroyPhaserGame } from '../game/PhaserGameManager';
import { ThreeMissionSimulator } from './ThreeMissionSimulator';

interface MissionGameModalProps {
  missionId: string;
  onClose: () => void;
  onCompleteMission: (missionId: string, score: number) => void;
  onSelectNextMission?: (nextMissionId: string) => void;
  completedMissions: string[];
}

export const MissionGameModal: React.FC<MissionGameModalProps> = ({
  missionId,
  onClose,
  onCompleteMission,
  onSelectNextMission,
  completedMissions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);

  const [missionState, setMissionState] = useState<'briefing' | 'playing' | 'success' | 'failure'>('briefing');
  const [engineMode, setEngineMode] = useState<'3d' | '2d'>('3d');
  const [score, setScore] = useState<number>(0);
  const [failureReason, setFailureReason] = useState<string>('');
  const [showAstronautModel, setShowAstronautModel] = useState<boolean>(false);

  const missionIndex = MISSION_GAME_DATA.findIndex((m) => m.id === missionId);
  const mission: MissionGameConfig = MISSION_GAME_DATA[missionIndex] || MISSION_GAME_DATA[0];
  const nextMission: MissionGameConfig | undefined = MISSION_GAME_DATA[missionIndex + 1];

  const isAlreadyCompleted = completedMissions.includes(mission.id);

  // Clean up Phaser on unmount
  useEffect(() => {
    return () => {
      if (phaserGameRef.current) {
        destroyPhaserGame(phaserGameRef.current);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const launchSimulation = () => {
    setMissionState('playing');

    if (engineMode === '2d') {
      setTimeout(() => {
        if (!containerRef.current) return;
        if (phaserGameRef.current) {
          destroyPhaserGame(phaserGameRef.current);
          phaserGameRef.current = null;
        }
        containerRef.current.innerHTML = '';
        const game = startPhaserMissionGame(containerRef.current, mission, {
          onSuccess: (finalScore) => {
            setScore(finalScore);
            setMissionState('success');
            onCompleteMission(mission.id, finalScore);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          },
          onFailure: (reason) => {
            setFailureReason(reason);
            setMissionState('failure');
          },
        });
        phaserGameRef.current = game;
      }, 50);
    }
  };

  const handleRetry = () => {
    launchSimulation();
  };

  const handleNextMission = () => {
    if (nextMission && onSelectNextMission) {
      if (phaserGameRef.current) {
        destroyPhaserGame(phaserGameRef.current);
        phaserGameRef.current = null;
      }
      setMissionState('briefing');
      onSelectNextMission(nextMission.id);
    }
  };

  const getGameTypeIcon = () => {
    switch (mission.gameType) {
      case 'launch':
        return <Rocket className="w-5 h-5 text-emerald-400" />;
      case 'docking':
        return <Compass className="w-5 h-5 text-sky-400" />;
      case 'lunar_landing':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'rover':
        return <Bot className="w-5 h-5 text-orange-400" />;
      case 'telescope':
        return <Eye className="w-5 h-5 text-purple-400" />;
      case 'deep_space':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getGameTypeLabel = () => {
    switch (mission.gameType) {
      case 'launch':
        return 'Rocket Launch & Ascent';
      case 'docking':
        return 'Orbital Rendezvous & Docking';
      case 'lunar_landing':
        return 'Planetary Surface Landing';
      case 'rover':
        return 'Surface Rover Teleoperation';
      case 'telescope':
        return 'Space Observatory Calibration';
      case 'deep_space':
        return 'Gravity-Assist Trajectory';
    }
  };

  const getStemLearningObjective = (gameType: string) => {
    switch (gameType) {
      case 'launch':
        return {
          concept: 'Orbital Mechanics & The Tsiolkovsky Rocket Equation',
          desc: 'Learn how multi-stage rockets overcome gravity and drag using gravity turns to reach orbital velocity (~7.8 km/s).',
          formula: 'Δv = Isp · g₀ · ln(m₀ / mf)  |  Orbital Speed: v_orb = √(GM/r)',
        };
      case 'docking':
        return {
          concept: 'Relative Orbital Dynamics & Proximity Capture',
          desc: 'Master relative velocity and Clohessy-Wiltshire rendezvous physics where firing thrusters changes both altitude and speed.',
          formula: 'F = m · a  |  Proximity Approach Rate < 0.5 m/s',
        };
      case 'lunar_landing':
        return {
          concept: 'Terminal Powered Descent & Gravitational Braking',
          desc: 'Balance thrust-to-weight ratios and propellant reserves to brake from orbital velocity to touchdown (<2.5 m/s).',
          formula: 'v² = v₀² + 2a·d  |  Impact Threshold < 2.5 m/s',
        };
      case 'rover':
        return {
          concept: 'Planetary Surface Mobility & Regolith Friction',
          desc: 'Navigate alien terrain gradients, calculate wheel slip friction coefficients, and budget battery power per meter traversed.',
          formula: 'F_friction = μ · N  |  Hazard Slope Angle < 25°',
        };
      case 'telescope':
        return {
          concept: 'Astronomical Optics, Diffraction & Photon Integration',
          desc: 'Stabilize optical apertures, eliminate jitter blur, and cycle spectral filters to capture faint photons from the deep cosmos.',
          formula: 'Diffraction Limit: θ = 1.22 · λ / D  |  Photon Exposure Ratio',
        };
      case 'deep_space':
        return {
          concept: 'N-Body Gravity Assists & Hyperbolic Trajectories',
          desc: 'Use gravitational slingshots from planets to gain hyperbolic excess velocity and escape toward the interstellar heliopause.',
          formula: 'Oberth Effect  |  Hyperbolic Excess: v_∞ = √(v² - v_esc²)',
        };
      default:
        return {
          concept: 'Aerospace Engineering & Telemetry Management',
          desc: 'NASA systems flight rules, attitude steering, and fail-safe mission recovery.',
          formula: 'NASA Systems Engineering Handbook (SP-6105)',
        };
    }
  };

  const stemData = getStemLearningObjective(mission.gameType);

  return (
    <div className="flight-modal-backdrop" onClick={onClose}>
      <div className="flight-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="flight-modal-header">
          <div className="flight-header-left">
            <div className="flight-type-badge-icon">
              {getGameTypeIcon()}
            </div>
            <div>
              <div className="flight-header-meta">
                <span>MISSION #{missionIndex + 1} OF 76 • {mission.year}</span>
                <span className="flight-program-pill">{mission.programName}</span>
                {isAlreadyCompleted && (
                  <span className="flight-completed-pill">
                    <CheckCircle2 size={12} /> Flown ✓
                  </span>
                )}
              </div>
              <h2 className="flight-mission-title">{mission.missionName}</h2>
            </div>
          </div>

          <div className="flight-header-actions">
            <button
              onClick={() => setShowAstronautModel(!showAstronautModel)}
              className="flight-astro-toggle-btn"
              title="Inspect 3D NASA Astronaut Suit"
            >
              <Bot size={14} />
              <span>{showAstronautModel ? 'Hide 3D Suit' : '3D EMU Suit'}</span>
            </button>
            <button
              onClick={() => {
                if (phaserGameRef.current) destroyPhaserGame(phaserGameRef.current);
                onClose();
              }}
              className="flight-close-btn"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 3D Astronaut Inspector Overlay (Optional Toggle) */}
        {showAstronautModel && (
          <div style={{ background: '#050811', borderBottom: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#818cf8' }}>
                <Bot size={15} />
                <span>NASA EXTRAVEHICULAR MOBILITY UNIT (EMU) 3D SPACESUIT VIEWER</span>
              </div>
              <a
                href="https://sketchfab.com/3d-models/rigged-nasa-astronaut-spacesuit-61acdd14e58a46149b2f85821f84260e"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Model Source <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ height: '240px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.4)', background: '#000' }}>
              <iframe
                title="Rigged NASA Astronaut Spacesuit"
                style={{ width: '100%', height: '100%', border: 0 }}
                src="https://sketchfab.com/models/61acdd14e58a46149b2f85821f84260e/embed?autostart=1&preload=1&ui_theme=dark"
                allow="autoplay; fullscreen; xr-spatial-tracking"
              />
            </div>
          </div>
        )}

        {/* Main Stage Content */}
        <div className="flight-stage-container">
          {/* 1. BRIEFING STATE */}
          {missionState === 'briefing' && (
            <div className="flight-briefing-wrap">
              {/* Flight Directive & Primary Objective */}
              <div className="flight-directive-panel">
                <div className="flight-directive-top">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} /> FLIGHT DIRECTIVE BRIEFING
                  </span>
                  <span>DISCIPLINE: {getGameTypeLabel().toUpperCase()}</span>
                </div>
                <p className="flight-directive-text">{mission.briefing}</p>
                <div className="flight-objective-box">
                  <strong>PRIMARY OBJECTIVE:</strong>
                  {mission.objective}
                </div>
              </div>

              {/* WHAT WILL BE TAUGHT (STEM CURRICULUM BOX) */}
              <div className="flight-stem-box">
                <div className="flight-stem-title">
                  <span>🎓 WHAT YOU WILL BE TAUGHT // AEROSPACE STEM CURRICULUM</span>
                </div>
                <div className="flight-stem-desc">
                  <strong style={{ color: '#ffffff' }}>{stemData.concept}: </strong>
                  {stemData.desc}
                </div>
                <div className="flight-stem-equation">
                  <strong>PHYSICAL LAW / PRINCIPLE: </strong>
                  {stemData.formula}
                </div>
              </div>

              {/* Grid: Controls & Telemetry Fact */}
              <div className="flight-grid-two">
                <div className="flight-info-card">
                  <div className="flight-card-label">COCKPIT FLIGHT CONTROLS</div>
                  <ul className="flight-controls-list">
                    <li>• <span>W / S or UP/DOWN</span>: Throttle Regulation</li>
                    <li>• <span>A / D or LEFT/RIGHT</span>: Gimbal Pitch / Steering</li>
                    <li>• <span>SPACEBAR</span>: Stage Separation / Booster MECO</li>
                  </ul>
                </div>

                <div className="flight-info-card">
                  <div className="flight-card-label">HISTORICAL TELEMETRY FACT</div>
                  <p className="flight-fact-text">
                    "{mission.funFact}"
                  </p>
                </div>
              </div>

              {/* Simulation Engine Toggle */}
              <div className="flight-engine-bar">
                <div className="flight-engine-label">
                  <Box size={16} />
                  <span>GRAPHICS ENGINE:</span>
                </div>
                <div className="flight-engine-btn-group">
                  <button
                    onClick={() => setEngineMode('3d')}
                    className={`flight-engine-btn ${engineMode === '3d' ? 'flight-engine-btn-active' : 'flight-engine-btn-inactive'}`}
                  >
                    <Sparkles size={13} /> 3D Photorealistic Engine (WebGL)
                  </button>
                  <button
                    onClick={() => setEngineMode('2d')}
                    className={`flight-engine-btn ${engineMode === '2d' ? 'flight-engine-btn-active' : 'flight-engine-btn-inactive'}`}
                  >
                    <Layers size={13} /> 2D Tactical Engine
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flight-launch-action">
                <button
                  onClick={launchSimulation}
                  className="flight-launch-btn"
                >
                  <Play size={18} fill="currentColor" />
                  LAUNCH 3D MISSION SIMULATION
                </button>
              </div>
            </div>
          )}

          {/* 2. PLAYING STATE */}
          {missionState === 'playing' && engineMode === '3d' && (
            <div style={{ width: '100%' }}>
              <ThreeMissionSimulator
                mission={mission}
                onSuccess={(finalScore) => {
                  setScore(finalScore);
                  setMissionState('success');
                  onCompleteMission(mission.id, finalScore);
                }}
                onFailure={(reason) => {
                  setFailureReason(reason);
                  setMissionState('failure');
                }}
                onExit={() => setMissionState('briefing')}
              />
            </div>
          )}

          {/* 2B. 2D Phaser Canvas Container */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '520px',
              maxWidth: '800px',
              display: missionState === 'playing' && engineMode === '2d' ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              border: '1px solid rgba(56,189,248,0.25)',
              background: '#020617',
            }}
          />

          {/* 3. SUCCESS STATE (DEBRIEF) */}
          {missionState === 'success' && (
            <div className="flight-debrief-card flight-debrief-success">
              <div className="flight-debrief-icon-circle icon-circle-success">
                <Award size={36} />
              </div>

              <div>
                <h3 className="flight-debrief-title">MISSION ACCOMPLISHED!</h3>
                <p className="flight-debrief-sub">
                  Flight telemetry verified for <strong style={{ color: '#6ee7b7' }}>{mission.missionName}</strong>
                </p>
              </div>

              <div className="flight-debrief-score-row">
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>FLIGHT SCORE</div>
                  <div className="flight-score-val">{score}</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>CAMPAIGN RANK</div>
                  <div className="flight-rank-val">
                    {completedMissions.length} / 76 FLIGHTS
                  </div>
                </div>
              </div>

              <div className="flight-stem-box" style={{ textAlign: 'left' }}>
                <div className="flight-stem-title">
                  <span>🎯 STEM LESSON MASTERED</span>
                </div>
                <div className="flight-stem-desc">
                  You successfully executed <strong style={{ color: '#ffffff' }}>{stemData.concept}</strong>.
                  All aerodynamic, propellant, and velocity bounds remained nominal.
                </div>
              </div>

              <div className="flight-debrief-btns">
                <button
                  onClick={handleRetry}
                  className="flight-replay-btn"
                >
                  <RotateCcw size={14} /> Replay
                </button>
                {nextMission ? (
                  <button
                    onClick={handleNextMission}
                    className="flight-next-btn"
                  >
                    Next Mission: {nextMission.missionName} <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flight-next-btn"
                  >
                    Return to Campaign Map
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. FAILURE STATE (DEBRIEF) */}
          {missionState === 'failure' && (
            <div className="flight-debrief-card flight-debrief-failure">
              <div className="flight-debrief-icon-circle icon-circle-failure">
                <ShieldAlert size={36} />
              </div>

              <div>
                <h3 className="flight-debrief-title" style={{ color: '#f87171' }}>SIMULATION ABORTED</h3>
                <p className="flight-debrief-sub" style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>
                  TELEMETRY ANOMALY DETECTED
                </p>
              </div>

              <div className="flight-incident-box">
                <div className="flight-incident-label">
                  <AlertTriangle size={14} />
                  <span>FLIGHT LOG INCIDENT &amp; CAUSE</span>
                </div>
                <p className="flight-incident-desc">
                  {failureReason || 'Flight parameters exceeded safe aerospace operational envelopes.'}
                </p>
              </div>

              <div className="flight-stem-box" style={{ textAlign: 'left', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
                <div className="flight-stem-title" style={{ color: '#f87171' }}>
                  <span>🔬 PHYSICS ROOT-CAUSE TAKEAWAY</span>
                </div>
                <div className="flight-stem-desc">
                  Real mission teams fail, calibrate, and retry. Review your throttle and angle against <strong style={{ color: '#ffffff' }}>{stemData.concept}</strong>.
                </div>
              </div>

              <div className="flight-debrief-btns">
                <button
                  onClick={onClose}
                  className="flight-replay-btn"
                >
                  Exit to Catalog
                </button>
                <button
                  onClick={handleRetry}
                  className="flight-retry-red-btn"
                >
                  <RotateCcw size={14} />
                  Re-attempt Simulation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flight-footer-bar">
          <span>TEAM MYSTERIO • ASTRO CAMP NASA GAME ENGINE (PHASER 3 + THREE.JS)</span>
          <span>76 OPERATIONAL FLIGHTS • MERCURY TO ARTEMIS</span>
        </div>
      </div>
    </div>
  );
};
