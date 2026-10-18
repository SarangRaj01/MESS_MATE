import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateNavigator } from './DateNavigator';
import { CalorieBudgetCard } from './CalorieBudgetCard';
import { MacronutrientBreakdown } from './MacronutrientBreakdown';
import { MealCard } from './MealCard';
import { AddFoodModal } from './AddFoodModal';
import { CozyFoxIllustration } from './CozyFoxIllustration';
import { MealCategory } from '../types';
import {
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { allLogs, selectedDate, setSelectedDate, setActiveTab, profile } = useApp();
  const [modalCategory, setModalCategory] = useState<MealCategory | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning — start gently.';
    if (hour < 17) return 'Good Afternoon — stay well nourished.';
    return 'Good Evening — unwind and rest.';
  };

  const mealCategories: MealCategory[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

  const recentLogs = allLogs
    .filter(l => l.totals && l.totals.calories > 0)
    .slice(-5)
    .reverse();

  return (
    <div className="space-y-6 pb-12">
      {/* Date Navigator Header */}
      <DateNavigator />

      {/* Hero Section with Cozy Sleeping Fox Illustration */}
      <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-8 shadow-[0_2px_16px_-4px_rgba(45,35,25,0.04)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Text */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                VIT Vellore Mess Companion
              </span>
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#221F1D] font-medium leading-[1.2]">
              {getGreeting()}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E675F] max-w-md leading-relaxed">
              Tracking your daily meals shouldn't feel like another high-stress exam. Log what you enjoy, balance your energy, and take it one plate at a time.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#8C8278]">
              <span>Active Goal: <strong className="text-[#221F1D] capitalize">{profile.fitnessGoal?.replace('_', ' ') || 'Maintain'}</strong></span>
              <span>•</span>
              <span>Weight: <strong className="text-[#221F1D]">{profile.weight || 68} kg</strong></span>
            </div>
          </div>

          {/* Right Cozy Illustration */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <CozyFoxIllustration className="w-full max-w-[280px] sm:max-w-[340px]" />
          </div>
        </div>
      </div>

      {/* Main Peaceful Calorie Budget Card */}
      <CalorieBudgetCard />

      {/* Macronutrient Tracking Section */}
      <MacronutrientBreakdown />

      {/* 4 Meal Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C85A32]" />
            <h2 className="font-serif-editorial text-2xl font-medium text-[#221F1D]">Today's Meals</h2>
          </div>
          <span className="text-xs text-[#8C8278]">Log what you actually ate</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {mealCategories.map((cat) => (
            <MealCard
              key={cat}
              category={cat}
              onOpenAddModal={(c) => setModalCategory(c)}
            />
          ))}
        </div>
      </div>

      {/* Recent History Preview Strip */}
      {recentLogs.length > 0 && (
        <div className="rounded-3xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C85A32]" />
              <h3 className="font-serif-editorial text-lg font-medium text-[#221F1D]">Recent Intakes</h3>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-[#C85A32] hover:text-[#A74420] flex items-center gap-1 transition-all"
            >
              <span>View History Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {recentLogs.map((log) => {
              const isSelected = log.date === selectedDate;
              return (
                <button
                  key={log.date}
                  onClick={() => setSelectedDate(log.date)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#FAF0EB] border-[#F3D5C7] shadow-sm'
                      : 'bg-[#FDFBF7] border-[#EAE3D6] hover:bg-[#F8F4EC]'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#8C8278]">{log.date}</div>
                  <div className="font-serif-editorial text-lg font-semibold text-[#221F1D] mt-0.5">
                    {log.totals.calories}{' '}
                    <span className="text-[10px] text-[#8C8278] font-normal">kcal</span>
                  </div>
                  <div className="text-[10px] text-[#2D6A4F] font-semibold">
                    {log.totals.protein}g protein
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {modalCategory && (
        <AddFoodModal
          isOpen={Boolean(modalCategory)}
          category={modalCategory}
          onClose={() => setModalCategory(null)}
        />
      )}
    </div>
  );
};
