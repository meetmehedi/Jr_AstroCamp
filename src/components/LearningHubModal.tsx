import React, { useState } from 'react';
import { TEACHING_FLASHCARDS, type TeachingFlashcard } from '../data/teachingFlashcards';
import { MISSION_EVENTS } from '../data/events';
import type { MissionEvent } from '../types/game';
import { NASA_MISSIONS } from '../data/nasaMissions';
import { NASA_MISSIONS_CATALOG, type NasaCatalogMission } from '../data/nasaMissionCatalog';
import { X, Volume2, VolumeX, Radio, Square, Search, Play, BookOpen, Sparkles } from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

interface LearningHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: MissionEvent | null;
  collectedFlashcards: TeachingFlashcard[];
  activeMissionId: string;
  onLaunchMission?: (missionId: string) => void;
  completedMissions?: string[];
  onOpenComicReader?: (issueId?: string) => void;
}

type HubTab = 'COMIC' | 'AUDIO' | 'NOTEBOOK' | 'BRIEFINGS' | 'CATALOG';

const SPEAKER_META: Record<string, { emoji: string; name: string; color: string }> = {
  CADET_MAYA:      { emoji: '👩‍🚀', name: 'Cadet Maya',        color: '#38bdf8' },
  COMMANDER_DADU:  { emoji: '🧑‍✈️', name: 'Commander Dadu',   color: '#10b981' },
  HOUSTON_CAPCOM:  { emoji: '📡',   name: 'Houston CapCom',   color: '#f59e0b' },
  SYSTEM_AI:       { emoji: '🤖',   name: 'Artemis Core AI',  color: '#ef4444' },
};

const CATEGORY_LABELS: Record<string, string> = {
  LIFE_SUPPORT: 'Life Support',
  RADIATION:    'Radiation',
  ENERGY:       'Energy',
  GEOLOGY:      'Geology',
  PROPULSION:   'Propulsion',
  ASTROBIOLOGY: 'Astrobiology',
};

