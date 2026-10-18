import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { DashboardView } from './DashboardView';
import { TodayMenuView } from './TodayMenuView';
import { FoodDatabaseView } from './FoodDatabaseView';
import { HistoryView } from './HistoryView';
import { AnalyticsView } from './AnalyticsView';
import { FoodInsightsView } from './FoodInsightsView';
import { BackupRestoreView } from './BackupRestoreView';
import { OnboardingModal } from './OnboardingModal';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  Calendar,
  BarChart3,
  Lightbulb,
  Database,
  CheckCircle2,
  Loader2,
  HardDrive
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    saveStatus,
    showOnboarding,
    setShowOnboarding,
    currentLog
  } = useApp();

  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'menu', label: "Today's Menu", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'foods', label: 'Food Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'insights', label: 'Smart Swaps', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'profile', label: 'Backup & Restore', icon: <Database className="w-4 h-4" /> }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'menu':
        return <TodayMenuView />;
      case 'foods':
        return <FoodDatabaseView />;
      case 'history':
        return <HistoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'insights':
        return <FoodInsightsView />;
      case 'profile':
        return <BackupRestoreView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221F1D] flex flex-col selection:bg-[#EBDDCB] selection:text-[#C85A32]">
      {/* Top Navigation Bar Inspired by Fox Valuations */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 border-b border-[#E8E2D5] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo with Cute Fox Branding */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Sleek Fox Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-[#FAF0EB] border border-[#F3D5C7] flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🦊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-xl font-bold tracking-tight text-[#221F1D]">
                  Mess<span className="text-[#C85A32]">Mate</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7] uppercase tracking-wider">
                  VIT Vellore
                </span>
              </div>
            </div>
          </div>

          {/* Clean Editorial Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#221F1D] text-white shadow-xs'
                      : 'text-[#6E675F] hover:text-[#221F1D] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Terracotta Action Button & Save Status */}
          <div className="flex items-center gap-3">
            {/* Save Status */}
            <div className="flex items-center">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#C85A32] bg-[#FAF0EB] px-2 py-1 rounded-lg border border-[#F3D5C7]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EAF3EE] px-2 py-1 rounded-lg border border-[#D0E5D7]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Saved in DB</span>
                </span>
              )}
              {saveStatus === 'idle' && (
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-[#8C8278]">
                  <HardDrive className="w-3 h-3 text-[#A89F94]" />
                  <span>IndexedDB</span>
                </span>
              )}
            </div>

            {/* Signature Terracotta CTA Button (Like Fox Valuations) */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B64D28] text-white text-xs font-bold tracking-wide shadow-[0_2px_8px_rgba(200,90,50,0.25)] transition-all flex items-center gap-1.5"
            >
              <span>{currentLog.targetSnapshot.targetCalories} kcal</span>
              <span className="text-[10px] opacity-80 font-normal">Target</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {renderActiveView()}
      </main>

      {/* Mobile Bottom Dock Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 border-t border-[#E8E2D5] backdrop-blur-xl px-2 py-1.5 shadow-[0_-2px_12px_rgba(45,35,25,0.04)]">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'text-[#C85A32] font-bold' : 'text-[#8C8278] hover:text-[#221F1D]'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#FAF0EB]' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-[#C85A32] font-bold' : 'text-[#8C8278]'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'profile' ? 'bg-[#FAF0EB]' : ''}`}>
              <Database className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5">Backup</span>
          </button>
        </div>
      </div>

      {/* Onboarding & Target Calculator Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};
