// ============================================================
// MissionCampaignModal — Dedicated modal for the 76-Mission Campaign Map
// Displays full interactive Earth-to-Space flight progression
// ============================================================
import React from 'react';
import { X, Rocket } from 'lucide-react';
import { MissionCampaignMap } from './MissionCampaignMap';

interface MissionCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedMissions: string[];
  onLaunchMission: (missionId: string) => void;
}

export const MissionCampaignModal: React.FC<MissionCampaignModalProps> = ({
  isOpen,
  onClose,
  completedMissions,
  onLaunchMission,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/40 text-cyan-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                NASA Mission Campaign · Earth to Deep Space
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                76 Playable Engineering Mini-Games · Mercury (1961) to Artemis III
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Map Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <MissionCampaignMap
            completedMissions={completedMissions}
            onLaunchMission={(id) => {
              onLaunchMission(id);
              onClose();
            }}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
