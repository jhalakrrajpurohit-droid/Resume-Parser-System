import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { JobsView } from './components/jobs/JobsView';
import { AddJobModal } from './components/jobs/AddJobModal';
import { ScreeningView } from './components/screening/ScreeningView';
import { CandidatesView } from './components/candidates/CandidatesView';
import { CandidateProfileModal } from './components/candidates/CandidateProfileModal';
import { CandidateComparisonModal } from './components/comparison/CandidateComparisonModal';
import { ResumeAnalyzerView } from './components/resumeAnalyzer/ResumeAnalyzerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingView } from './components/landing/LandingView';
import { JobRequirement, Candidate, AppSettings, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { loginWithGoogle, logoutFirebase, subscribeToAuthState } from './services/firebase';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(() => StorageService.getUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'screening' | 'candidates' | 'shortlist' | 'analyzer' | 'analytics' | 'settings'>('dashboard');
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  // Navigation & Modals
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [comparisonCandidates, setComparisonCandidates] = useState<Candidate[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [screeningJobId, setScreeningJobId] = useState<string | undefined>(undefined);

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    StorageService.initializeDefaults();
    setJobs(StorageService.getJobs());
    setCandidates(StorageService.getCandidates());
    setSettings(StorageService.getSettings());

    // Subscribe to Firebase Auth
    const unsubscribe = subscribeToAuthState((u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const u = await loginWithGoogle();
      setUser(u);
    } catch (err) {
      console.warn('Google sign-in fell back to demo session');
      handleSignInDemo();
    }
  };

  const handleSignInDemo = () => {
    const demoUser: UserProfile = {
      uid: 'recruiter-demo-1',
      email: 'recruiter@hirelens.enterprise',
      displayName: 'Sarah Jenkins',
      role: 'Senior Technical Recruiter',
    };
    StorageService.saveUser(demoUser);
    setUser(demoUser);
  };

  const handleSignOut = async () => {
    await logoutFirebase();
    StorageService.saveUser(null);
    setUser(null);
  };

  const handleSaveJob = (newJob: JobRequirement) => {
    const updated = StorageService.saveJob(newJob);
    setJobs(updated);
  };

  const handleDeleteJob = (jobId: string) => {
    const updated = StorageService.deleteJob(jobId);
    setJobs(updated);
  };

  const handleSaveCandidate = (cand: Candidate) => {
    const updated = StorageService.saveCandidate(cand);
    setCandidates(updated);
    setJobs(StorageService.getJobs());
  };

  const handleUpdateCandidateStatus = (candidateId: string, status: Candidate['pipelineStatus']) => {
    const updated = StorageService.updateCandidateStatus(candidateId, status);
    setCandidates(updated);
    setJobs(StorageService.getJobs());

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, pipelineStatus: status } : null));
    }
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsProfileOpen(true);
  };

  const handleCompareCandidates = (selected: Candidate[]) => {
    setComparisonCandidates(selected);
    setIsComparisonOpen(true);
  };

  const handleStartScreeningForJob = (jobId: string) => {
    setScreeningJobId(jobId);
    setActiveTab('screening');
  };

  const handleResetDemoData = () => {
    StorageService.resetToDefaults();
    setJobs(StorageService.getJobs());
    setCandidates(StorageService.getCandidates());
    setSettings(StorageService.getSettings());
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // If user is not logged in, show Landing page
  if (!user) {
    return (
      <LandingView
        onSignInGoogle={handleSignInGoogle}
        onSignInDemo={handleSignInDemo}
      />
    );
  }

  const selectedCandidateJob = selectedCandidate
    ? jobs.find((j) => j.id === selectedCandidate.jobId)
    : undefined;

  const comparisonJob = comparisonCandidates.length > 0
    ? jobs.find((j) => j.id === comparisonCandidates[0].jobId) || jobs[0]
    : jobs[0];

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] text-[#0F172A] antialiased overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        shortlistCount={candidates.filter((c) => c.pipelineStatus === 'Shortlisted').length}
        user={user}
        onSignOut={handleSignOut}
        onOpenAddJob={() => setIsAddJobOpen(true)}
        fairScreening={settings.fairScreening}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          user={user}
          onSignOut={handleSignOut}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenNewJob={() => setIsAddJobOpen(true)}
          onOpenScreening={() => setActiveTab('screening')}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* View Port Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              candidates={candidates}
              jobs={jobs}
              onSelectCandidate={handleSelectCandidate}
              onSelectJob={(job) => {
                setScreeningJobId(job.id);
                setActiveTab('candidates');
              }}
              onNavigateTab={setActiveTab}
              onStartScreening={handleStartScreeningForJob}
              onAddNewJob={() => setIsAddJobOpen(true)}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsView
              jobs={jobs}
              onAddNewJob={() => setIsAddJobOpen(true)}
              onDeleteJob={handleDeleteJob}
              onStartScreening={handleStartScreeningForJob}
              onScreenForJob={(job) => handleStartScreeningForJob(job.id)}
              onSelectJob={(job) => {
                setScreeningJobId(job.id);
                setActiveTab('candidates');
              }}
              onViewCandidates={(jobId) => {
                setScreeningJobId(jobId);
                setActiveTab('candidates');
              }}
            />
          )}

          {activeTab === 'screening' && (
            <ScreeningView
              jobs={jobs}
              selectedJobId={screeningJobId}
              onSelectCandidate={handleSelectCandidate}
              onSaveCandidate={handleSaveCandidate}
              settings={settings}
            />
          )}

          {activeTab === 'candidates' && (
            <CandidatesView
              candidates={candidates}
              jobs={jobs}
              selectedJobId={screeningJobId}
              onSelectCandidate={handleSelectCandidate}
              onUpdateStatus={handleUpdateCandidateStatus}
              onCompareCandidates={handleCompareCandidates}
              onNavigateTab={setActiveTab}
              shortlistedOnly={false}
            />
          )}

          {activeTab === 'shortlist' && (
            <CandidatesView
              candidates={candidates}
              jobs={jobs}
              selectedJobId={screeningJobId}
              onSelectCandidate={handleSelectCandidate}
              onUpdateStatus={handleUpdateCandidateStatus}
              onCompareCandidates={handleCompareCandidates}
              onNavigateTab={setActiveTab}
              shortlistedOnly={true}
            />
          )}

          {activeTab === 'analyzer' && (
            <ResumeAnalyzerView />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              candidates={candidates}
              jobs={jobs}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetDemoData={handleResetDemoData}
              user={user}
            />
          )}
        </main>

        {/* High Density Status Footer */}
        <footer className="h-8 bg-white border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>&copy; 2026 HireLens AI</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-medium">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Candidate rankings are based on job-relevant qualifications only.</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span>System Status:</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              All Systems Operational
            </span>
          </div>
        </footer>
      </div>

      {/* Add Job Requisition Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onSaveJob={handleSaveJob}
      />

      {/* Candidate Profile Dossier Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        job={selectedCandidateJob}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedCandidate(null);
        }}
        onUpdateStatus={handleUpdateCandidateStatus}
      />

      {/* Candidate Comparison Modal */}
      <CandidateComparisonModal
        candidates={comparisonCandidates}
        job={comparisonJob}
        isOpen={isComparisonOpen}
        onClose={() => {
          setIsComparisonOpen(false);
          setComparisonCandidates([]);
        }}
        onSelectCandidate={handleSelectCandidate}
      />
    </div>
  );
}

export default App;
