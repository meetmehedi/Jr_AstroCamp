import React from 'react';
import { BookOpen, GraduationCap, X, CheckCircle2, HelpCircle } from 'lucide-react';

interface TeacherDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDossierModal: React.FC<TeacherDossierModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-cyan-400" />
            <span className="modal-title">Teacher & Classroom Curriculum Dossier</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="curriculum-body">
          <div className="curriculum-callout">
            <BookOpen size={20} className="text-emerald-400 shrink-0" />
            <div>
              <strong>Target Audience:</strong> STEM Classrooms, Science Clubs, and Intergenerational Co-play (Ages 3 to 70+).
              <br />
              <strong>Learning Domain:</strong> Closed-Loop Thermodynamics, Aerospace Engineering Trade-Offs, and Space Weather Preparedness.
            </div>
          </div>

          <div className="curriculum-section">
            <h3>🎯 Core Learning Objectives</h3>
            <ul className="learning-goals-list">
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span><strong>Systems Thinking:</strong> Understand that energy, water, oxygen, and food are coupled together; a choice in power directly affects breathing air.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span><strong>Planetary Day/Night Realities:</strong> Grasp why a 354-hour lunar night makes solar power unfeasible without massive battery storage or surface fission.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span><strong>Radiation Protection:</strong> Learn how physical mass (lunar regolith soil and water blankets) shields human cells from Coronal Mass Ejection proton storms.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span><strong>Explainable Failure Analysis:</strong> Conduct root-cause diagnostic autopsies to determine how early decisions cascaded into mission bottlenecks.</span>
              </li>
            </ul>
          </div>

          <div className="curriculum-section">
            <h3>💬 Suggested Post-Game Classroom Discussion Questions</h3>
            <div className="discussion-box">
              <HelpCircle size={16} className="text-amber-400 shrink-0" />
              <span><em>"On Sol 12, when the solar flare warning was broadcast, what did your team sacrifice: science discovery or radiation safety? Why?"</em></span>
            </div>
            <div className="discussion-box">
              <HelpCircle size={16} className="text-amber-400 shrink-0" />
              <span><em>"Why did the greenhouse stop producing food when the power reserves dropped during the lunar night?"</em></span>
            </div>
            <div className="discussion-box">
              <HelpCircle size={16} className="text-amber-400 shrink-0" />
              <span><em>"If launch rockets cost $10,000 per kilogram, why is it better to harvest lunar ice on the Moon than ship bottled water from Earth?"</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
