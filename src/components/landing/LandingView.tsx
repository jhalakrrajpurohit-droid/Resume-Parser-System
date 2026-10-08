import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  BarChart3,
  Briefcase,
  Users,
  Building2,
  ChevronRight,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LandingViewProps {
  onSignInGoogle: () => void;
  onSignInDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSignInGoogle,
  onSignInDemo,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            <span>HL</span>
          </div>
          <div className="font-semibold text-slate-900 tracking-tight text-base">
            HireLens<span className="text-blue-700 ml-1.5 text-xs px-1.5 py-0.5 bg-blue-50 rounded border border-blue-200 font-medium">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSignInDemo}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors"
          >
            Live Demo Access
          </button>
          <button
            id="landing-sign-in-top-btn"
            onClick={onSignInGoogle}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            Sign In with Google
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Explainable AI Screening for Enterprise HR & Talent Teams</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight max-w-3xl leading-[1.15]">
          Smarter screening. <br className="hidden sm:block" />
          <span className="text-blue-600">Better hiring decisions.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Analyze resumes, match candidates to job requirements with transparent, explainable scores, and identify skill gaps with Gemini AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="landing-get-started-btn"
            onClick={onSignInDemo}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Launch Talent Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="landing-google-auth-btn"
            onClick={onSignInGoogle}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Feature Highlights (Three Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left w-full">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">AI Resume Screening</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly extract structured skills, work history, and education from PDF, DOCX, and TXT files with high fidelity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Explainable Candidate Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent, evidence-backed matching scores with observable resume citations, gap matrices, and customizable weights.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Faster Shortlisting & Interview Prep</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rank applicants across open positions, compare candidates side-by-side, and synthesize targeted interview probes.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 px-6 text-center text-xs text-slate-400">
        <p>HireLens AI • AI-Powered Resume Screening & Candidate Matching Platform • Built with Gemini & Firebase</p>
      </footer>
    </div>
  );
};
