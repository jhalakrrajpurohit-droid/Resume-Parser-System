import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  BookmarkCheck,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  Plus
} from 'lucide-react';
import { UserProfile } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'jobs'
  | 'candidates'
  | 'screening'
  | 'shortlist'
  | 'shortlisted'
  | 'analytics'
  | 'analyzer'
  | 'resume-analyzer'
  | 'settings';

interface SidebarProps {
  activeTab: string;
  onSelectTab?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
  shortlistCount?: number;
  user?: UserProfile | null;
  onSignOut?: () => void;
  onOpenAddJob?: () => void;
  fairScreening?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  setActiveTab,
  shortlistCount = 0,
  user,
  onSignOut,
  onOpenAddJob,
  fairScreening = true,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const handleNav = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (setActiveTab) setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Requisitions', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'screening', label: 'Resume Screening', icon: FileText },
    { id: 'shortlist', label: 'Shortlisted', icon: BookmarkCheck, count: shortlistCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'analyzer', label: 'Resume Quality Audit', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 md:static flex flex-col w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800 select-none shrink-0 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-base shadow-xs">
              HL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-base tracking-tight leading-tight">
                  HireLens
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-normal mt-0.5">
                Talent Intelligence
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        {onOpenAddJob && (
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => {
                onOpenAddJob();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Job Requisition</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Talent Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'shortlist' && activeTab === 'shortlisted') ||
              (item.id === 'analyzer' && activeTab === 'resume-analyzer');

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Fair Screening Compliance Badge */}
        {fairScreening && (
          <div className="px-4 py-2.5 mx-3 mb-3 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-tight">DEI Blind Screening Active</span>
          </div>
        )}

        {/* User Card in Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'JD'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.displayName || 'Recruiter'}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                  {user?.role || 'Talent Acquisition'}
                </p>
              </div>
            </div>
            {onSignOut && (
              <button
                id="sidebar-logout-btn"
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
