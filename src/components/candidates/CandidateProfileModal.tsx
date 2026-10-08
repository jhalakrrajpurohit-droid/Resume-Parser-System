import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Candidate, JobRequirement, InterviewQuestion } from '../../types';
import { AIService } from '../../services/aiService';

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  job?: JobRequirement;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (candidateId: string, status: Candidate['pipelineStatus']) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  job,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'skillGaps' | 'scores' | 'experience' | 'questions'>('match');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  if (!isOpen || !candidate) return null;

  const score = candidate.evaluation.scores.overall;

  const handleGenerateQuestions = async () => {
    if (!job) return;
    setIsLoadingQuestions(true);
    try {
      const generated = await AIService.generateInterviewQuestions(job, candidate);
      setQuestions(generated);
    } catch (err) {
      console.error('Failed to generate interview questions:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const copyQuestion = (q: InterviewQuestion) => {
    const text = `Question: ${q.question}\nContext: ${q.context}\nEvaluation Criteria: ${q.sampleAnswerCriteria}`;
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(q.id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const getScoreColor = (val: number) => {
    if (val >= 88) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 75) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (val >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  const getRecBadgeClass = (rec: Candidate['evaluation']['recommendation']) => {
    switch (rec) {
      case 'Strongly Recommended':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Recommended':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Consider':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low Match':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-slate-800 text-white flex items-center justify-center font-semibold text-sm shrink-0">
              {candidate.structuredResume.candidateName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {candidate.structuredResume.candidateName}
                </h2>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRecBadgeClass(candidate.evaluation.recommendation)}`}>
                  {candidate.evaluation.recommendation}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Applied for <strong className="text-slate-700">{candidate.jobTitle}</strong> • {candidate.structuredResume.totalExperienceYears} years experience
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {candidate.structuredResume.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {candidate.structuredResume.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {candidate.structuredResume.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Overall Match</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{score}%</span>
              </div>
              <button
                id="close-candidate-modal-btn"
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pipeline Status Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-md">
              <span className="text-[11px] text-slate-400 pl-1">Status:</span>
              <select
                value={candidate.pipelineStatus}
                onChange={(e) => onUpdateStatus(candidate.id, e.target.value as any)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="Screened">Screened</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 bg-white border-b border-slate-200 flex space-x-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('match')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'match'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable AI Match</span>
          </button>

          <button
            onClick={() => setActiveTab('skillGaps')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'skillGaps'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skill Gap Analysis ({candidate.evaluation.matchedCompetenciesCount}/{candidate.evaluation.totalCompetenciesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'scores'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Score Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'experience'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work History & Education</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('questions');
              if (questions.length === 0) handleGenerateQuestions();
            }}
            className={`py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'questions'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Interview Questions</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm">
          {/* TAB 1: AI Match & Evidence */}
          {activeTab === 'match' && (
            <div className="space-y-5">
              {/* Executive Summary Box */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">AI Screening Assessment</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {candidate.evaluation.aiExplanation}
                </p>
              </div>

              {/* Good Fit Reasons & Concerns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Good Fit Reasons */}
                <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                  <h4 className="font-semibold text-emerald-900 text-xs flex items-center gap-1.5 mb-2.5 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Why Good Fit</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-900/90">
                    {candidate.evaluation.goodFitReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Potential Concerns */}
                <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/60">
                  <h4 className="font-semibold text-amber-900 text-xs flex items-center gap-1.5 mb-2.5 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Potential Concerns / Gaps</span>
                  </h4>
                  {candidate.evaluation.potentialConcerns && candidate.evaluation.potentialConcerns.length > 0 ? (
                    <ul className="space-y-2 text-xs text-amber-900/90">
                      {candidate.evaluation.potentialConcerns.map((concern, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-amber-800/80 italic">No significant concerns observed.</p>
                  )}
                </div>
              </div>

              {/* Observable Resume Evidence */}
              {candidate.evaluation.resumeEvidence && candidate.evaluation.resumeEvidence.length > 0 && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Direct Evidence from Resume</span>
                  </h4>
                  <div className="space-y-2">
                    {candidate.evaluation.resumeEvidence.map((ev, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded border border-slate-200/70 text-xs text-slate-700 italic">
                        "{ev}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Skill Gap Analysis */}
          {activeTab === 'skillGaps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Competency & Skill Gap Analysis</h3>
                  <p className="text-xs text-slate-500">
                    Matches candidate skills against target requirements for "{candidate.jobTitle}".
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200/60">
                    {candidate.evaluation.matchedCompetenciesCount} of {candidate.evaluation.totalCompetenciesCount} Matched
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {candidate.evaluation.skillGaps.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        {item.status === 'matched' && (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                        {item.status === 'partial' && (
                          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            ~
                          </div>
                        )}
                        {item.status === 'missing' && (
                          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {item.skill}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-medium text-slate-700">Evidence: </span>
                            {item.evidenceFromResume || item.evidence}
                          </div>
                          {item.missingRequirement && item.missingRequirement !== 'None' && item.missingRequirement !== 'None - verified in professional work history' && (
                            <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60 inline-block">
                              <span className="font-medium">Gap Analysis: </span>
                              {item.missingRequirement}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                        {item.confidence && (
                          <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.confidence}% conf.
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                            item.status === 'matched'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : item.status === 'partial'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Score Breakdown & Structured Evidence */}
          {activeTab === 'scores' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                <span>Deterministic Scoring Engine: Weights applied across 6 core criteria with structured audit evidence.</span>
                <span className="font-mono text-slate-500 text-[11px]">temp: 0.0</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'requiredSkills', label: 'Required Skills Match (40% weight)', score: candidate.evaluation.scores.requiredSkills, evidence: candidate.evaluation.scoreEvidence?.requiredSkills },
                  { key: 'experience', label: 'Experience Tenure & Seniority (25% weight)', score: candidate.evaluation.scores.experience, evidence: candidate.evaluation.scoreEvidence?.experience },
                  { key: 'education', label: 'Education & Academic Alignment (15% weight)', score: candidate.evaluation.scores.education, evidence: candidate.evaluation.scoreEvidence?.education },
                  { key: 'preferredSkills', label: 'Preferred / Secondary Skills (10% weight)', score: candidate.evaluation.scores.preferredSkills, evidence: candidate.evaluation.scoreEvidence?.preferredSkills },
                  { key: 'projectRelevance', label: 'Project Depth & Complexity (5% weight)', score: candidate.evaluation.scores.projectRelevance, evidence: candidate.evaluation.scoreEvidence?.projectRelevance },
                  { key: 'certifications', label: 'Relevant Certifications (5% weight)', score: candidate.evaluation.scores.certifications, evidence: candidate.evaluation.scoreEvidence?.certifications },
                ].map((dim, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{dim.label}</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">{dim.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          dim.score >= 85 ? 'bg-emerald-500' : dim.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>

                    {/* Structured Evidence Block */}
                    {dim.evidence && (
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 bg-slate-50/60 p-2.5 rounded border border-slate-200/50">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            <strong className="text-slate-700">Requirement:</strong> {dim.evidence.matchedRequirement}
                          </span>
                          <span className="font-mono text-slate-400 shrink-0 ml-2">
                            {dim.evidence.confidence}% conf.
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <strong className="text-slate-700">Resume Evidence:</strong> {dim.evidence.evidenceFromResume}
                        </div>
                        {dim.evidence.missingRequirement && dim.evidence.missingRequirement !== 'None' && (
                          <div className="text-[11px] text-amber-800">
                            <strong className="text-amber-900">Missing / Note:</strong> {dim.evidence.missingRequirement}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Work Experience & Education */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Summary */}
              {candidate.structuredResume.summary && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                    {candidate.structuredResume.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Work Experience
                </h4>
                <div className="space-y-4">
                  {candidate.structuredResume.workExperience.map((exp, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-slate-900 text-xs sm:text-sm">{exp.role}</h5>
                          <div className="text-xs text-slate-500 font-medium">{exp.company}</div>
                        </div>
                        <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                          {exp.period} ({exp.years} yrs)
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-600">{exp.description}</p>
                      )}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                          {exp.highlights.map((hl, hIdx) => (
                            <li key={hIdx}>{hl}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Education & Academic Credentials
                </h4>
                <div className="space-y-2">
                  {candidate.structuredResume.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{edu.degree} in {edu.field}</div>
                        <div className="text-slate-500">{edu.institution}</div>
                      </div>
                      <div className="text-right text-slate-400">
                        <span>Class of {edu.year}</span>
                        {edu.gpa && <span className="block font-medium text-slate-600">GPA {edu.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills tags */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Extracted Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.structuredResume.technicalSkills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI Interview Questions */}
          {activeTab === 'questions' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200/80">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Tailored Interview Questions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synthesized by Gemini AI based on candidate's specific resume and identified skill gaps.
                  </p>
                </div>
                <button
                  id="regenerate-interview-questions-btn"
                  onClick={handleGenerateQuestions}
                  disabled={isLoadingQuestions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
                >
                  {isLoadingQuestions ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Probes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Regenerate Questions</span>
                    </>
                  )}
                </button>
              </div>

              {isLoadingQuestions && (
                <div className="p-8 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-500">Formulating role-specific interview probes...</p>
                </div>
              )}

              {!isLoadingQuestions && questions.length > 0 && (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id || idx} className="p-4 bg-white border border-slate-200 rounded-lg space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {q.category}
                          </span>
                        </div>
                        <button
                          onClick={() => copyQuestion(q)}
                          className="text-xs text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          {copiedQuestionId === q.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Question</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        "{q.question}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded">
                          <span className="font-semibold text-slate-700 block mb-0.5">Why Ask:</span>
                          <span className="text-slate-600">{q.context}</span>
                        </div>
                        <div className="bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                          <span className="font-semibold text-emerald-800 block mb-0.5">Evaluation Criteria:</span>
                          <span className="text-emerald-900">{q.sampleAnswerCriteria}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Source file: <strong className="text-slate-700">{candidate.resumeFileName}</strong> ({candidate.resumeFileSize || 'PDF'})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded font-medium transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
