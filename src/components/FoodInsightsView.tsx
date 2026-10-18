import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Dumbbell,
  ArrowRightLeft,
  Flame
} from 'lucide-react';

export const FoodInsightsView: React.FC = () => {
  const { foodDatabase } = useApp();

  // Sort foods by protein density (protein per calorie)
  const proteinDenseFoods = [...foodDatabase]
    .map(f => ({
      ...f,
      ratio: f.calories > 0 ? (f.protein / f.calories) * 100 : 0
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 6);

  // Highest calorie foods
  const highestCalorieFoods = [...foodDatabase]
    .sort((a, b) => b.calories - a.calories)
    .slice(0, 5);

  const smartSwaps = [
    {
      insteadOf: '2 Puffed Pooris with Aloo (360 kcal, 16.5g Fat)',
      chooseThis: '3 Soft Phulkas with Double Dal (280 kcal, 4.4g Fat, 12g Protein)',
      savings: 'Save ~80 kcal & 12g fat, +6g protein boost',
      tag: 'Heart Healthy & Lean'
    },
    {
      insteadOf: 'Mysore Bonda (265 kcal, 13g Fat, 5.8g Protein)',
      chooseThis: 'White Channa Sundal (165 kcal, 4.2g Fat, 8.8g Protein)',
      savings: 'Save 100 kcal, +3g clean plant protein & 6g fiber',
      tag: 'High Protein Snack'
    },
    {
      insteadOf: 'Bread Halwa Dessert Scoop (245 kcal, 35g Sugar/Carbs)',
      chooseThis: 'Fresh Sweet Papaya Bowl or Apple (55–65 kcal, rich in vitamins & enzymes)',
      savings: 'Save 180 kcal, aids digestion naturally',
      tag: 'Digestion & Fiber'
    },
    {
      insteadOf: 'Plain White Rice with single gravy',
      chooseThis: 'Half Rice + 2 Phulkas + Extra Curd / Dal',
      savings: 'Lowers glycemic spike, improves fullness across long study hours',
      tag: 'Steady Energy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#FAF7F2] text-[#C85A32] border border-[#E8E2D5]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#C85A32]">
              Hostel Nutrition Guide
            </span>
          </div>
          <h2 className="font-serif text-2xl text-[#221F1D] mt-1">
            Mess Nutrition Intelligence & Swaps
          </h2>
          <p className="text-xs text-[#7A7265] mt-1">
            Science-backed strategies to hit your macros using only the actual food served in the VIT mess
          </p>
        </div>
      </div>

      {/* Smart Swaps Grid */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D5]">
          <ArrowRightLeft className="w-4 h-4 text-[#C85A32]" />
          <h3 className="font-serif text-lg text-[#221F1D]">Smart Mess Food Swaps</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartSwaps.map((swap, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white text-[#554E45] border border-[#E8E2D5] uppercase tracking-wide">
                  {swap.tag}
                </span>
                <div className="mt-2.5 space-y-1.5 text-xs">
                  <div className="text-[#7A7265] line-through">✕ {swap.insteadOf}</div>
                  <div className="font-medium text-[#2D6A4F]">✓ {swap.chooseThis}</div>
                </div>
              </div>
              <div className="text-[11px] font-medium text-[#C85A32] pt-2 border-t border-[#E8E2D5]">
                💡 {swap.savings}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: Protein Champions vs Calorie Dense Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High Protein Champions */}
        <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D5]">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
              <h3 className="font-serif text-base text-[#221F1D]">Top Protein Density Foods</h3>
            </div>
            <span className="text-[11px] text-[#2D6A4F] font-medium">Protein per calorie</span>
          </div>

          <div className="space-y-2.5">
            {proteinDenseFoods.map((food, i) => (
              <div
                key={food.id}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-semibold text-[#A89F91] text-sm">#{i + 1}</span>
                  <div>
                    <h4 className="font-medium text-xs text-[#221F1D]">{food.name}</h4>
                    <span className="text-[10px] text-[#7A7265]">{food.servingUnit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-[#2D6A4F]">{food.protein}g protein</div>
                  <div className="text-[10px] text-[#7A7265]">{food.calories} kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie Dense Foods */}
        <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D5]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#C85A32]" />
              <h3 className="font-serif text-base text-[#221F1D]">Calorie Dense Items</h3>
            </div>
            <span className="text-[11px] text-[#C85A32] font-medium">Portion awareness</span>
          </div>

          <div className="space-y-2.5">
            {highestCalorieFoods.map((food, i) => (
              <div
                key={food.id}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-semibold text-[#A89F91] text-sm">#{i + 1}</span>
                  <div>
                    <h4 className="font-medium text-xs text-[#221F1D]">{food.name}</h4>
                    <span className="text-[10px] text-[#7A7265]">{food.servingUnit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-[#C85A32]">{food.calories} kcal</div>
                  <div className="text-[10px] text-[#7A7265]">P: {food.protein}g • F: {food.fat}g</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
