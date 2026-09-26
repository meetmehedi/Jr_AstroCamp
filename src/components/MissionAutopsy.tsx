import React, { useEffect } from 'react';
import type { GameState } from '../types/game';
import type { NasaMission } from '../data/nasaMissions';
import { Award, AlertOctagon, RotateCcw, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionAutopsyProps {
  gameState: GameState;
  onRestartMission: () => void;
  currentMission?: NasaMission;
}

export const MissionAutopsy: React.FC<MissionAutopsyProps> = ({ gameState, onRestartMission, currentMission }) => {
  const isVictory = gameState.gameOutcome === 'VICTORY';
  const destName = currentMission?.destinationName ?? 'Lunar South Pole';
  const destLabel = currentMission?.destination ?? 'MOON';
  const outpostLabel = (() => {
    switch (destLabel) {
      case 'MARS':          return 'Martian Expedition';
      case 'EUROPA':        return 'Europa Ocean Outpost';
      case 'TITAN':         return 'Titan Atmospheric Outpost';
      case 'ASTEROID':      return 'Asteroid Mission';
      case 'LAGRANGE':      return 'Lagrange Deep-Space Observatory';
      case 'EARTH_ORBIT':   return 'Low Earth Orbital Flight';
      case 'OUTER_PLANETS': return 'Outer Planets Voyager';
      case 'VENUS':         return 'Venusian Atmospheric Station';
      case 'MERCURY':       return 'Hermian Orbit Station';
      default:              return 'Lunar Flight & Outpost';
    }
  })();

  useEffect(() => {
    if (isVictory) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isVictory]);

  return (
    <div className="autopsy-overlay">
      <div className="autopsy-modal">
        {/* Banner Header */}
        <div className={`autopsy-banner ${isVictory ? 'banner-victory' : 'banner-failure'}`}>
          <div className="banner-icon">
            {isVictory ? (
              <Award size={42} className="text-amber-300 animate-bounce" />
            ) : (
              <AlertOctagon size={42} className="text-rose-400 animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="banner-title">
              {isVictory
                ? `MISSION ACCOMPLISHED: ${outpostLabel.toUpperCase()} CERTIFIED!`
                : 'MISSION DEBRIEF: ACCIDENT INVESTIGATION BOARD (AIB)'}
            </h2>
            <p className="banner-subtitle">
              {isVictory
                ? `Commander Dadu and Cadet Maya successfully completed the ${currentMission?.name || 'NASA'} flight expedition at ${destName} and secured ${gameState.resources.science} Science Research Points!`
                : `Mission operations halted on Sol ${gameState.currentSol}. Reason: ${gameState.failureReason || 'Critical Resource Depletion'}`}
            </p>
          </div>
        </div>

        {/* Explainable AI / Chain-Reaction Attribution Tree */}
        <div className="chain-reaction-section">
          <div className="section-heading">
            <GitBranch size={18} className="text-emerald-400" />
            <span>Root-Cause Chain Reaction Trace (Explainable Mission Log)</span>
          </div>
          <p className="section-caption">
            In space systems engineering, disasters and triumphs are never single events—they are cascading chain reactions of trade-offs.
          </p>

          <div className="chain-timeline">
            {gameState.history.map((entry, idx) => (
              <div key={idx} className="timeline-node">
                <div className="node-sol-badge">SOL {entry.sol}</div>
                <div className="node-card">
                  <div className="node-event-title">{entry.eventTitle}</div>
                  <div className="node-choice-title">
                    <span className="text-emerald-400 font-semibold">Decision: </span>
                    {entry.chosenOption.title}
                  </div>
                  <p className="node-consequence">{entry.chosenOption.consequenceNarrative}</p>
                  <div className="node-insight">
                    <ArrowRight size={13} className="text-cyan-400 shrink-0" />
                    <span>{entry.chosenOption.educationalInsight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate or Remediation Advice */}
        <div className="autopsy-footer-card">
          {isVictory ? (
            <div className="certificate-box">
              <ShieldCheck size={28} className="text-emerald-400" />
              <div>
                <div className="cert-title">Astro Camp NASA Flight Certification: {currentMission?.name || 'Flagship Flight'}</div>
                <div className="cert-desc">
                  Demonstrated mastery of NASA operational flight protocols, closed-loop life support thermodynamics, power management, and scientific exploration at {destName} ({currentMission?.nasaProgram || 'NASA Space Apps Challenge 2026'}).
                </div>
              </div>
            </div>
          ) : (
            <div className="remediation-box">
              <AlertOctagon size={28} className="text-amber-400" />
              <div>
                <div className="remediation-title">Engineering Takeaway for Next Flight:</div>
                <div className="remediation-desc">
                  Always prioritize maintaining an electrical power buffer before allocating resources to heavy science runs or unshielded exterior EVAs.
                </div>
              </div>
            </div>
          )}

          <div className="autopsy-actions">
            <button onClick={onRestartMission} className="restart-btn">
              <RotateCcw size={16} />
              <span>{isVictory ? 'Command Another Mission' : 'Rewind & Try Again (Fail Safely)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
