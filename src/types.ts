export interface JobRequirement {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  experienceLevel: string; // e.g., "3-5 years"
  educationRequirement: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  certifications: string[];
  responsibilities: string[];
  technicalRequirements: string[];
  softSkills: string[];
  keywords: string[];
  seniority: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  shortlistedCount: number;
  createdAt: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  years: number;
  description: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface StructuredResume {
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  totalExperienceYears: number;
  education: Education[];
  technicalSkills: string[];
  softSkills: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  certifications: string[];
  achievements: string[];
  languages: string[];
  rawText?: string;
}

export type PipelineStatus = 
  | 'Applied'
  | 'AI Screened'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export type RecommendationLevel = 
  | 'Strongly Recommended'
  | 'Recommended'
  | 'Consider'
  | 'Low Match'
  | 'Not Recommended';

export type AnalysisConfidence = 'High' | 'Medium' | 'Low';

export interface SkillGapItem {
  skill: string;
  status: 'matched' | 'partial' | 'missing';
  category: 'required' | 'preferred';
  evidence?: string;
  evidenceFromResume?: string;
  matchedRequirement?: string;
  missingRequirement?: string;
  confidence?: number; // 0-100 deterministic confidence percentage
}

export interface ScoreEvidenceItem {
  dimension: string;
  score: number;
  weight: number;
  matchedRequirement: string;
  evidenceFromResume: string;
  matchStatus: 'matched' | 'partial' | 'missing';
  missingRequirement: string;
  confidence: number;
}

export interface DimensionBreakdown {
  earned: number; // e.g. 38
  max: number;    // e.g. 40
}

export interface MatchScoreBreakdown {
  requiredSkills: DimensionBreakdown;  // 38/40
  experience: DimensionBreakdown;      // 23/25
  education: DimensionBreakdown;       // 15/15
  preferredSkills: DimensionBreakdown; // 8/10
  certifications: DimensionBreakdown;  // 5/5
  projects: DimensionBreakdown;        // 4/5
  total: DimensionBreakdown;           // 93/100
}

export interface MatchScores {
  overall: number; // 0-100
  requiredSkills: number; // 0-100
  experience: number; // 0-100
  education: number; // 0-100
  preferredSkills: number; // 0-100
  projectRelevance: number; // 0-100
  certifications?: number; // 0-100
}

export interface CandidateEvaluation {
  scores: MatchScores;
  scoreBreakdown?: MatchScoreBreakdown;
  recommendation: RecommendationLevel;
  confidence: AnalysisConfidence;
  confidenceExplanation: string;
  aiExplanation: string;
  goodFitReasons: string[];
  potentialConcerns: string[];
  missingRequirements: string[];
  resumeEvidence: string[];
  skillGaps: SkillGapItem[];
  scoreEvidence?: Record<string, ScoreEvidenceItem>;
  matchedCompetenciesCount: number;
  totalCompetenciesCount: number;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Project' | 'Behavioral' | 'Experience' | 'Skill Gap';
  question: string;
  context: string;
  sampleAnswerCriteria: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  resumeFileName: string;
  resumeFileSize?: string;
  uploadDate: string;
  structuredResume: StructuredResume;
  evaluation: CandidateEvaluation;
  interviewQuestions?: InterviewQuestion[];
  pipelineStatus: PipelineStatus;
  recruiterDecision?: PipelineStatus;
  recruiterNote?: string;
  recruiterDecisionDate?: string;
  notes?: string;
  isDemo?: boolean;
}

export interface HiringReportData {
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  generatedAt: string;
  totalApplications: number;
  candidatesScreened: number;
  candidatesQualified: number;
  candidatesShortlisted: number;
  candidatesUnderReview: number;
  candidatesSelected: number;
  candidatesRejected: number;
  averageMatchScore: number;
  topCandidates: {
    id: string;
    name: string;
    score: number;
    recommendation: RecommendationLevel;
    confidence: AnalysisConfidence;
    pipelineStatus: PipelineStatus;
    recruiterDecision?: PipelineStatus;
    keyStrength: string;
  }[];
  mostCommonSkills: { skill: string; count: number; percentage: number }[];
  mostCommonMissingSkills: { skill: string; count: number; percentage: number }[];
  experienceDistribution: { range: string; count: number }[];
  skillDistribution: { name: string; matchedCount: number; totalCount: number; rate: number }[];
  executiveSummary: string;
  recommendations: string[];
}

export interface StandaloneResumeAnalysis {
  candidateName: string;
  overallImpression: string;
  strengths: string[];
  weaknesses: string[];
  missingInformation: string[];
  skillClarity: {
    score: number;
    feedback: string;
  };
  experienceClarity: {
    score: number;
    feedback: string;
  };
  projectQuality: {
    score: number;
    feedback: string;
  };
  potentialFormattingProblems: string[];
  missingMeasurableAchievements: string[];
  improvementSuggestions: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  organization?: string;
  photoURL?: string;
  isDemoUser?: boolean;
}

export interface AppSettings {
  fairScreening: boolean;
  scoreWeights: {
    requiredSkills: number; // 40
    experience: number;     // 25
    education: number;      // 15
    preferredSkills: number;// 10
    certifications: number; // 5
    projects: number;       // 5
  };
  enableFirebaseSync: boolean;
  theme: 'light';
}
