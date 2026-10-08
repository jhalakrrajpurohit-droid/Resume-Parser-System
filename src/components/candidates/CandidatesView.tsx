import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  BookmarkCheck,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Candidate, JobRequirement } from '../../types';

interface CandidatesViewProps {
  candidates: Candidate[];
  jobs: JobRequirement[];
  selectedJobId?: string;
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateStatus: (candidateId: string, status: Candidate['pipelineStatus']) => void;
  onCompareCandidates: (candidates: Candidate[]) => void;
  onNavigateTab: (tab: any) => void;
  shortlistedOnly?: boolean;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  candidates,
  jobs,
  selectedJobId,
  onSelectCandidate,
  onUpdateStatus,
  onCompareCandidates,
  onNavigateTab,
  shortlistedOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState<string>(selectedJobId || 'All');
  const [scoreFilter, setScoreFilter] = useState<string>('All');
  const [experienceFilter, setExperienceFilter] = useState<string>('All');
  const [recFilter, setRecFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>(shortlistedOnly ? 'Shortlisted' : 'All');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'name' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  React.useEffect(() => {
    if (selectedJobId) {
      setJobFilter(selectedJobId);
    }
  }, [selectedJobId]);

  // Multi-selection for comparison
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        if (shortlistedOnly && c.pipelineStatus !== 'Shortlisted') return false;

        const matchesJob = jobFilter === 'All' || c.jobId === jobFilter;

        const matchesSearch =
          c.structuredResume.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.structuredResume.technicalSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          c.structuredResume.location.toLowerCase().includes(searchQuery.toLowerCase());

        const score = c.evaluation.scores.overall;
        let matchesScore = true;
        if (scoreFilter === '85+') matchesScore = score >= 85;
        else if (scoreFilter === '70-84') matchesScore = score >= 70 && score < 85;
        else if (scoreFilter === '50-69') matchesScore = score >= 50 && score < 70;
        else if (scoreFilter === '<50') matchesScore = score < 50;

        const exp = c.structuredResume.totalExperienceYears;
        let matchesExp = true;
        if (experienceFilter === '<3') matchesExp = exp < 3;
        else if (experienceFilter === '3-5') matchesExp = exp >= 3 && exp <= 5;
        else if (experienceFilter === '5+') matchesExp = exp > 5;

        const matchesRec = recFilter === 'All' || c.evaluation.recommendation === recFilter;
        const matchesStatus = statusFilter === 'All' || c.pipelineStatus === statusFilter;

        return matchesJob && matchesSearch && matchesScore && matchesExp && matchesRec && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'score') diff = a.evaluation.scores.overall - b.evaluation.scores.overall;
        else if (sortBy === 'experience') diff = a.structuredResume.totalExperienceYears - b.structuredResume.totalExperienceYears;
        else if (sortBy === 'name') diff = a.structuredResume.candidateName.localeCompare(b.structuredResume.candidateName);
        else if (sortBy === 'date') diff = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();

        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [candidates, jobFilter, searchQuery, scoreFilter, experienceFilter, recFilter, statusFilter, sortBy, sortOrder, shortlistedOnly]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  };

  const handleTriggerCompare = () => {
    const selectedObjects = candidates.filter((c) => selectedIds.includes(c.id));
    if (selectedObjects.length >= 2) {
      onCompareCandidates(selectedObjects);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Job Title', 'Overall Score', 'Recommendation', 'Experience (Years)', 'Status', 'Email'];
    const rows = filteredCandidates.map((c) => [
      `"${c.structuredResume.candidateName}"`,
      `"${c.jobTitle}"`,
      c.evaluation.scores.overall,
      `"${c.evaluation.recommendation}"`,
      c.structuredResume.totalExperienceYears,
      `"${c.pipelineStatus}"`,
      `"${c.structuredResume.email}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hirelens_candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRecBadgeClass = (rec: Candidate['evaluation']['recommendation']) => {
    switch (rec) {
      case 'Strongly Recommended':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Recommended':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Consider':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Low Match':
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {shortlistedOnly ? 'Shortlisted Candidates' : 'Candidate Rankings & Profiles'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {shortlistedOnly
              ? 'High-priority candidates selected for hiring manager interviews and advancement.'
              : 'Ranked candidate pool scored by job-relevant qualifications and explainable criteria.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab('screening')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Screen More Resumes</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, skill, or location..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Job Requisition Selector */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Job Requisitions</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Score Range */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none"
          >
            <option value="All">Match: All Scores</option>
            <option value="85+">85%+ (Strong Match)</option>
            <option value="70-84">70% - 84% (Moderate)</option>
            <option value="50-69">50% - 69% (Consider)</option>
            <option value="<50">&lt;50% (Low Match)</option>
          </select>

          {/* Experience Range */}
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none"
          >
            <option value="All">Exp: Any Experience</option>
            <option value="<3">&lt; 3 years</option>
            <option value="3-5">3 - 5 years</option>
            <option value="5+">5+ years</option>
          </select>

          {/* Recommendation */}
          <select
            value={recFilter}
            onChange={(e) => setRecFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none"
          >
            <option value="All">Recommendation: All</option>
            <option value="Strongly Recommended">Strongly Recommended</option>
            <option value="Recommended">Recommended</option>
            <option value="Consider">Consider</option>
            <option value="Low Match">Low Match</option>
          </select>

          {/* Pipeline Status (if not shortlistedOnly) */}
          {!shortlistedOnly && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Screened">Screened</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}

          {/* Sort Control */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none"
            >
              <option value="score">Match Score</option>
              <option value="experience">Experience</option>
              <option value="name">Name</option>
              <option value="date">Date Analyzed</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title={`Sorting ${sortOrder === 'desc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar (when candidates selected) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-20 bg-slate-900 text-white px-4 py-2.5 rounded-lg border border-slate-800 shadow-md flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.length}</span>
            <span>candidate{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerCompare}
              disabled={selectedIds.length < 2 || selectedIds.length > 5}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded font-medium transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compare Side-by-Side {selectedIds.length >= 2 ? `(${selectedIds.length})` : '(Select 2-5)'}</span>
            </button>

            <button
              onClick={() => {
                selectedIds.forEach((id) => onUpdateStatus(id, 'Shortlisted'));
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            >
              Shortlist Selected
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1.5 text-slate-400 hover:text-white"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Candidates Table (Responsive) */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button onClick={toggleSelectAll} className="p-0.5 text-slate-400 hover:text-slate-700">
                    {selectedIds.length > 0 && selectedIds.length === filteredCandidates.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3 w-12 text-center">Rank</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Job Requisition</th>
                <th className="p-3">Match Score</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Recommendation</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate, idx) => {
                const isSelected = selectedIds.includes(candidate.id);
                const score = candidate.evaluation.scores.overall;

                return (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleSelect(candidate.id)}
                        className="p-0.5 text-slate-400 hover:text-slate-700"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="p-3 text-center font-medium text-slate-400">
                      #{idx + 1}
                    </td>

                    {/* Candidate Name & Contact */}
                    <td className="p-3">
                      <div
                        onClick={() => onSelectCandidate(candidate)}
                        className="font-medium text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {candidate.structuredResume.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{candidate.structuredResume.email}</span>
                        <span>•</span>
                        <span>{candidate.structuredResume.location}</span>
                      </div>
                    </td>

                    {/* Job Requisition */}
                    <td className="p-3">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">
                        {candidate.jobTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Uploaded {candidate.uploadDate}
                      </div>
                    </td>

                    {/* Match Score */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              score >= 88
                                ? 'bg-emerald-500'
                                : score >= 75
                                ? 'bg-blue-500'
                                : score >= 60
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800 w-8">{score}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {candidate.evaluation.matchedCompetenciesCount} of {candidate.evaluation.totalCompetenciesCount} skills
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="p-3 font-medium text-slate-700">
                      {candidate.structuredResume.totalExperienceYears} yrs
                    </td>

                    {/* Recommendation Badge */}
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getRecBadgeClass(candidate.evaluation.recommendation)}`}>
                        {candidate.evaluation.recommendation}
                      </span>
                    </td>

                    {/* Pipeline Status Dropdown */}
                    <td className="p-3">
                      <select
                        value={candidate.pipelineStatus}
                        onChange={(e) => onUpdateStatus(candidate.id, e.target.value as any)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="Screened">Screened</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-4">
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="p-10 text-center space-y-2.5">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              {shortlistedOnly ? 'No candidates shortlisted yet' : 'No candidates match your current filters'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {shortlistedOnly
                ? 'Review candidates from the candidate pool and mark them as Shortlisted, or screen new resumes.'
                : 'Try clearing your search terms, changing the job requisition filter, or uploading new candidate resumes.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              {shortlistedOnly ? (
                <button
                  onClick={() => onNavigateTab('candidates')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                >
                  View Candidate Pool
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setJobFilter('All');
                      setScoreFilter('All');
                      setExperienceFilter('All');
                      setRecFilter('All');
                      setStatusFilter('All');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => onNavigateTab('screening')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Screen New Resumes
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
