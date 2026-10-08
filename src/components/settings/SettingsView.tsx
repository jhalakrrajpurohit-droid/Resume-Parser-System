import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sliders,
  Database,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Building2,
  User,
  Info
} from 'lucide-react';
import { AppSettings, UserProfile } from '../../types';
import { AIService } from '../../services/aiService';
import { checkFirebaseConfig } from '../../services/firebase';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetDemoData: () => void;
  user: UserProfile | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
  user,
}) => {
  const [fairScreening, setFairScreening] = useState(settings.fairScreening);
  const [weights, setWeights] = useState({ ...settings.scoreWeights });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ status: string; hasGeminiKey: boolean }>({ status: 'checking', hasGeminiKey: false });
  const [firebaseStatus, setFirebaseStatus] = useState<{ isConfigured: boolean; projectId?: string }>({ isConfigured: false });

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    const health = await AIService.checkHealth();
    setAiStatus(health);

    const fb = await checkFirebaseConfig();
    setFirebaseStatus(fb);
  };

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const totalWeight =
    weights.requiredSkills +
    weights.experience +
    weights.education +
    weights.preferredSkills +
    weights.certifications +
    weights.projects;

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      fairScreening,
      scoreWeights: weights,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure matching algorithms, fair screening policies, and cloud infrastructure connections.
          </p>
        </div>

        <button
          id="save-settings-btn"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully. All candidate evaluations will now reflect these parameters.</span>
        </div>
      )}

      {/* 1. Fair Screening Policy */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Fair & Unbiased Screening Directive (DEI Guardrail)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enforces demographic-blind evaluation in all Gemini AI prompts and scoring engines.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              id="fair-screening-toggle"
              type="checkbox"
              checked={fairScreening}
              onChange={(e) => setFairScreening(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800 block mb-1">Standard Regulatory Notice:</span>
          "Candidate rankings are based strictly on job-relevant technical qualifications, verified work tenure, education, and observable skill proficiency. Protected personal characteristics (including gender, race, age, religion, marital status, or nationality) are permanently excluded from scoring calculations."
        </div>
      </div>

      {/* 2. Custom Scoring Weights */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Explainable Scoring Weights</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calibrate the relative importance of each dimension when calculating candidate match scores.
              </p>
            </div>
          </div>

          <div
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              totalWeight === 100
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            Total: {totalWeight}% {totalWeight !== 100 && '(Target: 100%)'}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {[
            { key: 'requiredSkills', label: 'Required Technical Skills', desc: 'Core competencies stated as mandatory in the job description' },
            { key: 'experience', label: 'Work Experience & Tenure', desc: 'Total relevant years in production or industry roles' },
            { key: 'education', label: 'Academic Qualifications', desc: 'Degree level and relevant technical field of study' },
            { key: 'preferredSkills', label: 'Preferred / Secondary Skills', desc: 'Desirable technologies and secondary frameworks' },
            { key: 'certifications', label: 'Industry Certifications', desc: 'Cloud, technical, or specialized domain credentials' },
            { key: 'projects', label: 'Project Depth & Complexity', desc: 'Demonstrated real-world projects and open-source contributions' },
          ].map((dim) => {
            const val = weights[dim.key as keyof typeof weights];
            return (
              <div key={dim.key} className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{dim.label}</span>
                    <span className="text-slate-400 block text-[11px]">{dim.desc}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={val}
                  onChange={(e) => handleWeightChange(dim.key as any, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Service Connections & Infrastructure */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-400" />
          <span>Service Health & Infrastructure</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Gemini AI Service */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Gemini 3.8 Flash AI Engine</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  aiStatus.hasGeminiKey
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {aiStatus.hasGeminiKey ? 'Active API Key' : 'Local Fallback Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Powers resume parsing, competency extraction, candidate matching, and question synthesis.
            </p>
          </div>

          {/* Firebase Database */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Firebase Firestore & Auth</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  firebaseStatus.isConfigured
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {firebaseStatus.isConfigured ? 'Connected' : 'Local Storage Engine'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Stores candidate dossiers, job requirements, and interview questions.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Demo Data Management */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Demo Data Management</h2>
        <p className="text-xs text-slate-500">
          Restore initial realistic job postings, pre-evaluated candidates, and screening criteria to test the system fresh.
        </p>

        {showResetConfirm ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Reset all requisitions and candidates to original demo state? Current custom candidates will be replaced.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            id="reset-demo-data-btn"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Initial Demo Requisitions & Candidates</span>
          </button>
        )}
      </div>
    </div>
  );
};
