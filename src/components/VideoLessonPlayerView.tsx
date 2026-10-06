import React, { useState, useEffect } from 'react';
import { CURRICULUM_MODULES, type CurriculumModulePackage, type VideoLessonStep } from '../data/curriculumNotesAudioVideo';
import { Play, Pause, ChevronRight, ChevronLeft, Subtitles, Award, Sparkles, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface VideoLessonPlayerViewProps {
  initialModuleId?: number;
  onLaunchMission?: (missionId: string) => void;
}

export const VideoLessonPlayerView: React.FC<VideoLessonPlayerViewProps> = ({
  initialModuleId = 1,
  onLaunchMission,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(initialModuleId);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [userDecision, setUserDecision] = useState<string | null>(null);

  const currentModule: CurriculumModulePackage =
    CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];
  const { video } = currentModule;
  const currentStep: VideoLessonStep = video.steps[currentStepIdx] || video.steps[0];

  // Auto-advance through video steps if playing
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIdx < video.steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          soundFx.playFlagPlant();
        }
      }, 7000); // 7 seconds per video concept step
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIdx, video.steps.length]);

  const handleNextStep = () => {
    if (currentStepIdx < video.steps.length - 1) {
      setCurrentStepIdx((s) => s + 1);
      soundFx.playClick(700);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((s) => s - 1);
      soundFx.playClick(600);
    }
  };

  // Render animated graphic stage according to module and step
  const renderVideoStage = (step: VideoLessonStep) => {
    // Dynamic visual animation depending on module & step
    if (selectedModuleId === 1) {
      // Launch / Staging / Balloon demo
      return (
        <svg viewBox="0 0 600 300" className="video-canvas-stage">
          <defs>
            <linearGradient id="vSky1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#vSky1)" />
          {/* Earth Horizon */}
          <path d="M 0 240 Q 300 210 600 240 L 600 300 L 0 300 Z" fill="#0369a1" />
          
          {step.type === 'ANIMATION' ? (
            // Balloon Rocket Demo
            <g transform="translate(200, 100)">
              <ellipse cx="100" cy="50" rx="70" ry="38" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
              <polygon points="170,50 195,40 195,60" fill="#b91c1c" />
              <path d="M 195 45 Q 230 40 260 45" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <path d="M 195 55 Q 230 60 260 55" stroke="#93c5fd" strokeWidth="3" fill="none" />
              <line x1="20" y1="50" x2="550" y2="50" stroke="#94a3b8" strokeDasharray="6,4" />
              <text x="30" y="30" fill="#fef08a" fontSize="13" fontWeight="bold">ACTION & REACTION: GAS EXPULSION</text>
            </g>
          ) : (
            // Rocket Staging into Orbit
            <g transform="translate(270, 70) rotate(-30)">
              <polygon points="20,0 12,25 28,25" fill="#ef4444" />
              <rect x="12" y="25" width="16" height="50" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
              <polygon points="10,75 30,75 25,120 15,120" fill="#f59e0b" opacity="0.9" />
              {/* Dropping booster */}
              {step.stepNumber >= 3 && (
                <rect x="0" y="85" width="18" height="40" fill="#64748b" transform="rotate(25 0 85)" opacity="0.8" />
              )}
            </g>
          )}
        </svg>
      );
    }

    if (selectedModuleId === 2) {
      // Gemini 8 Docking & Spinning Demo
      return (
        <svg viewBox="0 0 600 300" className="video-canvas-stage">
          <rect width="100%" height="100%" fill="#020617" />
          <path d="M 0 230 Q 300 190 600 230 L 600 300 L 0 300 Z" fill="#0284c7" opacity="0.8" />
          {/* Agena Collar */}
          <g transform="translate(120, 110)">
            <rect x="0" y="20" width="120" height="40" fill="#94a3b8" stroke="#475569" strokeWidth="2" rx="4" />
            <polygon points="120,15 155,28 155,52 120,65" fill="#cbd5e1" stroke="#000" strokeWidth="2" />
          </g>
          {/* Gemini 8 Approaching or Spinning */}
          <g transform={`translate(310, 100) ${step.stepNumber >= 3 ? 'rotate(15)' : ''}`}>
            <polygon points="20,25 90,5 90,85 20,65" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <polygon points="90,5 150,0 150,90 90,85" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="110,0 120,-20 130,0" fill="#43ffa0" />
          </g>
          {/* Docking crosshairs reticle */}
          <circle cx="300" cy="140" r="45" fill="none" stroke="#43ffa0" strokeWidth="2" strokeDasharray="6,4" />
          <line x1="240" y1="140" x2="360" y2="140" stroke="#43ffa0" strokeWidth="1.5" />
          <line x1="300" y1="80" x2="300" y2="200" stroke="#43ffa0" strokeWidth="1.5" />
        </svg>
      );
    }

    if (selectedModuleId === 3) {
      // Apollo 11 Lunar Descent & 30-Second Pause
      return (
        <svg viewBox="0 0 600 300" className="video-canvas-stage">
          <rect width="100%" height="100%" fill="#000000" />
          <path d="M 0 210 Q 250 180 600 200 L 600 300 L 0 300 Z" fill="#475569" />
          {/* Craters */}
          <ellipse cx="120" cy="240" rx="45" ry="16" fill="#334155" />
          <ellipse cx="450" cy="230" rx="70" ry="22" fill="#1e293b" />
          {/* Lunar Module Eagle */}
          <g transform="translate(250, 60)">
            <polygon points="35,20 75,20 85,50 25,50" fill="#94a3b8" stroke="#000" strokeWidth="1.5" />
            <polygon points="25,50 85,50 95,78 15,78" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            <polygon points="45,78 65,78 55,115" fill="#fef08a" opacity="0.8" />
            <line x1="18" y1="78" x2="-5" y2="125" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="92" y1="78" x2="115" y2="125" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>
          {/* Glowing Fuel Margin HUD */}
          <g transform="translate(30, 30)">
            <rect x="0" y="0" width="160" height="55" fill="#0f172a" stroke="#ef4444" strokeWidth="2" rx="6" />
            <text x="12" y="22" fill="#f87171" fontSize="11" fontWeight="bold">HOVER FUEL REMAINING</text>
            <text x="12" y="44" fill="#fbbf24" fontSize="16" fontFamily="monospace" fontWeight="bold">00:30 SECONDS</text>
          </g>
        </svg>
      );
    }

    if (selectedModuleId === 4) {
      // Sojourner on Mars / Airbag Bounce
      return (
        <svg viewBox="0 0 600 300" className="video-canvas-stage">
          <defs>
            <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#marsSky)" />
          <path d="M 0 190 Q 300 170 600 190 L 600 300 L 0 300 Z" fill="#7c2d12" />
          {/* Rocks Yogi & Barnacle Bill */}
          <polygon points="120,210 150,185 180,215 160,230" fill="#451a03" />
          <polygon points="440,205 480,180 520,215 470,235" fill="#451a03" />
          {/* Sojourner Rover */}
          <g transform="translate(240, 150)">
            <rect x="20" y="20" width="80" height="30" fill="#0284c7" stroke="#000" strokeWidth="2" rx="2" />
            <rect x="25" y="45" width="70" height="25" fill="#d97706" rx="2" />
            <circle cx="30" cy="78" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="60" cy="80" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="90" cy="78" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            {/* Science Beam to Rock Yogi */}
            <line x1="95" y1="55" x2="140" y2="65" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" />
            <circle cx="140" cy="65" r="5" fill="#fbbf24" />
          </g>
        </svg>
      );
    }

    if (selectedModuleId === 5) {
      // Hubble Space Telescope Optical Repair
      return (
        <svg viewBox="0 0 600 300" className="video-canvas-stage">
          <rect width="100%" height="100%" fill="#020617" />
          <path d="M 0 240 Q 300 200 600 240 L 600 300 L 0 300 Z" fill="#0369a1" />
          {/* Hubble Body */}
          <g transform="translate(140, 70)">
            <rect x="0" y="30" width="160" height="55" fill="#cbd5e1" stroke="#334155" strokeWidth="2" rx="4" />
            <rect x="40" y="-30" width="22" height="60" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1.5" />
            <rect x="40" y="85" width="22" height="60" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
          {/* Canadarm & Astronaut with COSTAR */}
          <g transform="translate(360, 50)">
            <path d="M 0 200 Q 60 120 120 70" stroke="#f8fafc" strokeWidth="8" fill="none" />
            <circle cx="130" cy="65" r="16" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <rect x="150" y="60" width="50" height="60" fill="#3b82f6" rx="4" />
            <text x="155" y="85" fill="#fff" fontSize="8" fontWeight="bold">COSTAR</text>
          </g>
        </svg>
      );
    }

    // Default Module 6: Voyager Slingshot
    return (
      <svg viewBox="0 0 600 300" className="video-canvas-stage">
        <rect width="100%" height="100%" fill="#000000" />
        {/* Giant Jupiter */}
        <circle cx="180" cy="150" r="70" fill="#ea580c" />
        <ellipse cx="180" cy="130" rx="68" ry="14" fill="#c2410c" />
        <ellipse cx="180" cy="170" rx="68" ry="14" fill="#9a3412" />
        {/* Hyperbolic Slingshot Path */}
        <path d="M 30 250 Q 180 20 340 120 T 560 80" stroke="#43ffa0" strokeWidth="4" fill="none" strokeDasharray="6,4" />
        {/* Voyager Craft */}
        <g transform="translate(390, 110)">
          <ellipse cx="20" cy="20" rx="30" ry="14" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
          <circle cx="45" cy="35" r="12" fill="#eab308" />
        </g>
      </svg>
    );
  };

  return (
    <div className="video-lesson-wrapper">
      {/* ── TOP MODULE SELECTOR PILLS ──────────────────────────────────────── */}
      <div className="video-module-pills">
        {CURRICULUM_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              setSelectedModuleId(mod.id);
              setCurrentStepIdx(0);
              setUserDecision(null);
            }}
            className={`video-pill-btn ${mod.id === selectedModuleId ? 'active' : ''}`}
            style={{
              borderColor: mod.id === selectedModuleId ? mod.themeColor : 'rgba(255,255,255,0.1)'
            }}
          >
            <span>Mod {mod.id}</span>
            <strong>{mod.name.split(':')[1]?.split('—')[0]?.trim()}</strong>
          </button>
        ))}
      </div>

      {/* ── MAIN CINEMATIC VIDEO DECK ──────────────────────────────────────── */}
      <div className="video-player-deck">
        <div className="video-stage-container">
          {renderVideoStage(currentStep)}

          {/* Top Video Header HUD */}
          <div className="video-top-hud">
            <span className="video-step-badge" style={{ background: currentModule.themeColor }}>
              STEP {currentStep.stepNumber} / {video.steps.length}: {currentStep.type}
            </span>
            <div className="video-hud-meta">
              <span className="video-hud-time">⏱️ {video.duration}</span>
              <button
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                className={`video-cc-btn ${captionsEnabled ? 'active' : ''}`}
                title="Toggle Closed Captions Subtitles"
              >
                <Subtitles size={14} /> CC
              </button>
            </div>
          </div>

          {/* Interactive Decision Point for Apollo 11 (Step 3) */}
          {selectedModuleId === 3 && currentStep.stepNumber === 3 && (
            <div className="video-decision-overlay">
              <div className="video-decision-box">
                <HelpCircle size={22} style={{ color: '#fbbf24' }} />
                <h4>Decision Point: 30 Seconds of Fuel Left!</h4>
                <p>Do you touch down immediately in the West Crater boulder field, or fly over into unknown flat ground?</p>
                <div className="video-decision-options">
                  <button
                    onClick={() => setUserDecision('boulders')}
                    className={`decision-btn ${userDecision === 'boulders' ? 'selected error' : ''}`}
                  >
                    Land Now in Boulders (High Crash Risk)
                  </button>
                  <button
                    onClick={() => {
                      setUserDecision('flyover');
                      soundFx.playFlagPlant();
                    }}
                    className={`decision-btn ${userDecision === 'flyover' ? 'selected success' : ''}`}
                  >
                    Pitch Forward & Fly Past (Armstrong Choice!)
                  </button>
                </div>
                {userDecision === 'flyover' && (
                  <div className="decision-feedback success">
                    ✅ Historic Choice! Neil Armstrong flew past West Crater to find a smooth spot with under 40 seconds of fuel remaining.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Closed Captions Subtitles Box */}
          {captionsEnabled && (
            <div className="video-captions-overlay">
              <div className="video-caption-inner">
                <strong>{currentStep.title}: </strong>
                <span>{currentStep.caption}</span>
              </div>
            </div>
          )}
        </div>

        {/* Video Step Progress Bar & Controls */}
        <div className="video-timeline-controls">
          <button onClick={() => setIsPlaying(!isPlaying)} className="video-play-btn">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <div className="video-steps-timeline">
            {video.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentStepIdx(i);
                  soundFx.playClick(650);
                }}
                className={`video-timeline-step-btn ${currentStepIdx === i ? 'active' : ''} ${i < currentStepIdx ? 'completed' : ''}`}
              >
                <span>{st.stepNumber}</span>
                <small>{st.type}</small>
              </button>
            ))}
          </div>

          <div className="video-nav-arrows">
            <button onClick={handlePrevStep} disabled={currentStepIdx === 0} className="video-nav-arrow-btn">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextStep} disabled={currentStepIdx === video.steps.length - 1} className="video-nav-arrow-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Video Footer Credits & One-Line Challenge */}
        <div className="video-footer-meta">
          <div className="video-challenge-card" style={{ borderLeft: `4px solid ${currentModule.themeColor}` }}>
            <Sparkles size={16} style={{ color: currentModule.themeColor }} />
            <div>
              <strong>MISSION CHALLENGE: </strong>
              <span>{video.oneLineChallenge}</span>
            </div>
            {onLaunchMission && (
              <button
                onClick={() => onLaunchMission(`NASA-M00${selectedModuleId}`)}
                className="video-launch-btn"
                style={{ background: currentModule.themeColor }}
              >
                Test in Sim
              </button>
            )}
          </div>

          <div className="video-nasa-credit">
            <Award size={12} />
            <span>NASA Media Credit: {currentStep.nasaMediaCredit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
