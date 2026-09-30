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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
              {getGameTypeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 tracking-wider">
                  MISSION #{missionIndex + 1} OF 76 • {mission.year}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {mission.programName}
                </span>
                {isAlreadyCompleted && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{mission.missionName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAstronautModel(!showAstronautModel)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition"
              title="Inspect 3D NASA Astronaut Suit"
            >
              <Bot className="w-3.5 h-3.5" />
              {showAstronautModel ? 'Hide Astronaut' : '3D Astronaut'}
            </button>
            <button
              onClick={() => {
                if (phaserGameRef.current) destroyPhaserGame(phaserGameRef.current);
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Astronaut Inspector Overlay (Optional Toggle) */}
        {showAstronautModel && (
          <div className="bg-slate-950 border-b border-indigo-500/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                <Bot className="w-4 h-4" />
                <span>NASA EXTRAVEHICULAR MOBILITY UNIT (EMU) 3D VIEWER</span>
              </div>
              <a
                href="https://sketchfab.com/3d-models/rigged-nasa-astronaut-spacesuit-61acdd14e58a46149b2f85821f84260e"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1"
              >
                Model Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="h-64 w-full rounded-xl overflow-hidden border border-indigo-900/50 bg-black">
              <iframe
                title="Rigged NASA Astronaut Spacesuit"
                className="w-full h-full border-0"
                src="https://sketchfab.com/models/61acdd14e58a46149b2f85821f84260e/embed?autostart=1&preload=1&ui_theme=dark"
                allow="autoplay; fullscreen; xr-spatial-tracking"
              />
            </div>
          </div>
        )}

        {/* Main Stage Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-4 min-h-[500px]">
          {/* 1. BRIEFING STATE */}
          {missionState === 'briefing' && (
            <div className="w-full max-w-3xl space-y-6 text-slate-200">
              {/* Objective Card */}
              <div className="p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 shadow-inner space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> FLIGHT DIRECTIVE BRIEFING
                  </span>
                  <span>SIMULATION TYPE: {getGameTypeLabel().toUpperCase()}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{mission.briefing}</p>
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg">
                  <p className="text-xs text-cyan-200 font-medium">
                    <strong className="text-cyan-400">PRIMARY OBJECTIVE:</strong> {mission.objective}
                  </p>
                </div>
              </div>

              {/* Grid: Controls & Operational Spec */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 tracking-wider">FLIGHT CONTROLS</h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                    <li>• <span className="text-cyan-300">W / S or UP/DOWN</span>: Throttle Command</li>
                    <li>• <span className="text-cyan-300">A / D or LEFT/RIGHT</span>: Gimbal Pitch / Steering</li>
                    <li>• <span className="text-cyan-300">SPACEBAR</span>: Stage Separation / Booster MECO</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 tracking-wider">HISTORICAL TELEMETRY FACT</h4>
                  <p className="text-xs text-amber-300/90 leading-relaxed italic">
                    "{mission.funFact}"
                  </p>
                </div>
              </div>

              {/* Simulation Mode Toggle (3D Photorealistic WebGL vs 2D Tactical) */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-bold">GRAPHICS ENGINE:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEngineMode('3d')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                      engineMode === '3d'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> 3D Photorealistic Engine (WebGL)
                  </button>
                  <button
                    onClick={() => setEngineMode('2d')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                      engineMode === '2d'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> 2D Tactical Engine
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={launchSimulation}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wider rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 transform active:scale-95 transition text-sm"
                >
                  <Play className="w-5 h-5 fill-current" />
                  LAUNCH 3D MISSION SIMULATION
                </button>
              </div>
            </div>
          )}

          {/* 2. PLAYING STATE */}
          {missionState === 'playing' && engineMode === '3d' && (
            <div className="w-full">
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
            className={`w-full h-[520px] max-w-[800px] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-slate-800 ${
              missionState === 'playing' && engineMode === '2d' ? 'block' : 'hidden'
            }`}
          />

          {/* 3. SUCCESS STATE */}
          {missionState === 'success' && (
            <div className="w-full max-w-lg p-6 bg-slate-950/90 border border-emerald-500/40 rounded-2xl shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-wide">MISSION ACCOMPLISHED!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Flight telemetry verified for <strong className="text-emerald-300">{mission.missionName}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-around">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Flight Score</span>
                  <p className="text-2xl font-bold text-amber-400 font-mono">{score}</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Campaign Rank</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    {completedMissions.length} / 76 MISSIONS
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" /> Replay
                </button>
                {nextMission ? (
                  <button
                    onClick={handleNextMission}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition"
                  >
                    Next Mission: {nextMission.missionName} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
                  >
                    Return to Mission Hub
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. FAILURE STATE */}
          {missionState === 'failure' && (
            <div className="w-full max-w-lg p-6 bg-slate-950/90 border border-red-500/40 rounded-2xl shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">SIMULATION ABORTED</h3>
                <p className="text-xs text-red-300/80 font-mono mt-1">TELEMETRY ANOMALY DETECTED</p>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>FLIGHT LOG INCIDENT</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {failureReason || 'Flight parameters exceeded safe operational envelopes.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  Exit to Catalog
                </button>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/25 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-attempt Simulation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between flex-shrink-0">
          <span>TEAM MYSTERIO • ASTRO CAMP NASA GAME ENGINE (PHASER 3 + THREE.JS)</span>
          <span>REAL CSV MISSIONS: 76 OPERATIONAL FLIGHTS</span>
        </div>
      </div>
    </div>
  );
};
