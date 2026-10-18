import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const MacronutrientBreakdown: React.FC = () => {
  const { currentLog, setShowOnboarding } = useApp();
  const { protein, carbs, fat, fibre } = currentLog.totals;
  const targetProtein = currentLog.targetSnapshot?.targetProtein || 120;

  const proteinKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatKcal = fat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPctEnergy = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPctEnergy = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatPctEnergy = Math.round((fatKcal / totalMacroKcal) * 100);

  const proteinProgress = targetProtein > 0 ? Math.min(100, (protein / targetProtein) * 100) : 0;

  return (
    <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.04)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE0]">
        <div>
          <h3 className="font-serif-editorial text-xl font-medium text-[#221F1D]">Macronutrient Balance</h3>
          <p className="text-xs text-[#6E675F]">Gentle tracking for daily protein, carbohydrates & healthy fats</p>
        </div>

        <button
          onClick={() => setShowOnboarding(true)}
          className="text-xs font-semibold text-[#C85A32] hover:text-[#A74420] underline underline-offset-4"
        >
          Edit Targets
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* Protein */}
        <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#DCEBE0]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#2D6A4F]">Protein</span>
            <span className="text-[#6E675F] text-[11px]">Goal: {targetProtein}g</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#221F1D]">{protein}</span>
            <span className="text-xs text-[#6E675F]">g</span>
            <span className="ml-auto text-xs font-bold text-[#2D6A4F]">{proteinProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5F0E8] rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proteinProgress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-[#2D6A4F]"
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6E675F] mt-2">
            <span>{Math.round(proteinKcal)} kcal</span>
            <span>{proteinPctEnergy}% energy</span>
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="p-4 rounded-2xl bg-[#FCF8F2] border border-[#F2E5D3]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#B26B1E]">Carbohydrates</span>
            <span className="text-[#6E675F] text-[11px]">Daily energy</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#221F1D]">{carbs}</span>
            <span className="text-xs text-[#6E675F]">g</span>
            <span className="ml-auto text-xs font-bold text-[#B26B1E]">{carbsPctEnergy}% energy</span>
          </div>
          <div className="h-2 w-full bg-[#F3E7D6] rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (carbs / 300) * 100)}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-[#C8872B]"
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6E675F] mt-2">
            <span>{Math.round(carbsKcal)} kcal</span>
            <span>Focus & study stamina</span>
          </div>
        </div>

        {/* Fats */}
        <div className="p-4 rounded-2xl bg-[#FAF3F0] border border-[#F3DDD5]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#C85A32]">Healthy Fats</span>
            <span className="text-[#6E675F] text-[11px]">Lipids</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#221F1D]">{fat}</span>
            <span className="text-xs text-[#6E675F]">g</span>
            <span className="ml-auto text-xs font-bold text-[#C85A32]">{fatPctEnergy}% energy</span>
          </div>
          <div className="h-2 w-full bg-[#F5E2DA] rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (fat / 80) * 100)}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-[#D9653B]"
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6E675F] mt-2">
            <span>{Math.round(fatKcal)} kcal</span>
            <span>Cellular & hormonal</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFEAE0] flex items-center justify-between text-xs text-[#6E675F]">
        <div className="flex items-center gap-2">
          <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>Dietary Fibre: <strong>{fibre}g</strong> (Recommended: 25–35g/day for digestion)</span>
        </div>
        <div className="hidden sm:block text-[11px] text-[#8C8278]">
          Based on ICMR-NIN Food Composition Data
        </div>
      </div>
    </div>
  );
};
