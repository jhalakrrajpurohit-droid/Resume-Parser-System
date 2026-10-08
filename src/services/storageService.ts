import { JobRequirement, Candidate, AppSettings, UserProfile, InterviewQuestion } from '../types';
import { INITIAL_JOBS, INITIAL_CANDIDATES } from '../mock/sampleData';

const STORAGE_KEYS = {
  JOBS: 'hirelens_jobs_v1',
  CANDIDATES: 'hirelens_candidates_v1',
  SETTINGS: 'hirelens_settings_v1',
  USER: 'hirelens_user_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  fairScreening: true,
  scoreWeights: {
    requiredSkills: 40,
    experience: 25,
    education: 15,
    preferredSkills: 10,
    certifications: 5,
    projects: 5,
  },
  enableFirebaseSync: false,
  theme: 'light',
};

export const DEFAULT_USER: UserProfile = {
  uid: 'usr-hr-01',
  email: 'sarah.jenkins@acmetalent.com',
  displayName: 'Sarah Jenkins',
  role: 'Senior Talent Acquisition Manager',
  organization: 'Acme Talent Solutions',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  isDemoUser: true,
};

export class StorageService {
  // Jobs
  static getJobs(): JobRequirement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!data) {
        this.saveJobs(INITIAL_JOBS);
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JOBS;
    }
  }

  static saveJobs(jobs: JobRequirement[]): void {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }

  static getJob(id: string): JobRequirement | undefined {
    return this.getJobs().find((j) => j.id === id);
  }

  static initializeDefaults(): void {
    this.getJobs();
    this.getCandidates();
    this.getSettings();
    this.getUser();
  }

  static saveJob(job: JobRequirement): JobRequirement[] {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    this.saveJobs(jobs);
    return jobs;
  }

  static deleteJob(id: string): JobRequirement[] {
    const jobs = this.getJobs().filter((j) => j.id !== id);
    this.saveJobs(jobs);
    // Also remove candidates associated with this job
    const candidates = this.getCandidates().filter((c) => c.jobId !== id);
    this.saveCandidates(candidates);
    return jobs;
  }

  // Candidates
  static getCandidates(jobId?: string): Candidate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (!data) {
        this.saveCandidates(INITIAL_CANDIDATES);
        return jobId ? INITIAL_CANDIDATES.filter((c) => c.jobId === jobId) : INITIAL_CANDIDATES;
      }
      const candidates: Candidate[] = JSON.parse(data);
      return jobId ? candidates.filter((c) => c.jobId === jobId) : candidates;
    } catch {
      return jobId ? INITIAL_CANDIDATES.filter((c) => c.jobId === jobId) : INITIAL_CANDIDATES;
    }
  }

  static saveCandidates(candidates: Candidate[]): void {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  }

  static getCandidate(id: string): Candidate | undefined {
    return this.getCandidates().find((c) => c.id === id);
  }

  static saveCandidate(candidate: Candidate): Candidate[] {
    const candidates = this.getCandidates();
    const index = candidates.findIndex((c) => c.id === candidate.id);
    if (index >= 0) {
      candidates[index] = candidate;
    } else {
      candidates.unshift(candidate);
    }
    this.saveCandidates(candidates);

    // Update job counts
    this.syncJobCounts(candidate.jobId);
    return candidates;
  }

  static updateCandidateStatus(id: string, status: Candidate['pipelineStatus']): Candidate[] {
    this.updatePipelineStatus(id, status);
    return this.getCandidates();
  }

  static updatePipelineStatus(id: string, status: Candidate['pipelineStatus']): Candidate | undefined {
    const candidates = this.getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      candidate.pipelineStatus = status;
      candidate.recruiterDecision = status;
      candidate.recruiterDecisionDate = new Date().toISOString().split('T')[0];
      this.saveCandidates(candidates);
      this.syncJobCounts(candidate.jobId);
      return candidate;
    }
    return undefined;
  }

  static updateRecruiterDecision(id: string, decision: Candidate['pipelineStatus'], note?: string): Candidate | undefined {
    const candidates = this.getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      candidate.recruiterDecision = decision;
      candidate.pipelineStatus = decision;
      if (note !== undefined) {
        candidate.recruiterNote = note;
      }
      candidate.recruiterDecisionDate = new Date().toISOString().split('T')[0];
      this.saveCandidates(candidates);
      this.syncJobCounts(candidate.jobId);
      return candidate;
    }
    return undefined;
  }

  static deleteCandidate(id: string): void {
    const candidates = this.getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    const updated = candidates.filter((c) => c.id !== id);
    this.saveCandidates(updated);
    if (candidate) {
      this.syncJobCounts(candidate.jobId);
    }
  }

  private static syncJobCounts(jobId: string): void {
    const jobs = this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const jobCandidates = this.getCandidates(jobId);
      job.applicantsCount = jobCandidates.length;
      job.shortlistedCount = jobCandidates.filter(
        (c) => c.pipelineStatus === 'Shortlisted' || c.pipelineStatus === 'Interview' || c.pipelineStatus === 'Selected'
      ).length;
      this.saveJob(job);
    }
  }

  // Settings
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // User
  static getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return DEFAULT_USER;
      return JSON.parse(data);
    } catch {
      return DEFAULT_USER;
    }
  }

  static saveUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Reset to Demo Data
  static resetToDemoData(): void {
    this.saveJobs(INITIAL_JOBS);
    this.saveCandidates(INITIAL_CANDIDATES);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveUser(DEFAULT_USER);
  }

  static resetToDefaults(): void {
    this.resetToDemoData();
  }
}
