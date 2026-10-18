import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

export const CalorieBudgetCard: React.FC = () => {
  const { currentLog, setShowOnboarding } = useApp();

  const target = currentLog.targetSnapshot?.targetCalories || 2200;
  const maintenance = currentLog.targetSnapshot?.maintenanceCalories || target;
  const consumed = currentLog.totals.calories;
  const remaining = target - consumed;
  const isExceeded = remaining < 0;
  const overage = isExceeded ? Math.abs(remaining) : 0;
  const percentage = target > 0 ? (consumed / target) * 100 : 0;
  const visualPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-8 shadow-[0_2px_16px_-4px_rgba(45,35,25,0.05)] transition-all">
      {/* Top Editorial Headline (Inspired by Fox Valuations) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EFEAE0]">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C8278]">
              Daily Energy Budget
            </span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#221F1D] leading-[1.15] font-normal">
            Your college intake is a balance that has to{' '}
            <span className="text-[#C85A32] italic font-medium">hold</span>.
          </h2>
          <p className="text-xs sm:text-sm text-[#6E675F] mt-2">
            Target is set to <span className="font-semibold text-[#221F1D]">{target.toLocaleString()} kcal</span> based on estimated maintenance of {maintenance.toLocaleString()} kcal/day.
          </p>
        </div>

        <button
          onClick={() => setShowOnboarding(true)}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#FAF5ED] hover:bg-[#F3ECE1] text-[#221F1D] text-xs font-semibold border border-[#E2DAD0] flex items-center gap-1.5 transition-all shadow-sm group"
        >
          <Target className="w-3.5 h-3.5 text-[#C85A32] group-hover:rotate-45 transition-transform" />
          <span>Adjust Target</span>
        </button>
      </div>

      {/* Main Numbers: Consumed & Remaining */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-[#EFEAE0] items-baseline">
        {/* Consumed */}
        <div>
          <span className="text-xs font-medium text-[#8C8278] uppercase tracking-wider block mb-1">
            Consumed Today
          </span>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={consumed}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="font-serif-editorial text-4xl sm:text-5xl font-medium text-[#221F1D]"
            >
              {consumed.toLocaleString()}
            </motion.span>
            <span className="text-xs font-semibold text-[#8C8278]">kcal</span>
          </div>
          <span className="text-xs text-[#6E675F] mt-1 block">
            {percentage.toFixed(0)}% of daily allowance
          </span>
        </div>

        {/* Remaining / Exceeded */}
        <div>
          <span className="text-xs font-medium text-[#8C8278] uppercase tracking-wider block mb-1">
            {isExceeded ? 'Exceeded By' : 'Remaining Budget'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={remaining}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className={`font-serif-editorial text-4xl sm:text-5xl font-medium ${
                isExceeded ? 'text-[#C85A32]' : 'text-[#2E6B4A]'
              }`}
            >
              {isExceeded ? `+${overage.toLocaleString()}` : remaining.toLocaleString()}
            </motion.span>
            <span className="text-xs font-semibold text-[#8C8278]">kcal</span>
          </div>
          <span className="text-xs text-[#6E675F] mt-1 block">
            {isExceeded ? 'Exceeded daily target' : 'Available for remaining meals'}
          </span>
        </div>

        {/* Protein Tracker */}
        <div>
          <span className="text-xs font-medium text-[#8C8278] uppercase tracking-wider block mb-1">
            Protein Logged
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-editorial text-4xl sm:text-5xl font-medium text-[#221F1D]">
              {currentLog.totals.protein}
            </span>
            <span className="text-xs font-semibold text-[#8C8278]">
              / {currentLog.targetSnapshot.targetProtein || 120}g
            </span>
          </div>
          <span className="text-xs text-[#6E675F] mt-1 block">
            {(((currentLog.totals.protein || 0) / (currentLog.targetSnapshot.targetProtein || 120)) * 100).toFixed(0)}% of target met
          </span>
        </div>
      </div>

      {/* Clean, Elegant Progress Bar */}
      <div className="pt-6">
        <div className="flex justify-between items-center text-xs text-[#6E675F] mb-2 font-medium">
          <span>Daily Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#F0EBE1] rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${visualPercentage}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isExceeded ? 'bg-[#C85A32]' : 'bg-[#D9653B]'
            }`}
          />
        </div>
      </div>

      {/* Gentle note when target is exceeded */}
      {isExceeded && (
        <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF0EB] border border-[#F3D5C7] flex items-center gap-2.5 text-xs text-[#8A3819]">
          <AlertCircle className="w-4 h-4 text-[#C85A32] shrink-0" />
          <span>
            Logged <strong>{overage} kcal</strong> above today's baseline. Day-to-day fluctuations are completely normal. Keep nourished!
          </span>
        </div>
      )}
    </div>
  );
};
