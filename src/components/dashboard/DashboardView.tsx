import React from 'react';
import {
  Briefcase,
  Users,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { Candidate, JobRequirement, UserProfile } from '../../types';

interface DashboardViewProps {
  jobs: JobRequirement[];
  candidates: Candidate[];
  user?: UserProfile | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectJob?: (job: JobRequirement) => void;
  onNavigateTab: (tab: any) => void;
  onStartScreening?: (jobId: string) => void;
  onAddNewJob?: () => void;
  onOpenAddJob?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  candidates,
  onSelectCandidate,
  onSelectJob,
  onNavigateTab,
  onStartScreening,
  onAddNewJob,
  onOpenAddJob,
}) => {
  const handleOpenAddJob = onAddNewJob || onOpenAddJob || (() => onNavigateTab('jobs'));

  const activeJobs = jobs.filter((j) => j.status === 'Active');
  const shortlisted = candidates.filter(
    (c) => c.pipelineStatus === 'Shortlisted' || c.pipelineStatus === 'Interviewing' || c.pipelineStatus === 'Offer' || c.pipelineStatus === 'Hired'
  );
  const interviews = candidates.filter((c) => c.pipelineStatus === 'Interviewing');
  const hired = candidates.filter((c) => c.pipelineStatus === 'Hired');

  // Sorted top candidates by overall match score
  const topCandidates = [...candidates]
    .sort((a, b) => b.evaluation.scores.overall - a.evaluation.scores.overall)
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900">
      {/* High Density Metric Cards: 5 columns */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Active Jobs */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Requisitions</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{activeJobs.length}</p>
          <div className="flex items-center mt-2 text-slate-500 text-[11px]">
            <span>{jobs.length} total roles</span>
          </div>
        </div>

        {/* Candidates */}
        <div
          onClick={() => onNavigateTab('candidates')}
          className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Candidate Pool</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{candidates.length}</p>
          <div className="flex items-center mt-2 text-slate-500 text-[11px]">
            <span>Total applicants parsed</span>
          </div>
        </div>

        {/* Shortlisted */}
        <div
          onClick={() => onNavigateTab('shortlist')}
          className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shortlisted</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{shortlisted.length}</p>
          <div className="flex items-center mt-2 text-emerald-600 text-[11px] font-medium">
            <span>Qualified candidates</span>
          </div>
        </div>

        {/* Interviews */}
        <div
          onClick={() => onNavigateTab('candidates')}
          className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Interview Loop</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{interviews.length}</p>
          <div className="flex items-center mt-2 text-blue-600 text-[11px] font-medium">
            <span>Active evaluations</span>
          </div>
        </div>

        {/* Hired */}
        <div
          onClick={() => onNavigateTab('candidates')}
          className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs cursor-pointer hover:border-slate-300 transition-all col-span-2 sm:col-span-1"
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offers & Hired</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{hired.length}</p>
          <div className="flex items-center mt-2 text-emerald-600 text-[11px] font-medium">
            <span>Completed pipeline</span>
          </div>
        </div>
      </section>

      {/* Main Grid: 2/3 Recent Jobs Table & 1/3 Top AI Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left: Recent Jobs (Col-span 2) */}
        <section className="lg:col-span-2 bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Recent Job Requisitions</h2>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Jobs
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            {jobs.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                    <th className="px-4 py-2.5">Job Title</th>
                    <th className="px-4 py-2.5">Department</th>
                    <th className="px-4 py-2.5 text-center">Applicants</th>
                    <th className="px-4 py-2.5 text-center">Shortlisted</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {jobs.slice(0, 5).map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob && onSelectJob(job)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="hover:text-blue-600 transition-colors">{job.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{job.experienceLevel} • {job.location}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{job.department}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800">{job.applicantsCount}</td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-700">{job.shortlistedCount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            job.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : job.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-700">No job requisitions created yet</p>
                <p className="text-xs text-slate-400">Create your first role to begin screening resumes.</p>
                <button
                  onClick={handleOpenAddJob}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Job</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs px-4">
            <span className="text-slate-500">Showing {Math.min(jobs.length, 5)} of {jobs.length} active roles</span>
            <button
              onClick={handleOpenAddJob}
              className="font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Role</span>
            </button>
          </div>
        </section>

        {/* Right: Top AI Matches */}
        <section className="bg-white rounded-lg border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Top Candidate Matches</h2>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                Explainable AI
              </span>
            </div>

            {topCandidates.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {topCandidates.map((c) => {
                  const score = c.evaluation.scores.overall;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCandidate(c)}
                      className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {c.structuredResume.candidateName}
                        </h3>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {score}%
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-2 mt-0.5">
                        {c.jobTitle} • {c.structuredResume.totalExperienceYears} yrs exp
                      </p>

                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 88 ? 'bg-emerald-500' : score >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            score >= 88
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                              : score >= 75
                              ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                              : 'bg-amber-50 text-amber-700 border-amber-200/60'
                          }`}
                        >
                          {c.evaluation.recommendation}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.evaluation.matchedCompetenciesCount}/{c.evaluation.totalCompetenciesCount} skills
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-700">No screened candidates yet</p>
                <p className="text-xs text-slate-400">Upload resumes to see AI candidate matches.</p>
                <button
                  onClick={() => onNavigateTab('screening')}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Screening</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigateTab('candidates')}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Candidates</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
