import React, { useState, useEffect } from 'react';
import type { GameState, ChoiceOption, SolHistoryEntry, DifficultyMode } from './types/game';
import type { DifficultyTier } from './data/difficultyTiers';
import { getMissionScenarioDeck } from './utils/missionScenarioEngine';
import { NASA_MISSIONS, type NasaMission } from './data/nasaMissions';
import { TEACHING_FLASHCARDS, type TeachingFlashcard } from './data/teachingFlashcards';
import { LandingPage } from './components/LandingPage';
import { LearningHubModal } from './components/LearningHubModal';
import { AboutModal } from './components/AboutModal';
import { ViewportToggle } from './components/ViewportToggle';
import { ResourceHUD } from './components/ResourceHUD';
import { OutpostMap } from './components/OutpostMap';
import { Outpost3DView } from './components/Outpost3DView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CinematicScene } from './components/CinematicScene';
import { MissionAutopsy } from './components/MissionAutopsy';
import { NasaDataModal } from './components/NasaDataModal';
import { TeacherDossierModal } from './components/TeacherDossierModal';
import { AIDisclosureModal } from './components/AIDisclosureModal';
import { PlanetaryCommandMap } from './components/PlanetaryCommandMap';
import { AstronautBriefingModal } from './components/AstronautBriefingModal';
import { AudioTeachingFlashcard } from './components/AudioTeachingFlashcard';
import { MissionNotebookModal } from './components/MissionNotebookModal';
import { MissionGameModal } from './components/MissionGameModal';
import { MissionCampaignModal } from './components/MissionCampaignModal';
import { ComicBookModal } from './components/ComicBookModal';
import { soundFx } from './utils/audioEffects';
import { speechEngine } from './utils/speechEngine';
import {
  Rocket,
  Database,
  GraduationCap,
  Bot,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  BookOpen,
  Activity,
  Users,
  Home,
  Gamepad2,
  Menu,
  X,
} from 'lucide-react';

const INITIAL_GAME_STATE: GameState = {
  destination: 'MOON',
  difficultyMode: 'CADET',
  currentSol: 1,
  totalSols: 30,
  resources: {
    power: 75,
    water: 80,
    oxygen: 90,
    food: 24,
    radiation: 12,
    science: 10,
    crewHealth: 95
  },
  modules: {
    habitat: { status: 'NOMINAL', lifeSupportLoadKw: 12 },
    powerStation: { status: 'NOMINAL', activeSource: 'SOLAR', currentOutputKw: 25 },
    greenhouse: { status: 'NOMINAL', growthCycleDays: 3, lightEfficiency: 85 },
    stormVault: { status: 'NOMINAL', isSealed: false, regolithShieldCm: 180 }
  },
  activeEvent: getMissionScenarioDeck(NASA_MISSIONS[0], 'CADET')[0],
  history: [],
  isGameOver: false,
  gameOutcome: 'IN_PROGRESS'
};

