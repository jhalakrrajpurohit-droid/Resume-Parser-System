import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  Users,
  BookmarkCheck,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Filter
} from 'lucide-react';
import { JobRequirement } from '../../types';

interface JobsViewProps {
  jobs: JobRequirement[];
  onSelectJob?: (job: JobRequirement) => void;
  onViewCandidates?: (jobId: string) => void;
  onScreenForJob?: (job: JobRequirement) => void;
  onStartScreening?: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenAddJob?: () => void;
  onAddNewJob?: () => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onSelectJob,
  onViewCandidates,
  onScreenForJob,
  onStartScreening,
  onDeleteJob,
  onOpenAddJob,
  onAddNewJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleCreateJob = () => {
    if (onOpenAddJob) onOpenAddJob();
    else if (onAddNewJob) onAddNewJob();
  };

  const handleInspectCandidates = (job: JobRequirement) => {
    if (onViewCandidates) onViewCandidates(job.id);
    else if (onSelectJob) onSelectJob(job);
  };

  const handleScreenResumes = (job: JobRequirement) => {
    if (onStartScreening) onStartScreening(job.id);
    else if (onScreenForJob) onScreenForJob(job);
  };

  const handleDelete = (job: JobRequirement) => {
    if (window.confirm(`Are you sure you want to remove the job requisition "${job.title}"?`)) {
      onDeleteJob(job.id);
    }
  };

  const departments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">Job Requisitions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage open roles, analyze criteria with AI, and track applicant pools.
          </p>
        </div>
        <button
          id="jobs-view-add-job-btn"
          onClick={handleCreateJob}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, department, or required skill..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Department:</span>
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between p-5"
          >
            <div>
              {/* Header Badge & Title */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                  {job.department}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 rounded-full">
                  {job.status}
                </span>
              </div>

              <h2 className="text-base font-semibold text-slate-900 tracking-tight leading-snug">
                {job.title}
              </h2>

              {/* Meta details */}
              <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.employmentType} • {job.experienceLevel} ({job.seniority})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.educationRequirement}</span>
                </div>
              </div>

              {/* Required Skills Tags */}
              <div className="mt-3.5">
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Required Competencies
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Metrics & Actions */}
            <div className="mt-5 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{job.applicantsCount}</span> applicants
                </div>
                <div className="flex items-center gap-1 text-emerald-700">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{job.shortlistedCount}</span> shortlisted
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInspectCandidates(job)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors text-center"
                >
                  View Candidates
                </button>
                <button
                  onClick={() => handleScreenResumes(job)}
                  title="Screen Resumes for this Job"
                  className="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/70 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Screen</span>
                </button>
                <button
                  onClick={() => handleDelete(job)}
                  title="Delete Job Requisition"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No matching jobs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or department filter, or create a new job requisition.
          </p>
          <button
            onClick={handleCreateJob}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Job</span>
          </button>
        </div>
      )}
    </div>
  );
};
