import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  Loader2,
  TrendingUp,
  Layout,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StandaloneResumeAnalysis } from '../../types';
import { SAMPLE_RESUME_TEXTS } from '../../mock/sampleData';
import { AIService } from '../../services/aiService';

export const ResumeAnalyzerView: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [analysis, setAnalysis] = useState<StandaloneResumeAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      setErrorMsg('Please paste or upload resume text to analyze.');
      return;
    }

    setErrorMsg('');
    setIsAuditing(true);

    try {
      const result = await AIService.analyzeResumeStandalone(resumeText);
      setAnalysis(result);
    } catch (err) {
      setErrorMsg('Could not complete resume audit. Please try again.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_RESUME_TEXTS[0]) => {
    setResumeText(sample.text);
    setErrorMsg('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Standalone Resume Audit & Quality Analyzer
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200/60">
              Tool
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit any resume independently for impact metrics, formatting risks, clarity, and market competitiveness.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Paste Resume Content or Select a Sample</span>
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Try sample:</span>
            {SAMPLE_RESUME_TEXTS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(s)}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {s.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={7}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste plain resume text here (experience history, skills list, achievements)..."
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px] leading-relaxed"
        />

        {errorMsg && (
          <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {resumeText.trim().length > 0 ? `${resumeText.split(/\s+/).length} words` : 'Empty input'}
          </span>
          <button
            id="run-resume-audit-btn"
            onClick={handleRunAnalysis}
            disabled={isAuditing || !resumeText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 shadow-xs"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Resume Quality...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Resume Quality Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Executive Overview */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">Overall Impression</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {analysis.overallImpression}
            </p>
          </div>

          {/* Clarity & Quality Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Skill Clarity */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Skill Presentation</span>
                </span>
                <span className="font-bold text-slate-900">{analysis.skillClarity.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${analysis.skillClarity.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                {analysis.skillClarity.feedback}
              </p>
            </div>

            {/* Experience Clarity */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Experience Impact</span>
                </span>
                <span className="font-bold text-slate-900">{analysis.experienceClarity.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${analysis.experienceClarity.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                {analysis.experienceClarity.feedback}
              </p>
            </div>

            {/* Project Quality */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Project Depth</span>
                </span>
                <span className="font-bold text-slate-900">{analysis.projectQuality.score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${analysis.projectQuality.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                {analysis.projectQuality.feedback}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Observed Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <h4 className="font-semibold text-amber-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Weaknesses & Omissions</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Measurable Achievements & Formatting Problems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Missing Measurable Achievements */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <h4 className="font-semibold text-rose-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <span>Missing Measurable Metrics</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.missingMeasurableAchievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Formatting Problems */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-slate-400" />
                <span>Formatting & Hierarchy Risks</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {analysis.potentialFormattingProblems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Recommended Resume Improvements</span>
            </h4>
            <div className="space-y-2">
              {analysis.improvementSuggestions.map((sug, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-md border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
