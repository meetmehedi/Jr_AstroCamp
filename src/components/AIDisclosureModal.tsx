import React from 'react';
import { Bot, ShieldCheck, X } from 'lucide-react';

interface AIDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDisclosureModal: React.FC<AIDisclosureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Bot size={22} className="text-emerald-400" />
            <span className="modal-title">AI & Open Source Usage Disclosure</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="curriculum-body">
          <p className="modal-intro">
            In compliance with NASA Space Apps Challenge participant guidelines and AI transparency requirements, the breakdown below documents how generative AI and human engineering were combined to build <strong>Outpost Command</strong>:
          </p>

          <table className="disclosure-table">
            <thead>
              <tr>
                <th>Scope / Feature</th>
                <th>AI Model / Tool</th>
                <th>Human Verification & Team Engineering</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Stoichiometric Math & BVAD Models</strong></td>
                <td>Antigravity LLM</td>
                <td>
                  <span className="text-emerald-400 font-semibold">Human Verified:</span> Manually audited consumption rates against NASA/TP-2015-218570 table specifications (0.84 kg O2/day, 3.0 L H2O/day).
                </td>
              </tr>
              <tr>
                <td><strong>Code Scaffolding & Types</strong></td>
                <td>Antigravity (TypeScript)</td>
                <td>
                  <span className="text-emerald-400 font-semibold">Human Engineered:</span> Refactored state machine, authored deterministic 30-sol simulation loop, and created UI layout.
                </td>
              </tr>
              <tr>
                <td><strong>Narrative Comic Dialogue</strong></td>
                <td>Collaborative Draft</td>
                <td>
                  <span className="text-emerald-400 font-semibold">Team Authored:</span> Designed characters (Commander Dadu & Cadet Maya), calibrated reading levels, and paced dilemma branches.
                </td>
              </tr>
              <tr>
                <td><strong>Open Source Assets & Icons</strong></td>
                <td>Lucide Icons, Canvas Confetti</td>
                <td>
                  MIT Licensed open source libraries. Clean SVG rendering with zero external telemetry tracking.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="team-integrity-note">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Integrity Declaration:</strong> All game mechanics, educational design, and scientific calibrations were validated by the team. Tested in private/incognito browsing for zero-friction evaluation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
