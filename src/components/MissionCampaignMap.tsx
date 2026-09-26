// ============================================================
// MissionCampaignMap — Interactive Earth-to-Space 76 Mission Campaign Map
// Visual timeline & mission selector spanning all eras of NASA history
// ============================================================
import React, { useState } from 'react';
import {
  Rocket,
  Compass,
  Sparkles,
  Bot,
  Eye,
  CheckCircle2,
  Play,
  Trophy,
  Star,
  Search,
} from 'lucide-react';
import { MISSION_GAME_DATA, type MissionGameConfig, type GameType } from '../game/missionGameData';

interface MissionCampaignMapProps {
  completedMissions: string[];
  onLaunchMission: (missionId: string) => void;
  onClose?: () => void;
}

export const MissionCampaignMap: React.FC<MissionCampaignMapProps> = ({
  completedMissions,
  onLaunchMission,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Group missions into historical eras
  const eras = [
    {
      id: 'mercury-gemini',
      title: 'Dawn of Spaceflight',
      subtitle: 'Mercury & Gemini (1961–1966)',
      filter: (m: MissionGameConfig) =>
        m.programName.includes('Mercury') || m.programName.includes('Gemini'),
    },
    {
      id: 'apollo',
      title: 'Voyage to the Moon',
      subtitle: 'Apollo & Lunar Exploration (1967–1975)',
      filter: (m: MissionGameConfig) =>
        m.programName.includes('Apollo') || m.programName.includes('Surveyor'),
    },
    {
      id: 'shuttle-iss',
      title: 'Orbital Outposts & Reusable Wings',
      subtitle: 'Space Shuttle & ISS (1981–2011)',
      filter: (m: MissionGameConfig) =>
        m.programName.includes('Shuttle') ||
        m.programName.includes('ISS') ||
        m.programName.includes('International Space Station') ||
        m.programName.includes('Space Transportation'),
    },
    {
      id: 'deep-space',
      title: 'Interplanetary Pioneers',
      subtitle: 'Voyager, Cassini, New Horizons & Outer Planets',
      filter: (m: MissionGameConfig) =>
        m.gameType === 'deep_space' ||
        m.programName.includes('Voyager') ||
        m.programName.includes('Pioneer') ||
        m.programName.includes('Outer Planets'),
    },
    {
      id: 'observatories',
      title: 'Cosmic Eyes & Exoplanet Hunters',
      subtitle: 'Hubble, JWST, Chandra, Kepler & Observatories',
      filter: (m: MissionGameConfig) =>
        m.gameType === 'telescope' ||
        m.programName.includes('Great Observatories') ||
        m.programName.includes('Astrophysics'),
    },
    {
      id: 'mars-rovers',
      title: 'Red Planet Explorers',
      subtitle: 'Viking, Pathfinder, Spirit, Curiosity & Perseverance',
      filter: (m: MissionGameConfig) =>
        m.gameType === 'rover' || m.programName.includes('Mars'),
    },
    {
      id: 'commercial-artemis',
      title: 'Next Generation & Artemis Return',
      subtitle: 'Commercial Crew, Moon to Mars (2020–Present)',
      filter: (m: MissionGameConfig) =>
        m.programName.includes('Artemis') ||
        m.programName.includes('Commercial') ||
        parseInt(m.year) >= 2020,
    },
  ];

  const getGameTypeIcon = (type: GameType) => {
    switch (type) {
      case 'launch':
        return <Rocket className="w-3.5 h-3.5 text-emerald-400" />;
      case 'docking':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'lunar_landing':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'rover':
        return <Bot className="w-3.5 h-3.5 text-orange-400" />;
      case 'telescope':
        return <Eye className="w-3.5 h-3.5 text-purple-400" />;
      case 'deep_space':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const filteredMissions = MISSION_GAME_DATA.filter((m) => {
    const matchesFilter =
      selectedTypeFilter === 'all' || m.gameType === selectedTypeFilter;
    const matchesSearch =
      m.missionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.year.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const completionPct = Math.round(
    (completedMissions.length / MISSION_GAME_DATA.length) * 100
  );

  return (
    <div className="w-full space-y-6">
      {/* Header Banner & Progress Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 tracking-wider">
                NASA HISTORICAL CAMPAIGN • 76 PLAYABLE MISSIONS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                1961 — PRESENT
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide mt-1">
              Earth to Deep Space Flight Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Play through every era of American space exploration using real flight parameters,
              trajectory mechanics, landing physics, and rover teleoperation.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white">
                  {completedMissions.length}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 76 COMPLETED</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {completionPct}% CAMPAIGN READINESS
              </span>
            </div>
          </div>
        </div>

        {/* Progress Fill Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/50"
            style={{ width: `${Math.max(2, completionPct)}%` }}
          />
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All (76)' },
              { id: 'launch', label: '🚀 Launch' },
              { id: 'docking', label: '🛸 Docking' },
              { id: 'lunar_landing', label: '🌑 Landing' },
              { id: 'rover', label: '🤖 Rover' },
              { id: 'telescope', label: '🔭 Telescope' },
              { id: 'deep_space', label: '☄️ Deep Space' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  selectedTypeFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Eras & Missions Grid */}
      <div className="space-y-8">
        {eras.map((era) => {
          const eraMissions = filteredMissions.filter(era.filter);
          if (eraMissions.length === 0) return null;

          return (
            <div key={era.id} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-base font-bold text-white tracking-wide">{era.title}</h3>
                <span className="text-xs font-mono text-slate-400">({era.subtitle})</span>
                <span className="ml-auto text-xs font-mono text-cyan-400">
                  {eraMissions.length} Missions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {eraMissions.map((mission) => {
                  const isDone = completedMissions.includes(mission.id);

                  return (
                    <div
                      key={mission.id}
                      className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                          : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90'
                      }`}
                    >
                      <div>
                        {/* Top row badges */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                            {getGameTypeIcon(mission.gameType)}
                            <span className="uppercase">{mission.gameType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-400">{mission.year}</span>
                            {isDone && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                        </div>

                        {/* Title & Program */}
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                          {mission.missionName}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                          {mission.programName}
                        </p>

                        {/* Briefing snippet */}
                        <p className="text-xs text-slate-400/90 line-clamp-2 mt-2 leading-relaxed">
                          {mission.objective}
                        </p>
                      </div>

                      {/* Bottom row: Difficulty + Play Button */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-0.5 text-amber-400" title={`Difficulty: ${mission.difficulty}/5`}>
                          {[...Array(5)].map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-2.5 h-2.5 ${
                                starIdx < mission.difficulty
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => onLaunchMission(mission.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          {isDone ? 'Replay' : 'Play'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
