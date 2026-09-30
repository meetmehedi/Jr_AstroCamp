import React, { useState } from 'react';
import { NASA_MISSIONS, type NasaMission, type MissionEra } from '../data/nasaMissions';
import {
  X,
  Rocket,
  Search,
  Thermometer,
  Scale,
  Compass,
  ChevronRight
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface PlanetaryCommandMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMission: (mission: NasaMission) => void;
  activeMissionId?: string;
}

interface EraTab {
  id: MissionEra | 'ALL';
  label: string;
  count: number;
  emoji: string;
}

export const PlanetaryCommandMap: React.FC<PlanetaryCommandMapProps> = ({
  isOpen,
  onClose,
  onSelectMission,
  activeMissionId
}) => {
  const [selectedEra, setSelectedEra] = useState<MissionEra | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDestination, setFilterDestination] = useState<string>('ALL');

  if (!isOpen) return null;

  const eras: EraTab[] = [
    { id: 'ALL',              label: 'All Missions',          count: NASA_MISSIONS.length, emoji: '🌌' },
    { id: 'PIONEERS',         label: 'Mercury & Gemini',       count: NASA_MISSIONS.filter(m => m.era === 'PIONEERS').length, emoji: '🚀' },
    { id: 'LUNAR_APOLLO',     label: 'Apollo & Lunar',         count: NASA_MISSIONS.filter(m => m.era === 'LUNAR_APOLLO').length, emoji: '🌕' },
    { id: 'SHUTTLE_ISS',      label: 'Shuttle & Space Station', count: NASA_MISSIONS.filter(m => m.era === 'SHUTTLE_ISS').length, emoji: '🛰️' },
    { id: 'ARTEMIS_ERA',      label: 'Artemis Moon-to-Mars',   count: NASA_MISSIONS.filter(m => m.era === 'ARTEMIS_ERA').length, emoji: '🌙' },
    { id: 'MARS_FLEET',       label: 'Mars Armada',            count: NASA_MISSIONS.filter(m => m.era === 'MARS_FLEET').length, emoji: '🔴' },
    { id: 'DEEP_WORLDS',      label: 'Outer Worlds & Deep',    count: NASA_MISSIONS.filter(m => m.era === 'DEEP_WORLDS').length, emoji: '🪐' },
    { id: 'COSMIC_SENTINELS', label: 'Cosmic Observatories',   count: NASA_MISSIONS.filter(m => m.era === 'COSMIC_SENTINELS').length, emoji: '🔭' },
  ];

  const filteredMissions = NASA_MISSIONS.filter((m) => {
    const matchesEra = selectedEra === 'ALL' || m.era === selectedEra;
    const matchesDest = filterDestination === 'ALL' || m.destination === filterDestination;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nasaProgram.toLowerCase().includes(q) ||
      m.tagline.toLowerCase().includes(q) ||
      m.targetLocation.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.operationalGuide.toLowerCase().includes(q);

    return matchesEra && matchesDest && matchesSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 999 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1180px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: 'clamp(12px, 3vw, 20px) clamp(14px, 3vw, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="brand-logo-glow" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
              <Compass size={22} className="text-cyan-400" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 className="modal-title" style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                NASA FLIGHT ROSTER & MISSIONS
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                76 Playable Historic & Active NASA Missions
              </div>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close command map" style={{ flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: Search & Destination Filter */}
        <div style={{
          padding: '10px clamp(14px, 3vw, 24px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: 'min(100%, 240px)' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missions, targets, astronauts..."
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#f8fafc',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Destination Selector */}
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#e2e8f0',
              fontSize: '0.8rem',
              cursor: 'pointer',
              maxWidth: '100%'
            }}
          >
            <option value="ALL">All Destinations</option>
            <option value="MOON">Moon (Apollo / Artemis)</option>
            <option value="MARS">Mars (Viking / Curiosity)</option>
            <option value="EARTH_ORBIT">Low Earth Orbit (Shuttle/ISS)</option>
            <option value="EUROPA">Europa (Ocean World)</option>
            <option value="TITAN">Titan (Dunes & Lakes)</option>
            <option value="ASTEROID">Asteroid Belt</option>
            <option value="LAGRANGE">Deep Space & L2</option>
            <option value="OUTER_PLANETS">Outer Solar System</option>
          </select>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginLeft: 'auto' }}>
            Showing <strong style={{ color: '#38bdf8' }}>{filteredMissions.length}</strong>
          </div>
        </div>

        {/* Spaceflight Era Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '10px clamp(14px, 3vw, 24px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          overflowX: 'auto',
          backgroundColor: 'rgba(10, 15, 26, 0.65)'
        }}>
          {eras.map(era => {
            const isSelected = selectedEra === era.id;
            return (
              <button
                key={era.id}
                onClick={() => { setSelectedEra(era.id); soundFx.playClick(700); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span>{era.emoji}</span>
                <span>{era.label}</span>
                <span style={{
                  fontSize: '0.66rem',
                  background: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  color: isSelected ? '#0f172a' : '#94a3b8',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontWeight: 700
                }}>
                  {era.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Missions Grid */}
        <div style={{
          padding: 'clamp(14px, 3vw, 24px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '14px'
        }}>
          {filteredMissions.map((mission) => {
            const isActive = activeMissionId === mission.id;
            return (
              <div
                key={mission.id}
                onClick={() => {
                  soundFx.playClick(850);
                  onSelectMission(mission);
                }}
                style={{
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.72)',
                  border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none'
                }}
                className="hover:scale-[1.015] hover:border-cyan-400"
              >
                <div>
                  {/* Card Top Meta */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.75rem' }}>{mission.missionPatchEmoji}</span>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
                          {mission.id} · {mission.launchYear}
                        </div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                          {mission.name}
                        </h3>
                      </div>
                    </div>
                    {isActive ? (
                      <span style={{
                        backgroundColor: 'rgba(67, 255, 160, 0.2)',
                        color: '#43ffa0',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(67, 255, 160, 0.4)'
                      }}>
                        ACTIVE
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {mission.status}
                      </span>
                    )}
                  </div>

                  {/* Program & Target Location */}
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '8px', lineHeight: 1.4 }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{mission.nasaProgram}</span> · {mission.targetLocation}
                  </div>

                  {/* Tagline / Objective */}
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    {mission.tagline}
                  </p>

                  {/* Operational Protocol Callout */}
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.65)',
                    borderLeft: '3px solid #10b981',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
                      Flight Manual Protocol
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      {mission.operationalGuide}
                    </div>
                  </div>

                  {/* Environment Physics Chips */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    marginBottom: '14px',
                    padding: '8px',
                    backgroundColor: 'rgba(2, 6, 23, 0.5)',
                    borderRadius: '8px',
                    fontSize: '0.7rem'
                  }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Scale size={10} /> Gravity
                      </div>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{mission.gravityG}g</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Thermometer size={10} /> Temp
                      </div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mission.surfaceTempC.split('(')[0]}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Rocket size={10} /> Type
                      </div>
                      <div style={{ fontWeight: 700, color: '#93c5fd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mission.destination}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {mission.primaryInstrument.slice(0, 30)}...
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick(900);
                      onSelectMission(mission);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.15)',
                      color: isActive ? '#0f172a' : '#38bdf8',
                      border: '1px solid #38bdf8',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{isActive ? 'Current Flight' : 'Select Mission'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
