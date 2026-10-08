import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Download,
  AlertTriangle,
  Award,
  Briefcase,
  GraduationCap,
  Layers,
  Loader2
} from 'lucide-react';
import { Candidate, JobRequirement } from '../../types';
import { AIService } from '../../services/aiService';

interface CandidateComparisonModalProps {
  candidates: Candidate[];
  job?: JobRequirement;
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateComparisonModal: React.FC<CandidateComparisonModalProps> = ({
  candidates,
  job,
  isOpen,
  onClose,
  onSelectCandidate,
}) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [differentiators, setDifferentiators] = useState<string[]>([]);
  const [recommendedName, setRecommendedName] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (isOpen && candidates.length >= 2 && job) {
      loadComparisonSummary();
    }
  }, [isOpen, candidates, job]);

  const loadComparisonSummary = async () => {
    if (!job) return;
    setIsLoadingSummary(true);
    try {
      const res = await AIService.compareCandidates(job, candidates);
      setAiSummary(res.summary);
      setDifferentiators(res.differentiators || []);
      setRecommendedName(res.recommendedCandidate || '');
    } catch (err) {
      console.error('Failed to load comparison summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  if (!isOpen || candidates.length === 0) return null;

  const handleExportComparison = () => {
    const text = `HIRELENS AI - CANDIDATE COMPARISON REPORT
Target Job: ${job?.title || 'Open Position'}
Date: ${new Date().toLocaleDateString()}

AI COMPARATIVE SUMMARY:
${aiSummary}

CANDIDATES EVALUATED:
${candidates
  .map(
    (c, i) => `
#${i + 1} ${c.structuredResume.candidateName}
- Overall Match: ${c.evaluation.scores.overall}% (${c.evaluation.recommendation})
- Required Skills Score: ${c.evaluation.scores.requiredSkills}%
- Experience: ${c.structuredResume.totalExperienceYears} years
- Key Fit: ${c.evaluation.goodFitReasons.slice(0, 2).join('; ')}
- Gaps: ${c.evaluation.missingRequirements.join(', ') || 'None identified'}
`
  )
  .join('\n')}
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirelens_comparison_${candidates.length}_candidates.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span>Side-by-Side Candidate Comparison</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                {candidates.length} Candidates
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating candidate trade-offs and competencies for <strong className="text-slate-700">{job?.title}</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportComparison}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Comparative Summary Box */}
        <div className="p-5 bg-blue-50/40 border-b border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                AI Executive Comparative Synthesis
              </h3>
            </div>
            {recommendedName && (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-200">
                Top Recommendation: {recommendedName}
              </span>
            )}
          </div>

          {isLoadingSummary ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Synthesizing comparative trade-offs...</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {aiSummary || 'Candidates evaluated side by side. Compare technical competencies, seniority levels, and experience profiles below.'}
            </p>
          )}

          {differentiators.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-medium">Key Differentiators:</span>
              {differentiators.map((diff, i) => (
                <span key={i} className="px-2 py-0.5 bg-white text-slate-700 rounded border border-slate-200 text-[11px]">
                  {diff}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-6 text-xs sm:text-sm">
          <table className="w-full text-left border-collapse border border-slate-200 rounded-lg">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="p-3 w-44 font-semibold text-xs border border-slate-200">Dimension</th>
                {candidates.map((c) => (
                  <th key={c.id} className="p-3 font-semibold text-xs border border-slate-200 min-w-[200px]">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-900 font-bold text-sm">{c.structuredResume.candidateName}</span>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectCandidate(c);
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800 underline"
                      >
                        Profile
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                      {c.structuredResume.location}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
              {/* Overall Score */}
              <tr className="bg-white">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Overall Match</td>
                {candidates.map((c) => {
                  const score = c.evaluation.scores.overall;
                  return (
                    <td key={c.id} className="p-3 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">{score}%</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            score >= 88
                              ? 'bg-emerald-100 text-emerald-800'
                              : score >= 75
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.evaluation.recommendation}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Required Skills Match */}
              <tr className="bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Required Skills</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 border border-slate-200">
                    <span className="font-semibold text-slate-900">{c.evaluation.scores.requiredSkills}%</span>
                    <span className="text-slate-500 text-[11px] block">
                      Matched {c.evaluation.matchedCompetenciesCount} of {c.evaluation.totalCompetenciesCount} skills
                    </span>
                  </td>
                ))}
              </tr>

              {/* Total Experience */}
              <tr className="bg-white">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Experience Tenure</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 border border-slate-200">
                    <span className="font-semibold text-slate-900">{c.structuredResume.totalExperienceYears} years</span>
                    <span className="text-slate-400 text-[11px] block">
                      Score: {c.evaluation.scores.experience}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Education */}
              <tr className="bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Education</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 border border-slate-200">
                    {c.structuredResume.education.map((edu, i) => (
                      <div key={i} className="mb-1 text-slate-800">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="text-slate-500 block text-[11px]">{edu.institution} ({edu.year})</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Primary Strengths */}
              <tr className="bg-white">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Primary Strengths</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 border border-slate-200">
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {c.evaluation.goodFitReasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Missing Competencies */}
              <tr className="bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Gaps / Missing</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 border border-slate-200">
                    {c.evaluation.missingRequirements && c.evaluation.missingRequirements.length > 0 ? (
                      <ul className="space-y-1 text-[11px] text-rose-700">
                        {c.evaluation.missingRequirements.map((gap, i) => (
                          <li key={i}>• {gap}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-emerald-700 font-medium text-[11px]">All criteria matched</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Recent Company */}
              <tr className="bg-white">
                <td className="p-3 font-semibold text-slate-800 border border-slate-200">Most Recent Role</td>
                {candidates.map((c) => {
                  const recent = c.structuredResume.workExperience[0];
                  return (
                    <td key={c.id} className="p-3 border border-slate-200">
                      {recent ? (
                        <div>
                          <span className="font-semibold text-slate-900">{recent.role}</span>
                          <span className="text-slate-500 block text-[11px]">{recent.company} ({recent.period})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