export const LearningHubModal: React.FC<LearningHubModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  collectedFlashcards,
  activeMissionId,
  onLaunchMission,
  completedMissions,
  onOpenComicReader,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('COMIC');
  const [selectedComicIdx, setSelectedComicIdx] = useState<number>(0);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const [speakingMissionId, setSpeakingMissionId] = useState<string | null>(null);
  const [speakingCatalogId, setSpeakingCatalogId] = useState<string | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [audioViewMode, setAudioViewMode] = useState<'ALL' | 'COLLECTED'>('ALL');

  if (!isOpen) return null;

  const stopSpeech = () => {
    speechEngine.stop();
    setSpeakingCardId(null);
    setSpeakingMissionId(null);
    setSpeakingCatalogId(null);
  };

  const handleClose = () => {
    stopSpeech();
    onClose();
  };

  const handlePlayCard = (card: TeachingFlashcard) => {
    if (speakingCardId === card.id) {
      stopSpeech();
      return;
    }
    stopSpeech();
    const text = `${card.title}. ${card.audioScript} Key takeaway: ${card.ageAdaptations.CADET.keyTakeaway}`;
    setSpeakingCardId(card.id);
    speechEngine.speak(text, 'CADET_MAYA', () => setSpeakingCardId(null), () => setSpeakingCardId(null));
  };

  const handlePlayBriefing = (missionId: string, audio: string) => {
    if (speakingMissionId === missionId) {
      stopSpeech();
      return;
    }
    stopSpeech();
    setSpeakingMissionId(missionId);
    speechEngine.speak(audio, 'COMMANDER_DADU', () => setSpeakingMissionId(null), () => setSpeakingMissionId(null));
  };

  const handlePlayCatalog = (m: NasaCatalogMission) => {
    if (speakingCatalogId === m.id) {
      stopSpeech();
      return;
    }
    stopSpeech();
    setSpeakingCatalogId(m.id);
    const speechText = `${m.name}, launched in ${m.launchYear}. ${m.objective} Operational guide: ${m.operationalGuide}`;
    speechEngine.speak(speechText, 'COMMANDER_DADU', () => setSpeakingCatalogId(null), () => setSpeakingCatalogId(null));
  };

  const catalogPrograms = ['ALL', ...Array.from(new Set(NASA_MISSIONS_CATALOG.map((m) => m.program)))];

  const filteredCatalogMissions = NASA_MISSIONS_CATALOG.filter((m) => {
    const q = catalogSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.program.toLowerCase().includes(q) ||
      m.objective.toLowerCase().includes(q) ||
      m.operationalGuide.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q);
    const matchesProgram = selectedProgram === 'ALL' || m.program === selectedProgram;
    const matchesStatus =
      selectedStatus === 'ALL' || m.status.toLowerCase().includes(selectedStatus.toLowerCase());
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const TABS: { id: HubTab; label: string; icon: string }[] = [
    { id: 'COMIC',     label: 'Comic Reader',        icon: '📖' },
    { id: 'AUDIO',     label: 'Audio Lessons',        icon: '🔊' },
    { id: 'NOTEBOOK',  label: 'My Notebook',          icon: '📓' },
    { id: 'BRIEFINGS', label: 'Outpost Briefs',       icon: '🛰️' },
    { id: 'CATALOG',   label: 'NASA Missions (76)',   icon: '🚀' },
  ];

  return (
    <div className="hub-modal-backdrop" onClick={handleClose}>
      <div className="hub-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="hub-modal-header">
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'1.3rem' }}>📚</span>
            <span className="hub-modal-title">Astro Camp · Learning Hub</span>
          </div>
          <button
            onClick={handleClose}
            style={{ background:'transparent', border:'none', color:'#64748b', cursor:'pointer', padding:'4px', borderRadius:'6px', display:'flex', alignItems:'center' }}
            aria-label="Close Learning Hub"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="hub-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`hub-tab-btn ${activeTab === t.id ? 'hub-tab-active' : ''}`}
              onClick={() => { setActiveTab(t.id); stopSpeech(); }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="hub-tab-content">

          {/* ── COMIC READER ─────────────────────────────────────────────── */}
          {activeTab === 'COMIC' && (() => {
            const currentEvent = MISSION_EVENTS[selectedComicIdx] || activeEvent || MISSION_EVENTS[0];
            return (
              <div>
                {/* Highlight Banner: Full Graphic Novel Series */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '14px 18px', 
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(234, 88, 12, 0.2))', 
                  borderRadius: '12px', 
                  border: '1.5px solid rgba(245, 158, 11, 0.5)', 
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} className="text-amber-400" />
                      <span>The Chronicles of Jr_AstroCamp · 8 NASA STEM Graphic Novels</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px', maxWidth: '550px', lineHeight: 1.5 }}>
                      Full multi-panel comic book with vintage graphic layout, character voiceovers, sound effects, curriculum standards, hands-on experiments, and comprehension quizzes!
                    </div>
                  </div>
                  {onOpenComicReader && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenComicReader();
                      }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        background: '#f59e0b',
                        color: '#020617',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s',
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <BookOpen size={16} /> Open Graphic Novel Reader
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} className="text-amber-400" />
                    <span><strong>Mission Dilemma Comic Strips:</strong> Sol by Sol Mission Log</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                    SOL EVENT {selectedComicIdx + 1} OF {MISSION_EVENTS.length}
                  </div>
                </div>

                {/* Episode Selector Pills */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
                  {MISSION_EVENTS.map((ev, idx) => (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedComicIdx(idx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        background: selectedComicIdx === idx ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                        border: selectedComicIdx === idx ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: selectedComicIdx === idx ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Sol {ev.sol}: {ev.title.length > 24 ? ev.title.slice(0, 24) + '...' : ev.title}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(167,139,250,0.08)', borderRadius: '10px', border: '1px solid rgba(167,139,250,0.15)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    Sol {currentEvent.sol} — {currentEvent.urgency} Event
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{currentEvent.title}</div>
                  {currentEvent.weatherNotice && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
                      Telemetry: {currentEvent.weatherNotice}
                    </div>
                  )}
                </div>

                <div className="hub-comic-strip">
                  {currentEvent.comicPanels.map((panel, idx) => {
                    const meta = SPEAKER_META[panel.speaker] ?? { emoji: '👤', name: panel.speaker, color: '#94a3b8' };
                    return (
                      <div key={idx} className="hub-comic-panel">
                        <div
                          className="hub-comic-speaker-badge"
                          style={{ borderColor: meta.color, background: `${meta.color}18` }}
                        >
                          {meta.emoji}
                        </div>
                        <div className="hub-comic-dialogue">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="hub-comic-speaker-name" style={{ color: meta.color }}>
                              {meta.name}
                            </div>
                            <button
                              onClick={() => {
                                if ('speechSynthesis' in window) {
                                  window.speechSynthesis.cancel();
                                  const utterance = new SpeechSynthesisUtterance(panel.dialogue);
                                  utterance.pitch = panel.speaker === 'CADET_MAYA' ? 1.3 : 0.85;
                                  window.speechSynthesis.speak(utterance);
                                }
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Listen to dialogue"
                            >
                              <Volume2 size={14} className="hover:text-amber-400" />
                            </button>
                          </div>
                          <div>"{panel.dialogue}"</div>
                          {panel.mood && (
                            <div style={{ marginTop: '6px', fontSize: '0.68rem', color: '#64748b', fontStyle: 'italic' }}>
                              Mood: {panel.mood}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── AUDIO LESSONS ────────────────────────────────────────────── */}
          {activeTab === 'AUDIO' && (() => {
            const displayCards = audioViewMode === 'ALL' ? TEACHING_FLASHCARDS : collectedFlashcards;
            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    <strong>Team Mysterio Curriculum:</strong> Audio-narrated STEM flashcards powered by text-to-speech.
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setAudioViewMode('ALL')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: audioViewMode === 'ALL' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                        border: audioViewMode === 'ALL' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: audioViewMode === 'ALL' ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      All Lessons ({TEACHING_FLASHCARDS.length})
                    </button>
                    <button
                      onClick={() => setAudioViewMode('COLLECTED')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: audioViewMode === 'COLLECTED' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                        border: audioViewMode === 'COLLECTED' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: audioViewMode === 'COLLECTED' ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      Unlocked in Play ({collectedFlashcards.length})
                    </button>
                  </div>
                </div>

                <div className="hub-audio-grid">
                  {displayCards.map((card) => {
                    const isPlaying = speakingCardId === card.id;
                    return (
                      <div key={card.id} className="hub-audio-card">
                        <div className="hub-audio-emoji">{card.emoji}</div>
                        <div className="hub-audio-title">{card.title}</div>
                        <div className="hub-audio-cat">{CATEGORY_LABELS[card.category] ?? card.category}</div>
                        <p className="hub-audio-desc">{card.shortSummary}</p>
                        {card.equationOrFormula && (
                          <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#43ffa0', marginBottom: '10px', background: 'rgba(67,255,160,0.06)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(67,255,160,0.15)' }}>
                            {card.equationOrFormula}
                          </div>
                        )}
                        <button
                          className={`hub-audio-play-btn ${isPlaying ? 'playing' : ''}`}
                          onClick={() => handlePlayCard(card)}
                        >
                          {isPlaying ? <><Square size={13} /> Stop Audio</> : <><Volume2 size={13} /> Play Audio Lesson</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── MY NOTEBOOK ──────────────────────────────────────────────── */}
          {activeTab === 'NOTEBOOK' && (() => {
            const displayCards = TEACHING_FLASHCARDS;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ marginBottom: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Handwritten-style mission journal entries authored by Team Mysterio with real NASA technical references.
                </div>
                {displayCards.map((card, idx) => (
                  <div key={card.id} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '14px', right: '14px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#64748b' }}>
                      ENTRY #{String(idx + 1).padStart(2, '0')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{card.emoji}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc' }}>{card.title}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                      {CATEGORY_LABELS[card.category] ?? card.category}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '10px' }}>
                      {card.ageAdaptations.CADET.text}
                    </p>
                    <div style={{ background: 'rgba(67,255,160,0.06)', border: '1px solid rgba(67,255,160,0.15)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.78rem', color: '#43ffa0' }}>
                      <strong>Key Takeaway:</strong> {card.ageAdaptations.CADET.keyTakeaway}
                    </div>
                    {card.equationOrFormula && (
                      <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#a78bfa', marginTop: '8px', background: 'rgba(167,139,250,0.06)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(167,139,250,0.15)' }}>
                        {card.equationOrFormula}
                      </div>
                    )}
                    <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                      NASA Ref: {card.nasaDocReference}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── MISSION BRIEFINGS ────────────────────────────────────────── */}
          {activeTab === 'BRIEFINGS' && (
            <div>
              <div style={{ marginBottom:'16px', fontSize:'0.8rem', color:'#64748b' }}>
                Audio briefings for all {NASA_MISSIONS.length} NASA mission destinations.
              </div>
              <div className="hub-briefing-grid">
                {NASA_MISSIONS.map((mission) => {
                  const isActive = mission.id === activeMissionId;
                  const isPlaying = speakingMissionId === mission.id;
                  return (
                    <div key={mission.id} className={`hub-briefing-card ${isActive ? 'hub-briefing-active' : ''}`}>
                      <div className="hub-briefing-header">
                        <span className="hub-briefing-patch">{mission.missionPatchEmoji}</span>
                        <div>
                          <div className="hub-briefing-name">{mission.name}</div>
                          <div className="hub-briefing-dest">{mission.destination} · {mission.launchYear}</div>
                        </div>
                      </div>
                      <p className="hub-briefing-summary">{mission.scientificProblem.summary}</p>
                      <button
                        className="hub-briefing-play-btn"
                        onClick={() => handlePlayBriefing(mission.id, mission.scientificProblem.briefingAudio)}
                      >
                        {isPlaying
                          ? <><VolumeX size={12} /> Stop Briefing</>
                          : <><Radio size={12} /> Play Commander Briefing</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── NASA MISSIONS CATALOG (76 MISSIONS) ────────────────────────── */}
          {activeTab === 'CATALOG' && (
            <div>
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'1rem', fontWeight:700, color:'#f8fafc', marginBottom:'4px' }}>
                  NASA Mission Historical Catalog & Operational Protocols
                </div>
                <div style={{ fontSize:'0.8rem', color:'#94a3b8', lineHeight:1.5 }}>
                  Curated catalog of 76 seminal missions from Project Mercury (1961) to Artemis III & Europa Clipper (2026–2027+). Includes flight manual protocols, launch dates, and primary objectives.
                </div>
              </div>

              {/* Toolbar */}
              <div className="hub-catalog-toolbar">
                <div className="hub-catalog-search-wrap">
                  <Search size={14} className="hub-catalog-search-icon" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search 76 missions by name, objective, protocol..."
                    className="hub-catalog-search-input"
                  />
                </div>

                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="hub-catalog-select"
                >
                  {catalogPrograms.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog === 'ALL' ? 'All NASA Programs' : prog}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="hub-catalog-select"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                  <option value="Failure">Tragic Failure</option>
                </select>

                <div className="hub-catalog-count">
                  Showing <strong>{filteredCatalogMissions.length}</strong> of {NASA_MISSIONS_CATALOG.length} missions
                </div>
              </div>

              {/* Grid of missions */}
              {filteredCatalogMissions.length === 0 ? (
                <div className="hub-empty">
                  <span className="hub-empty-icon">🔍</span>
                  <div className="hub-empty-msg">No NASA missions matched your filters. Try clearing your search query.</div>
                </div>
              ) : (
                <div className="hub-catalog-grid">
                  {filteredCatalogMissions.map((m) => {
                    const isPlaying = speakingCatalogId === m.id;
                    const statusLower = m.status.toLowerCase();
                    const statusClass = statusLower.includes('active')
                      ? 'hub-catalog-status-active'
                      : statusLower.includes('planned')
                      ? 'hub-catalog-status-planned'
                      : statusLower.includes('failure')
                      ? 'hub-catalog-status-failure'
                      : 'hub-catalog-status-completed';

                    return (
                      <div key={m.id} className="hub-catalog-card">
                        <div className="hub-catalog-card-header">
                          <span className="hub-catalog-id-badge">{m.id}</span>
                          <span className={`hub-catalog-status-badge ${statusClass}`}>{m.status}</span>
                        </div>

                        <div className="hub-catalog-title">{m.name}</div>
                        <div className="hub-catalog-submeta">
                          <span>{m.program}</span> · <span>{m.launchYear}</span> · <span style={{ color: '#93c5fd' }}>{m.type}</span>
                        </div>

                        <div className="hub-catalog-objective">
                          {m.objective}
                        </div>

                        <div className="hub-catalog-protocol">
                          <div className="hub-catalog-protocol-title">Flight Manual Protocol</div>
                          {m.operationalGuide}
                        </div>

                        <button
                          className="hub-catalog-play-btn"
                          onClick={() => handlePlayCatalog(m)}
                        >
                          {isPlaying ? (
                            <>
                              <VolumeX size={12} />
                              <span>Stop Protocol Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              <span>Listen to Commander Dadu</span>
                            </>
                          )}
                        </button>

                        {onLaunchMission && (
                          <button
                            className="hub-catalog-play-game-btn"
                            onClick={() => {
                              onLaunchMission(m.id);
                              handleClose();
                            }}
                            style={{
                              marginTop: '8px',
                              width: '100%',
                              padding: '7px 12px',
                              background: completedMissions?.includes(m.id)
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                              border: completedMissions?.includes(m.id)
                                ? '1px solid rgba(16, 185, 129, 0.4)'
                                : 'none',
                              borderRadius: '6px',
                              color: completedMissions?.includes(m.id) ? '#34d399' : '#020617',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Play size={12} fill={completedMissions?.includes(m.id) ? 'none' : 'currentColor'} />
                            <span>
                              {completedMissions?.includes(m.id)
                                ? 'Replay Mission Simulation ★'
                                : 'Play Mission Simulator 🚀'}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
