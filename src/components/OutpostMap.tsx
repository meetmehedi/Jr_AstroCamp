import React, { useState } from 'react';
import type { OutpostModules, ResourceState } from '../types/game';
import { Sun, Moon } from 'lucide-react';

interface OutpostMapProps {
  currentSol: number;
  modules: OutpostModules;
  resources: ResourceState;
}

export const OutpostMap: React.FC<OutpostMapProps> = ({ currentSol, modules, resources }) => {
  const [selectedModule, setSelectedModule] = useState<'habitat' | 'power' | 'greenhouse' | 'vault' | null>(null);

  const isLunarNight = currentSol >= 16 && currentSol <= 27;

  return (
    <div className={`outpost-map-wrapper ${isLunarNight ? 'lunar-night' : 'lunar-day'}`}>
      {/* Sky & Solar Status Bar */}
      <div className="outpost-environment-badge">
        {isLunarNight ? (
          <div className="env-status night">
            <Moon size={16} className="text-cyan-300 animate-pulse" />
            <span>LUNAR NIGHT: 354-Hour Freeze (-130°C) · Solar Output: 0 kW</span>
          </div>
        ) : (
          <div className="env-status day">
            <Sun size={16} className="text-amber-400 animate-spin-slow" />
            <span>LUNAR DAY: Shackleton Peak of Eternal Light (+120°C) · Solar: Active</span>
          </div>
        )}
      </div>

      {/* 2D Isometric SVG Base Canvas */}
      <div className="svg-canvas-container">
        <svg viewBox="0 0 800 450" className="base-svg-map">
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLunarNight ? "#090d14" : "#1e293b"} />
              <stop offset="100%" stopColor={isLunarNight ? "#030712" : "#0f172a"} />
            </linearGradient>

            <linearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.15)" />
            </linearGradient>

            <linearGradient id="greenhouseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(67, 255, 160, 0.55)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
            </linearGradient>

            <linearGradient id="kilopowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Lunar / Martian Terrain Surface */}
          <ellipse cx="400" cy="270" rx="380" ry="160" fill="url(#groundGrad)" stroke="#334155" strokeWidth="2" />

          {/* Distant Crater Rim */}
          <path
            d="M 50 220 Q 200 130 400 170 T 750 200"
            fill="none"
            stroke={isLunarNight ? "#1e293b" : "#475569"}
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Power Transmission Conduits (Animated) */}
          {/* Power -> Hab */}
          <path
            d="M 220 220 L 400 240"
            stroke={resources.power > 15 ? "#ffb454" : "#ef4444"}
            strokeWidth="3"
            strokeDasharray="6"
            className="conduit-line"
          />
          {/* Hab -> Greenhouse */}
          <path
            d="M 400 240 L 580 230"
            stroke="#43ffa0"
            strokeWidth="3"
            strokeDasharray="6"
            className="conduit-line"
          />
          {/* Hab -> Vault */}
          <path
            d="M 400 240 L 400 360"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6"
            className="conduit-line"
          />

          {/* MODULE 1: POWER GENERATION STATION (Left) */}
          <g
            className="map-node"
            onClick={() => setSelectedModule('power')}
            style={{ cursor: 'pointer' }}
          >
            {/* Base platform */}
            <ellipse cx="200" cy="220" rx="65" ry="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            {/* Solar Tower Mast */}
            <line x1="170" y1="220" x2="170" y2="140" stroke="#94a3b8" strokeWidth="4" />
            {/* Solar Panels (VSAT) */}
            <rect
              x="145"
              y="120"
              width="50"
              height="30"
              rx="4"
              fill={isLunarNight ? "#334155" : "#0284c7"}
              stroke="#38bdf8"
              strokeWidth="2"
              transform="rotate(-15 170 135)"
            />
            {/* Kilopower Reactor Core (Stirling Cylinder) */}
            <rect x="210" y="190" width="30" height="35" rx="5" fill="url(#kilopowerGrad)" filter="url(#glow)" />
            <line x1="225" y1="190" x2="225" y2="165" stroke="#ef4444" strokeWidth="3" />
            <circle cx="225" cy="162" r="5" fill="#f87171" filter="url(#glow)" />
            {/* Label */}
            <text x="200" y="260" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="700">
              ⚡ POWER STATION
            </text>
          </g>

          {/* MODULE 2: CENTRAL HABITAT & ECLSS POD (Center) */}
          <g
            className="map-node"
            onClick={() => setSelectedModule('habitat')}
            style={{ cursor: 'pointer' }}
          >
            {/* Foundation ring */}
            <ellipse cx="400" cy="245" rx="85" ry="40" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* Main Pressurized Inflatable Dome */}
            <path
              d="M 325 240 Q 400 130 475 240 Z"
              fill="url(#domeGrad)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Airlock Vestibule */}
            <rect x="385" y="240" width="30" height="20" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="400" cy="250" r="3" fill={resources.oxygen > 50 ? "#43ffa0" : "#ef4444"} />
            {/* Windows glowing */}
            <circle cx="380" cy="200" r="6" fill="#38bdf8" opacity="0.85" filter="url(#glow)" />
            <circle cx="420" cy="200" r="6" fill="#38bdf8" opacity="0.85" filter="url(#glow)" />
            <text x="400" y="280" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700">
              🏠 CENTRAL HAB & ECLSS
            </text>
          </g>

          {/* MODULE 3: HYDROPONIC GREENHOUSE DOME (Right) */}
          <g
            className="map-node"
            onClick={() => setSelectedModule('greenhouse')}
            style={{ cursor: 'pointer' }}
          >
            {/* Base */}
            <ellipse cx="600" cy="230" rx="70" ry="32" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            {/* Geodesic Dome */}
            <path
              d="M 540 230 Q 600 140 660 230 Z"
              fill="url(#greenhouseGrad)"
              stroke="#43ffa0"
              strokeWidth="2"
            />
            {/* Interior Plant Trays */}
            <ellipse cx="600" cy="225" rx="35" ry="12" fill="#047857" />
            <circle cx="585" cy="215" r="4" fill="#86efac" />
            <circle cx="600" cy="212" r="5" fill="#4ade80" />
            <circle cx="615" cy="214" r="4" fill="#86efac" />
            <text x="600" y="275" textAnchor="middle" fill="#43ffa0" fontSize="12" fontWeight="700">
              🌱 GREENHOUSE
            </text>
          </g>

          {/* MODULE 4: SINTERED REGOLITH STORM VAULT (Bottom) */}
          <g
            className="map-node"
            onClick={() => setSelectedModule('vault')}
            style={{ cursor: 'pointer' }}
          >
            {/* Mound of Sintered Lunar Soil */}
            <path
              d="M 310 370 Q 400 300 490 370 Z"
              fill="#334155"
              stroke="#94a3b8"
              strokeWidth="3"
            />
            {/* Blast Door Entrance */}
            <rect x="380" y="345" width="40" height="25" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="400" cy="357" r="4" fill={resources.radiation < 50 ? "#43ffa0" : "#ef4444"} />
            <text x="400" y="395" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700">
              🛡️ REGOLITH STORM VAULT
            </text>
          </g>
        </svg>
      </div>

      {/* Module Inspector Drawer */}
      {selectedModule && (
        <div className="module-inspector-modal">
          <div className="inspector-content">
            <button className="inspector-close" onClick={() => setSelectedModule(null)}>✕</button>
            {selectedModule === 'power' && (
              <>
                <div className="inspector-title text-amber-400">⚡ Power Generation Array</div>
                <p className="inspector-desc">
                  Combines Vertical Solar Array Technology (VSAT) for daytime tracking and a 10 kWe Kilopower Fission Core for the 354-hour lunar night.
                </p>
                <div className="inspector-metrics">
                  <div>Status: <span className="text-emerald-400">{modules.powerStation.status}</span></div>
                  <div>Output: <span className="text-amber-400">{resources.power}% Storage</span></div>
                  <div>Night Mode: <span className="text-cyan-400">{isLunarNight ? 'Active (Nuclear)' : 'Daytime (Solar)'}</span></div>
                </div>
              </>
            )}
            {selectedModule === 'habitat' && (
              <>
                <div className="inspector-title text-sky-400">🏠 Habitat & ECLSS Life Support</div>
                <p className="inspector-desc">
                  Multi-chamber inflatable habitat featuring active $CO_2$ scrubbers, water catalytic oxidizer, and dual-redundancy airlocks.
                </p>
                <div className="inspector-metrics">
                  <div>Atmosphere: <span className="text-sky-400">101.3 kPa (Nominal)</span></div>
                  <div>Oxygen Level: <span className="text-emerald-400">{resources.oxygen}%</span></div>
                  <div>Water Reserves: <span className="text-cyan-400">{resources.water}%</span></div>
                </div>
              </>
            )}
            {selectedModule === 'greenhouse' && (
              <>
                <div className="inspector-title text-emerald-400">🌱 Bioregenerative Greenhouse</div>
                <p className="inspector-desc">
                  Closed-loop hydroponics pod growing dwarf wheat, sweet potatoes, and microgreens. Transpires drinkable water while scrubbing crew $CO_2$.
                </p>
                <div className="inspector-metrics">
                  <div>Growth Cycle: <span className="text-emerald-400">Healthy Sprouting</span></div>
                  <div>Rations Buffer: <span className="text-amber-400">{resources.food} Sols remaining</span></div>
                  <div>LED Spectrum: <span className="text-purple-400">UV + Deep Red Optimized</span></div>
                </div>
              </>
            )}
            {selectedModule === 'vault' && (
              <>
                <div className="inspector-title text-slate-300">🛡️ Sintered Regolith Storm Shelter</div>
                <p className="inspector-desc">
                  Subterranean vault buried beneath 2 meters of laser-melted lunar regolith. Water-jacketed blast doors protect against Coronal Mass Ejections.
                </p>
                <div className="inspector-metrics">
                  <div>Shielding: <span className="text-emerald-400">200 cm Sintered Regolith</span></div>
                  <div>Crew Dosimeter: <span className="text-amber-400">{resources.radiation} mSv</span></div>
                  <div>Vault Seal: <span className="text-cyan-400">Ready for Emergency Evacuation</span></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
