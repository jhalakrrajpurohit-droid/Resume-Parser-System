import React from 'react';
import { Search, Sparkles, Plus, Menu } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onSignOut?: () => void;
  onOpenSettings?: () => void;
  onOpenNewJob?: () => void;
  onOpenScreening?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenNewJob,
  onOpenScreening,
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
}) => {
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Recruiter';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 gap-3">
      {/* Left: Hamburger (mobile) + Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-[#0F172A] tracking-tight truncate leading-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate leading-tight mt-0.5">
            Enterprise Talent Screening & Candidate Intelligence
          </p>
        </div>
      </div>

      {/* Right: Search Input & Action Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative">
          <input
            id="header-candidate-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search candidates..."
            className="pl-8 sm:pl-9 pr-3 py-1.5 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-md text-xs sm:text-sm w-36 sm:w-56 lg:w-64 outline-none transition-all text-slate-800 placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
        </div>

        {onOpenScreening && (
          <button
            onClick={onOpenScreening}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Screen Resumes</span>
          </button>
        )}

        {onOpenNewJob && (
          <button
            id="header-create-job-btn"
            onClick={onOpenNewJob}
            className="bg-blue-600 text-white px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Job Requisition</span>
            <span className="sm:hidden">New Job</span>
          </button>
        )}
      </div>
    </header>
  );
};