export const App: React.FC = () => {
  const [hasLaunched, setHasLaunched] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('astro_camp_launched') === 'true';
    }
    return false;
  });
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [lastConsequence, setLastConsequence] = useState<{
    narrative: string;
    insight: string;
    choiceTitle: string;
    choiceOption?: ChoiceOption;
  } | null>(null);

  // Active Mission & Multi-World
  const [currentMission, setCurrentMission] = useState<NasaMission>(NASA_MISSIONS[0]);
  const [isPlanetaryMapOpen, setIsPlanetaryMapOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedBriefingMission, setSelectedBriefingMission] = useState<NasaMission | null>(null);

  // Flashcards & Notebook
  const [activeFlashcard, setActiveFlashcard] = useState<TeachingFlashcard | null>(null);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [collectedFlashcards, setCollectedFlashcards] = useState<TeachingFlashcard[]>([TEACHING_FLASHCARDS[0]]);

  // Viewport mode: 3D Simulator vs 2D Schematic
  const [is3DView, setIs3DView] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // New Astro Camp modals
  const [isLearningHubOpen, setIsLearningHubOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isComicBookOpen, setIsComicBookOpen] = useState(false);
  const [selectedComicIssueId, setSelectedComicIssueId] = useState<string | undefined>(undefined);

  // General Modals
  const [isNasaModalOpen, setIsNasaModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 76 Playable NASA Mission Games State
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astro_camp_completed_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeMissionGameId, setActiveMissionGameId] = useState<string | null>(null);
  const [isCampaignMapOpen, setIsCampaignMapOpen] = useState(false);

  const handleCompleteMission = (missionId: string, _score: number) => {
    setCompletedMissions((prev) => {
      if (prev.includes(missionId)) return prev;
      const next = [...prev, missionId];
      try {
        localStorage.setItem('astro_camp_completed_missions', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save completed mission', err);
      }
      return next;
    });
    soundFx.playTelemetryChirp();
  };

  const handleLaunchMissionGame = (missionId: string) => {
    setActiveMissionGameId(missionId);
    soundFx.playClick(900);
  };

  const triggerScreenShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 460);
  };

  // Play sound when crisis event activates
  useEffect(() => {
    if (!gameState.activeEvent) return;
    if (gameState.activeEvent.urgency === 'CRITICAL') {
      soundFx.playAlarm();
      triggerScreenShake();
    } else if (gameState.activeEvent.id === 'sol-20-meteoroid-strike') {
      soundFx.playImpact();
      triggerScreenShake();
    } else if (gameState.activeEvent.id === 'sol-24-ice-core-breakthrough') {
      soundFx.playTelemetryChirp();
    }
  }, [gameState.activeEvent?.id]);

  const handleSelectDifficulty = (mode: DifficultyMode) => {
    const newDeck = getMissionScenarioDeck(currentMission, mode as DifficultyTier);
    const currentSol = gameState.activeEvent ? gameState.activeEvent.sol : gameState.currentSol;
    const matchedEvent = newDeck.find((e) => e.sol === currentSol) || newDeck[0];
    setGameState((prev) => ({
      ...prev,
      difficultyMode: mode,
      activeEvent: prev.isGameOver ? prev.activeEvent : matchedEvent
    }));
  };

  const handleOpenBriefing = (mission: NasaMission) => {
    setSelectedBriefingMission(mission);
    setIsBriefingModalOpen(true);
    setIsPlanetaryMapOpen(false);
  };

  const handleLaunchMission = (mission: NasaMission) => {
    setCurrentMission(mission);
    const missionDeck = getMissionScenarioDeck(mission, gameState.difficultyMode as DifficultyTier);
    setGameState((prev) => ({
      ...INITIAL_GAME_STATE,
      destination: (mission.destination === 'MARS' ? 'MARS' : 'MOON') as 'MOON' | 'MARS',
      difficultyMode: prev.difficultyMode,
      activeEvent: missionDeck[0]
    }));
    setLastConsequence(null);
    setIsBriefingModalOpen(false);
    setIsPlanetaryMapOpen(false);
  };

  const handleSaveFlashcard = (card: TeachingFlashcard) => {
    if (!collectedFlashcards.some((c) => c.id === card.id)) {
      setCollectedFlashcards((prev) => [...prev, card]);
    }
  };

  const handleOpenFlashcardForChoice = (choice?: ChoiceOption) => {
    let matchedCard = TEACHING_FLASHCARDS[0];
    if (choice) {
      if (choice.id.includes('shield') || choice.id.includes('vault')) {
        matchedCard = TEACHING_FLASHCARDS.find((c) => c.id === 'card-regolith-shielding') || TEACHING_FLASHCARDS[1];
      } else if (choice.id.includes('kilopower')) {
        matchedCard = TEACHING_FLASHCARDS.find((c) => c.id === 'card-kilopower') || TEACHING_FLASHCARDS[2];
      } else if (choice.id.includes('moxie') || currentMission.destination === 'MARS') {
        matchedCard = TEACHING_FLASHCARDS.find((c) => c.id === 'card-moxie') || TEACHING_FLASHCARDS[3];
      } else if (currentMission.destination === 'EUROPA') {
        matchedCard = TEACHING_FLASHCARDS.find((c) => c.id === 'card-ocean-habitability') || TEACHING_FLASHCARDS[4];
      } else if (choice.id.includes('laser') || choice.id.includes('downlink') || choice.id.includes('telemetry')) {
        matchedCard = TEACHING_FLASHCARDS.find((c) => c.id === 'card-laser-comm') || TEACHING_FLASHCARDS[5];
      }
    }
    setActiveFlashcard(matchedCard);
    setIsFlashcardOpen(true);
  };

  const handleSelectChoice = (choice: ChoiceOption) => {
    if (gameState.isGameOver || !gameState.activeEvent) return;

    // Calculate new resource balances
    const updatedResources = {
      power: Math.min(100, Math.max(0, gameState.resources.power + (choice.resourceDelta.power || 0))),
      water: Math.min(100, Math.max(0, gameState.resources.water + (choice.resourceDelta.water || 0))),
      oxygen: Math.min(100, Math.max(0, gameState.resources.oxygen + (choice.resourceDelta.oxygen || 0))),
      food: Math.max(0, gameState.resources.food + (choice.resourceDelta.food || 0)),
      radiation: Math.max(0, gameState.resources.radiation + (choice.resourceDelta.radiation || 0)),
      science: gameState.resources.science + (choice.resourceDelta.science || 0),
      crewHealth: Math.min(100, Math.max(0, gameState.resources.crewHealth + (choice.resourceDelta.crewHealth || 0)))
    };

    // Store in history
    const historyEntry: SolHistoryEntry = {
      sol: gameState.currentSol,
      eventTitle: gameState.activeEvent.title,
      chosenOption: choice,
      resourcesSnapshot: updatedResources,
      chainReactionNote: choice.educationalInsight
    };

    const newHistory = [...gameState.history, historyEntry];

    // Check failure conditions
    let isGameOver = false;
    let outcome: 'IN_PROGRESS' | 'VICTORY' | 'CRITICAL_FAILURE' = 'IN_PROGRESS';
    let failureReason = '';

    if (updatedResources.oxygen <= 0) {
      isGameOver = true;
      outcome = 'CRITICAL_FAILURE';
      failureReason = 'Hypoxia: Atmospheric oxygen reserves completely exhausted.';
    } else if (updatedResources.power <= 0) {
      isGameOver = true;
      outcome = 'CRITICAL_FAILURE';
      failureReason = 'Catastrophic Freeze: Battery and surface power hit zero during the lunar night.';
    } else if (updatedResources.water <= 0) {
      isGameOver = true;
      outcome = 'CRITICAL_FAILURE';
      failureReason = 'Dehydration: Water recovery loops failed to supply minimum metabolic requirement.';
    } else if (updatedResources.radiation >= 100) {
      isGameOver = true;
      outcome = 'CRITICAL_FAILURE';
      failureReason = 'Acute Radiation Syndrome: Cumulative crew dosimeter exceeded safe biological ceiling (100 mSv).';
    } else if (updatedResources.crewHealth <= 0) {
      isGameOver = true;
      outcome = 'CRITICAL_FAILURE';
      failureReason = 'Medical Incapacitation: Crew vitals collapsed under compounded mission stresses.';
    }

    // Audio thrill effects
    if (choice.id === 'opt-magnetic-shield') {
      soundFx.playShieldHum();
      setIsShieldActive(true);
    } else if (choice.id === 'opt-spin-up-kilopower' || choice.id === 'opt-kilopower') {
      soundFx.playReactorStart();
    } else if (choice.id.includes('ice') || choice.id.includes('science')) {
      soundFx.playTelemetryChirp();
    } else {
      soundFx.playClick(680);
    }

    // Open flashcard for educational insight
    handleOpenFlashcardForChoice(choice);

    // Advance Sol and find next event in current mission scenario deck
    const currentDeck = getMissionScenarioDeck(currentMission, gameState.difficultyMode as DifficultyTier);
    const nextEventIndex = currentDeck.findIndex((e) => e.id === gameState.activeEvent?.id) + 1;
    const nextEvent = currentDeck[nextEventIndex] || null;

    if (!isGameOver && !nextEvent) {
      // Completed all authored events -> Victory if survived!
      isGameOver = true;
      outcome = 'VICTORY';
    }

    setLastConsequence({
      narrative: choice.consequenceNarrative,
      insight: choice.educationalInsight,
      choiceTitle: choice.title
    });

    setGameState((prev) => ({
      ...prev,
      resources: updatedResources,
      currentSol: nextEvent ? nextEvent.sol : prev.totalSols,
      activeEvent: nextEvent,
      history: newHistory,
      isGameOver,
      gameOutcome: outcome,
      failureReason
    }));
  };

  const handleRestart = () => {
    const missionDeck = getMissionScenarioDeck(currentMission, gameState.difficultyMode as DifficultyTier);
    setGameState({
      ...INITIAL_GAME_STATE,
      destination: (currentMission.destination === 'MARS' ? 'MARS' : 'MOON') as 'MOON' | 'MARS',
      difficultyMode: gameState.difficultyMode,
      activeEvent: missionDeck[0]
    });
    setLastConsequence(null);
    setIsShieldActive(false);
  };

  const handleEnterMissionControl = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('astro_camp_launched', 'true');
    }
    setHasLaunched(true);
  };

  // Show landing page on first visit (placed safely after all hooks)
  if (!hasLaunched) {
    return (
      <>
        <LandingPage 
          onEnter={handleEnterMissionControl} 
          onOpenComics={() => {
            setSelectedComicIssueId(undefined);
            setIsComicBookOpen(true);
            soundFx.playClick(750);
          }}
        />
        <ComicBookModal
          isOpen={isComicBookOpen}
          onClose={() => setIsComicBookOpen(false)}
          initialIssueId={selectedComicIssueId}
        />
      </>
    );
  }

  return (
    <div className={`app-shell ${isShaking ? 'shake-active' : ''}`}>
      {/* Top Navbar */}
      <header className="main-nav">
        <div className="nav-brand">
          <div className="brand-logo-glow">
            <Rocket size={20} className="text-emerald-400" />
          </div>
          <div>
            <div className="brand-title">JR_ASTROCAMP</div>
            <div className="brand-subtitle nav-subtitle-desktop">Junior Astronaut Mission Trainer · Team Mysterio · Space Apps 2026</div>
          </div>
        </div>

        {/* Target Age Group Tier Selector (Ages 3 to 19) — Desktop Only */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs flex-shrink-0 whitespace-nowrap">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1">Age:</span>
          <button
            onClick={() => handleSelectDifficulty('CADET')}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition ${
              gameState.difficultyMode === 'CADET' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-emerald-400 hover:bg-slate-800'
            }`}
          >🧒 3–7</button>
          <button
            onClick={() => handleSelectDifficulty('EXPLORER')}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition ${
              gameState.difficultyMode === 'EXPLORER' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-cyan-400 hover:bg-slate-800'
            }`}
          >🚀 8–13</button>
          <button
            onClick={() => handleSelectDifficulty('COMMANDER')}
            className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition ${
              gameState.difficultyMode === 'COMMANDER' ? 'bg-violet-500 text-white shadow-sm' : 'text-violet-400 hover:bg-slate-800'
            }`}
          >🛰️ 14–19</button>
        </div>

        {/* Desktop Nav Actions */}
        <div className="nav-actions nav-desktop-only">
          <button onClick={() => { if (typeof window !== 'undefined') sessionStorage.removeItem('astro_camp_launched'); setHasLaunched(false); soundFx.playClick(600); }} className="nav-link-btn" title="Home">
            <Home size={15} className="text-slate-400" /><span>Home</span>
          </button>
          <button onClick={() => { setIsLearningHubOpen(true); soundFx.playClick(700); }} className="nav-link-btn">
            <BookOpen size={15} className="text-violet-400" /><span>Learn</span>
          </button>
          <button
            onClick={() => { setSelectedComicIssueId(undefined); setIsComicBookOpen(true); soundFx.playClick(750); }}
            className="nav-link-btn"
            style={{ 
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.22), rgba(234, 88, 12, 0.22))', 
              border: '1px solid rgba(245, 158, 11, 0.5)', 
              color: '#fbbf24', 
              fontWeight: 700 
            }}
            title="NASA STEM Graphic Novels (8 Issues)"
          >
            <BookOpen size={15} className="text-amber-400" /><span>📖 Comics (8 Issues)</span>
          </button>
          <button onClick={() => { setIsPlanetaryMapOpen(true); soundFx.playClick(700); }} className="nav-link-btn">
            <Compass size={15} className="text-violet-400" /><span>Missions</span>
          </button>
          <button
            onClick={() => { setIsCampaignMapOpen(true); soundFx.playClick(850); }}
            className="nav-link-btn"
            style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.4)', color: '#38bdf8', fontWeight: 700 }}
          >
            <Gamepad2 size={15} className="text-cyan-400" /><span>76 Games ({completedMissions.length}/76)</span>
          </button>
          <button onClick={() => { const m = soundFx.toggleMute(); speechEngine.setMuted(m); setIsMuted(m); }} className="nav-link-btn">
            {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
            <span>{isMuted ? 'Muted' : 'Audio'}</span>
          </button>
          <button onClick={() => setIsAboutOpen(true)} className="nav-link-btn">
            <Users size={15} className="text-violet-400" /><span>About</span>
          </button>
          <button onClick={handleRestart} className="nav-link-btn">
            <RotateCcw size={15} /><span>Reset</span>
          </button>
        </div>

        {/* Mobile: Quick Actions + Hamburger */}
        <div className="nav-mobile-right">
          {/* Quick-access comic button */}
          <button
            onClick={() => { setSelectedComicIssueId(undefined); setIsComicBookOpen(true); soundFx.playClick(750); }}
            className="nav-link-btn nav-game-btn-mobile"
            style={{ 
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.22), rgba(234, 88, 12, 0.22))', 
              border: '1px solid rgba(245, 158, 11, 0.5)', 
              color: '#fbbf24', 
              fontWeight: 700, 
              padding: '6px 10px' 
            }}
            title="Read Comics"
          >
            <BookOpen size={14} className="text-amber-400" />
            <span className="nav-game-label">Comics</span>
          </button>

          {/* Quick-access game button always visible */}
          <button
            onClick={() => { setIsCampaignMapOpen(true); soundFx.playClick(850); }}
            className="nav-link-btn nav-game-btn-mobile"
            style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.4)', color: '#38bdf8', fontWeight: 700, padding: '6px 10px' }}
          >
            <Gamepad2 size={14} className="text-cyan-400" />
            <span className="nav-game-label">Play ({completedMissions.length}/76)</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="nav-hamburger"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            {/* Age Mode Selector */}
            <div className="mobile-menu-section">
              <div className="mobile-menu-section-label">Age Mode</div>
              <div className="mobile-age-btns">
                {(['CADET', 'EXPLORER', 'COMMANDER'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => { handleSelectDifficulty(mode); setIsMobileMenuOpen(false); }}
                    className={`mobile-age-btn ${gameState.difficultyMode === mode ? 'mobile-age-btn-active' : ''}`}
                  >
                    {mode === 'CADET' ? '🧒 Cadet (3–7)' : mode === 'EXPLORER' ? '🚀 Explorer (8–13)' : '🛰️ Commander (14–19)'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mobile-menu-divider" />
            {/* Nav Links */}
            {[
              { icon: <Home size={16} />, label: 'Home', color: '#94a3b8', action: () => { if (typeof window !== 'undefined') sessionStorage.removeItem('astro_camp_launched'); setHasLaunched(false); } },
              { icon: <BookOpen size={16} />, label: '📖 Comic Books (8 Issues)', color: '#fbbf24', action: () => { setSelectedComicIssueId(undefined); setIsComicBookOpen(true); } },
              { icon: <BookOpen size={16} />, label: 'Learning Hub', color: '#a78bfa', action: () => setIsLearningHubOpen(true) },
              { icon: <Compass size={16} />, label: 'Mission Map', color: '#a78bfa', action: () => setIsPlanetaryMapOpen(true) },
              { icon: <Gamepad2 size={16} />, label: `76 Mission Games (${completedMissions.length}/76)`, color: '#38bdf8', action: () => setIsCampaignMapOpen(true) },
              { icon: isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />, label: isMuted ? 'Unmute Audio' : 'Mute Audio', color: isMuted ? '#f87171' : '#34d399', action: () => { const m = soundFx.toggleMute(); speechEngine.setMuted(m); setIsMuted(m); } },
              { icon: <Database size={16} />, label: 'NASA Data Sources', color: '#34d399', action: () => setIsNasaModalOpen(true) },
              { icon: <GraduationCap size={16} />, label: 'Curriculum Guide', color: '#38bdf8', action: () => setIsTeacherModalOpen(true) },
              { icon: <Bot size={16} />, label: 'AI Disclosure', color: '#fbbf24', action: () => setIsAIModalOpen(true) },
              { icon: <Users size={16} />, label: 'About Team Mysterio', color: '#c4b5fd', action: () => setIsAboutOpen(true) },
              { icon: <RotateCcw size={16} />, label: 'Reset Simulation', color: '#94a3b8', action: handleRestart },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { item.action(); soundFx.playClick(700); setIsMobileMenuOpen(false); }}
                className="mobile-menu-item"
                style={{ '--item-color': item.color } as React.CSSProperties}
              >
                <span className="mobile-menu-icon" style={{ color: item.color }}>{item.icon}</span>
                <span className="mobile-menu-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main HUD */}
      <main className="main-content-layout">
        <ResourceHUD
          sol={gameState.currentSol}
          totalSols={gameState.totalSols}
          resources={gameState.resources}
          difficultyMode={gameState.difficultyMode}
          onSelectDifficulty={handleSelectDifficulty}
        />

        {/* Current Mission Banner */}
        <div className="mission-banner-bar">
          <div className="mission-banner-info">
            <Rocket size={13} className="text-violet-400 shrink-0" />
            <span style={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#a78bfa' }}>
              Active Mission:
            </span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{currentMission.name}</span>
            <span style={{ color: '#64748b' }}>·</span>
            <span style={{ color: '#94a3b8' }}>{currentMission.destinationName} · {currentMission.coordinates}</span>
          </div>

          <div className="mission-banner-controls">
            {/* Cinema Theater vs Tactical Bridge Viewport Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(15,23,42,0.7)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => { setIsTheaterMode(true); soundFx.playClick(900); }}
                style={{
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isTheaterMode ? '#38bdf8' : 'transparent',
                  color: isTheaterMode ? '#070a0e' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
              >
                <span>🎬 Cinema Theater</span>
              </button>
              <button
                onClick={() => { setIsTheaterMode(false); soundFx.playClick(800); }}
                style={{
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: !isTheaterMode ? '#38bdf8' : 'transparent',
                  color: !isTheaterMode ? '#070a0e' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
              >
                <span>🛰️ Tactical Bridge</span>
              </button>
            </div>

            <button
              onClick={() => setIsPlanetaryMapOpen(true)}
              style={{
                padding: '4px 10px',
                background: 'rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: '6px',
                color: '#c4b5fd',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              SWITCH MISSION
            </button>
          </div>
        </div>

        {/* ── CINEMA THEATER MODE (Full Screen Narrative Immersion) ── */}
        {isTheaterMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Cinematic Stage */}
            {gameState.activeEvent && (
              <div className="event-dilemma-card" style={{ padding: '18px 22px' }}>
                <div className="event-headline-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div className="event-badge">SOL {gameState.activeEvent.sol} MISSION BRIEFING</div>
                    <h2 className="event-title">{gameState.activeEvent.title}</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedComicIssueId(undefined);
                        setIsComicBookOpen(true);
                        soundFx.playClick(750);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        background: 'rgba(245, 158, 11, 0.18)',
                        border: '1px solid rgba(245, 158, 11, 0.45)',
                        borderRadius: '6px',
                        color: '#fbbf24',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Read NASA STEM Graphic Novel"
                    >
                      <BookOpen size={13} className="text-amber-400" />
                      <span>📖 STEM Graphic Novel</span>
                    </button>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>
                      NARRATIVE STAGE
                    </span>
                  </div>
                </div>

                {/* Photorealistic Interstellar Scene */}
                <CinematicScene
                  panels={gameState.activeEvent.comicPanels}
                  urgency={gameState.activeEvent.urgency}
                  isTheaterMode={true}
                  onToggleTheaterMode={() => setIsTheaterMode(false)}
                />

                {/* Tactical Strategic Command Actions Grid */}
                <div className="choices-block" style={{ marginTop: '16px' }}>
                  <div className="choices-instruction" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={14} className="text-cyan-400" />
                    <span>SELECT TACTICAL COMMAND ACTION PROTOCOL:</span>
                  </div>
                  <div
                    className="choices-list"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                      gap: '12px',
                    }}
                  >
                    {gameState.activeEvent.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectChoice(opt)}
                        className="choice-card-btn"
                        style={{
                          padding: '16px 18px',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(8, 14, 26, 0.95) 100%)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        <div className="choice-header-row">
                          <span className="choice-title" style={{ fontSize: '14px', color: '#38bdf8' }}>{opt.title}</span>
                          <ChevronRight size={18} className="text-cyan-400 choice-arrow" />
                        </div>
                        <p className="choice-desc" style={{ fontSize: '12.5px', color: '#cbd5e1' }}>{opt.description}</p>
                        <div className="choice-tradeoff" style={{ marginTop: '6px' }}>
                          <span className="tradeoff-label" style={{ color: '#fbbf24', fontWeight: 700 }}>Telemetry Trade-off: </span>
                          <span style={{ color: '#94a3b8' }}>{opt.tradeOffText}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Tactical Sensor Deck & Scientific Citation Array */}
            <div className="theater-bottom-grid">
              {/* Outpost Viewport */}
              <div className="panel-box">
                <div className="panel-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="panel-box-title">🛰️ Outpost Sensor Viewport</span>
                    <span className="text-xs text-slate-400 font-mono">{currentMission.destinationName} ({currentMission.coordinates})</span>
                  </div>

                  <ViewportToggle is3DView={is3DView} onSetView={setIs3DView} />
                </div>

                {is3DView ? (
                  <ErrorBoundary fallbackTitle="3D Outpost Sensor Viewport" onFallback2D={() => setIs3DView(false)}>
                    <Outpost3DView
                      currentSol={gameState.currentSol}
                      modules={gameState.modules}
                      resources={gameState.resources}
                      activeEventId={gameState.activeEvent?.id}
                      isShieldActive={isShieldActive}
                      mission={currentMission}
                      taskChoices={gameState.activeEvent?.options}
                      onSelectChoice={handleSelectChoice}
                      activeEventTitle={gameState.activeEvent?.title}
                    />
                  </ErrorBoundary>
                ) : (
                  <OutpostMap
                    currentSol={gameState.currentSol}
                    modules={gameState.modules}
                    resources={gameState.resources}
                  />
                )}
              </div>

              {/* NASA Science & Decision History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {gameState.activeEvent && (
                  <div className="nasa-context-card" style={{ flex: 1 }}>
                    <div className="context-header">
                      <span className="context-tag">NASA DATA CITATION</span>
                      <span className="context-doc font-mono">{gameState.activeEvent.nasaCitation.docNumber}</span>
                    </div>
                    <div className="context-title">{gameState.activeEvent.nasaCitation.title}</div>
                    <p className="context-desc">{gameState.activeEvent.nasaCitation.description}</p>
                    {gameState.activeEvent.weatherNotice && (
                      <div className="weather-alert-strip">
                        <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                        <span>{gameState.activeEvent.weatherNotice}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Previous Consequence Feed */}
                {lastConsequence && (
                  <div className="consequence-feed-card">
                    <div className="feed-header">
                      <Sparkles size={16} className="text-cyan-400" />
                      <span>Previous Decision Result: {lastConsequence.choiceTitle}</span>
                    </div>
                    <p className="feed-narrative">{lastConsequence.narrative}</p>
                    <div className="feed-insight">
                      <strong>Physics Insight: </strong>
                      {lastConsequence.insight}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── TACTICAL BRIDGE (Split 2-Column View) ── */
          <div className="game-columns-grid">
            {/* Left Column: 3D Simulator or 2D Isometric Base Map */}
            <div className="left-panel-col">
              <div className="panel-box">
                <div className="panel-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="panel-box-title">🛰️ Outpost Viewport</span>
                    <span className="text-xs text-slate-400 font-mono">{currentMission.destinationName} ({currentMission.coordinates})</span>
                  </div>

                  <ViewportToggle is3DView={is3DView} onSetView={setIs3DView} />
                </div>

                {is3DView ? (
                  <ErrorBoundary fallbackTitle="3D Outpost Viewport" onFallback2D={() => setIs3DView(false)}>
                    <Outpost3DView
                      currentSol={gameState.currentSol}
                      modules={gameState.modules}
                      resources={gameState.resources}
                      activeEventId={gameState.activeEvent?.id}
                      isShieldActive={isShieldActive}
                      mission={currentMission}
                      taskChoices={gameState.activeEvent?.options}
                      onSelectChoice={handleSelectChoice}
                      activeEventTitle={gameState.activeEvent?.title}
                    />
                  </ErrorBoundary>
                ) : (
                  <OutpostMap
                    currentSol={gameState.currentSol}
                    modules={gameState.modules}
                    resources={gameState.resources}
                  />
                )}
              </div>

              {/* NASA Weather & Scientific Context Box */}
              {gameState.activeEvent && (
                <div className="nasa-context-card">
                  <div className="context-header">
                    <span className="context-tag">NASA DATA CITATION</span>
                    <span className="context-doc font-mono">{gameState.activeEvent.nasaCitation.docNumber}</span>
                  </div>
                  <div className="context-title">{gameState.activeEvent.nasaCitation.title}</div>
                  <p className="context-desc">{gameState.activeEvent.nasaCitation.description}</p>
                  {gameState.activeEvent.weatherNotice && (
                    <div className="weather-alert-strip">
                      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                      <span>{gameState.activeEvent.weatherNotice}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Living Comic Panels & Tactical Choice Options */}
            <div className="right-panel-col">
              {gameState.activeEvent ? (
                <div className="event-dilemma-card">
                  <div className="event-headline-row">
                    <div className="event-badge">SOL {gameState.activeEvent.sol} MISSION BRIEFING</div>
                    <h2 className="event-title">{gameState.activeEvent.title}</h2>
                  </div>

                  {/* 🎬 Cinematic Mission Dialogue Scene */}
                  <CinematicScene
                    panels={gameState.activeEvent.comicPanels}
                    urgency={gameState.activeEvent.urgency}
                    isTheaterMode={false}
                    onToggleTheaterMode={() => setIsTheaterMode(true)}
                  />

                  {/* Interactive Strategic Choices */}
                  <div className="choices-block">
                    <div className="choices-instruction">
                      <span>Select Tactical Command Action:</span>
                    </div>
                    <div className="choices-list">
                      {gameState.activeEvent.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectChoice(opt)}
                          className="choice-card-btn"
                        >
                          <div className="choice-header-row">
                            <span className="choice-title">{opt.title}</span>
                            <ChevronRight size={18} className="text-emerald-400 choice-arrow" />
                          </div>
                          <p className="choice-desc">{opt.description}</p>
                          <div className="choice-tradeoff">
                            <span className="tradeoff-label">Trade-off: </span>
                            <span>{opt.tradeOffText}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Last Consequence Feed */}
              {lastConsequence && (
                <div className="consequence-feed-card">
                  <div className="feed-header">
                    <Sparkles size={16} className="text-cyan-400" />
                    <span>Previous Decision Result: {lastConsequence.choiceTitle}</span>
                  </div>
                  <p className="feed-narrative">{lastConsequence.narrative}</p>
                  <div className="feed-insight">
                    <strong>Physics Insight: </strong>
                    {lastConsequence.insight}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Game Over / Mission Autopsy Overlay */}
      {gameState.isGameOver && (
        <MissionAutopsy gameState={gameState} onRestartMission={handleRestart} currentMission={currentMission} />
      )}

      {/* ═══ Full-Screen Modals ═══ */}

      {/* Planetary Mission Command Map */}
      <PlanetaryCommandMap
        isOpen={isPlanetaryMapOpen}
        onClose={() => setIsPlanetaryMapOpen(false)}
        onSelectMission={(mission) => { handleOpenBriefing(mission); }}
        activeMissionId={currentMission.id}
      />

      {/* Astronaut Briefing Room */}
      <AstronautBriefingModal
        isOpen={isBriefingModalOpen}
        mission={selectedBriefingMission}
        onClose={() => setIsBriefingModalOpen(false)}
        onLaunchMission={handleLaunchMission}
      />

      {/* Audio Teaching Flashcard (shown after each choice) */}
      <AudioTeachingFlashcard
        isOpen={isFlashcardOpen}
        card={activeFlashcard}
        onClose={() => setIsFlashcardOpen(false)}
        tier={gameState.difficultyMode as DifficultyTier}
        onSaveToNotebook={handleSaveFlashcard}
        isSaved={activeFlashcard ? collectedFlashcards.some(c => c.id === activeFlashcard.id) : false}
      />

      {/* Mission Notebook */}
      <MissionNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        mission={currentMission}
        history={gameState.history}
        collectedFlashcards={collectedFlashcards}
        resources={gameState.resources}
      />

      {/* Utility Modals */}
      <NasaDataModal isOpen={isNasaModalOpen} onClose={() => setIsNasaModalOpen(false)} />
      <TeacherDossierModal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} />
      <AIDisclosureModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Astro Camp — Learning Hub */}
      <LearningHubModal
        isOpen={isLearningHubOpen}
        onClose={() => setIsLearningHubOpen(false)}
        activeEvent={gameState.activeEvent}
        collectedFlashcards={collectedFlashcards}
        activeMissionId={currentMission.id}
        onLaunchMission={handleLaunchMissionGame}
        completedMissions={completedMissions}
        onOpenComicReader={(issueId) => {
          setSelectedComicIssueId(issueId);
          setIsComicBookOpen(true);
        }}
      />

      {/* NASA STEM Graphic Novel Comic Book Reader Modal */}
      <ComicBookModal
        isOpen={isComicBookOpen}
        onClose={() => setIsComicBookOpen(false)}
        initialIssueId={selectedComicIssueId}
      />

      {/* 76 NASA Playable Missions Campaign Map */}
      <MissionCampaignModal
        isOpen={isCampaignMapOpen}
        onClose={() => setIsCampaignMapOpen(false)}
        completedMissions={completedMissions}
        onLaunchMission={handleLaunchMissionGame}
      />

      {/* Active Phaser 3 Mission Mini-Game Modal */}
      {activeMissionGameId && (
        <MissionGameModal
          missionId={activeMissionGameId}
          onClose={() => setActiveMissionGameId(null)}
          onCompleteMission={handleCompleteMission}
          onSelectNextMission={(nextId) => setActiveMissionGameId(nextId)}
          completedMissions={completedMissions}
        />
      )}

      {/* About / Team Mysterio */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Footer */}
      <footer className="main-footer">
        <div>
          <span>Astro Camp · Outpost Command · Developed for <strong>NASA International Space Apps Challenge 2026</strong></span>
        </div>
        <div className="footer-credits">
          <span>By <strong>Team Mysterio</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
