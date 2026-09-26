import React from 'react';
import type { ResourceState, DifficultyMode } from '../types/game';
import { TIER_PROFILES } from '../data/difficultyTiers';
import { Zap, Droplets, Wind, Apple, ShieldAlert, Award, HeartPulse } from 'lucide-react';

interface ResourceHUDProps {
  sol: number;
  totalSols: number;
  resources: ResourceState;
  difficultyMode: DifficultyMode;
  onSelectDifficulty?: (mode: DifficultyMode) => void;
  onToggleDifficulty?: () => void;
}

export const ResourceHUD: React.FC<ResourceHUDProps> = ({
  sol,
  totalSols,
  resources,
  difficultyMode,
  onSelectDifficulty,
}) => {
  const currentTier = TIER_PROFILES[difficultyMode] || TIER_PROFILES.CADET;
  const showUnits = currentTier.features.showUnits;

  const getMeterColor = (val: number, isReverse = false) => {
    if (isReverse) {
      if (val > 60) return '#ef4444'; // Red for high radiation
      if (val > 30) return '#ffb454'; // Amber
      return '#43ffa0'; // Green
    }
    if (val < 20) return '#ef4444'; // Danger
    if (val < 45) return '#ffb454'; // Caution
    return '#43ffa0'; // Nominal
  };

  const tiers: DifficultyMode[] = ['EXPLORER', 'CADET', 'ENGINEER', 'SCIENTIST', 'COMMANDER'];

  return (
    <div className="hud-container">
      {/* Top Header: Sol Progress & 5-Tier Age Selector */}
      <div className="hud-header">
        <div className="sol-badge">
          <span className="sol-pulse">●</span>
          <span className="sol-title">SOL {sol} / {totalSols}</span>
          <span className="sol-location">· SHACKLETON CRATER RIM (MOON)</span>
        </div>

        {/* 5-Tier Age Selector */}
        <div className="tier-selector-pills" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mission Tier:
          </span>
          {tiers.map((t) => {
            const p = TIER_PROFILES[t];
            const active = difficultyMode === t;
            return (
              <button
                key={t}
                onClick={() => onSelectDifficulty && onSelectDifficulty(t)}
                className={`tier-pill-btn ${active ? 'active-tier' : ''}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? `1.5px solid ${p.color}` : '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: active ? `${p.color}22` : 'rgba(15,23,42,0.6)',
                  color: active ? p.color : '#94a3b8',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title={`${p.label} (${p.ageRange}): ${p.tagline}`}
              >
                <span>{p.label}</span>
                <span style={{ opacity: 0.7, fontSize: '0.68rem' }}>({p.ageRange})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Meters Grid */}
      <div className="hud-meters-grid">
        {/* 1. POWER */}
        <div className="meter-card" style={{ borderColor: getMeterColor(resources.power) }}>
          <div className="meter-header">
            <span className="meter-label">
              <Zap size={15} className="text-amber-400" />
              <span>POWER</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.power) }}>
              {showUnits ? `${(resources.power * 0.4).toFixed(1)} kWh (${resources.power}%)` : `${resources.power}%`}
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.power))}%`, backgroundColor: getMeterColor(resources.power) }}
            />
          </div>
        </div>

        {/* 2. WATER */}
        <div className="meter-card" style={{ borderColor: getMeterColor(resources.water) }}>
          <div className="meter-header">
            <span className="meter-label">
              <Droplets size={15} className="text-cyan-400" />
              <span>WATER</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.water) }}>
              {showUnits ? `${Math.round(resources.water * 2.5)} L (${resources.water}%)` : `${resources.water}%`}
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.water))}%`, backgroundColor: getMeterColor(resources.water) }}
            />
          </div>
        </div>

        {/* 3. OXYGEN */}
        <div className="meter-card" style={{ borderColor: getMeterColor(resources.oxygen) }}>
          <div className="meter-header">
            <span className="meter-label">
              <Wind size={15} className="text-sky-300" />
              <span>OXYGEN</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.oxygen) }}>
              {showUnits ? `${(resources.oxygen * 0.21).toFixed(1)} kPa (${resources.oxygen}%)` : `${resources.oxygen}%`}
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.oxygen))}%`, backgroundColor: getMeterColor(resources.oxygen) }}
            />
          </div>
        </div>

        {/* 4. FOOD */}
        <div className="meter-card" style={{ borderColor: getMeterColor(resources.food * 5) }}>
          <div className="meter-header">
            <span className="meter-label">
              <Apple size={15} className="text-emerald-400" />
              <span>FOOD</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.food * 5) }}>
              {resources.food} Sols
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.food * 4.5))}%`, backgroundColor: getMeterColor(resources.food * 5) }}
            />
          </div>
        </div>

        {/* 5. RADIATION */}
        <div className="meter-card" style={{ borderColor: getMeterColor(resources.radiation, true) }}>
          <div className="meter-header">
            <span className="meter-label">
              <ShieldAlert size={15} className={resources.radiation > 40 ? "text-rose-500 animate-pulse" : "text-slate-400"} />
              <span>DOSIMETER</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.radiation, true) }}>
              {resources.radiation} mSv
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.radiation))}%`, backgroundColor: getMeterColor(resources.radiation, true) }}
            />
          </div>
        </div>

        {/* 6. SCIENCE SCORE (TARGET: 300) */}
        <div className="meter-card science-card">
          <div className="meter-header">
            <span className="meter-label">
              <Award size={15} className="text-amber-300 animate-bounce" />
              <span className="text-amber-300 font-bold">SCIENCE (GOAL: 300)</span>
            </span>
            <span className="meter-val text-amber-300 font-extrabold">
              {resources.science} / 300 RP
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill science-fill"
              style={{ width: `${Math.min(100, (resources.science / 300) * 100)}%` }}
            />
          </div>
        </div>

        {/* 7. CREW HEALTH */}
        <div className="meter-card">
          <div className="meter-header">
            <span className="meter-label">
              <HeartPulse size={15} className="text-rose-400" />
              <span>CREW VITALS</span>
            </span>
            <span className="meter-val" style={{ color: getMeterColor(resources.crewHealth) }}>
              {resources.crewHealth}%
            </span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, Math.max(0, resources.crewHealth))}%`, backgroundColor: getMeterColor(resources.crewHealth) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
