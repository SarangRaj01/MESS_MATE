import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityLevel, FitnessGoal, UserProfile } from '../types';
import {
  calculateBMR,
  calculateMaintenanceCalories,
  calculateRecommendedTarget,
  calculateProteinTarget,
  ACTIVITY_FACTORS,
  FITNESS_GOALS
} from '../services/nutritionCalculations';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useApp();

  const [age, setAge] = useState<number>(profile.age || 20);
  const [height, setHeight] = useState<number>(profile.height || 175);
  const [weight, setWeight] = useState<number>(profile.weight || 68);
  const [sex, setSex] = useState<'male' | 'female'>(profile.sex || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'moderately_active');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile.fitnessGoal || 'maintain');
  const [customCalorieTarget, setCustomCalorieTarget] = useState<number>(profile.customCalorieTarget || 2200);
  const [customProteinTarget, setCustomProteinTarget] = useState<number>(profile.customProteinTarget || 120);

  // Live calculations
  const liveStats = useMemo(() => {
    const bmr = calculateBMR(weight, height, age, sex);
    const maintenance = calculateMaintenanceCalories(bmr, activityLevel);
    const rec = calculateRecommendedTarget({
      age,
      height,
      weight,
      sex,
      activityLevel,
      fitnessGoal,
      customCalorieTarget
    });
    const proteinTarget = calculateProteinTarget(weight, fitnessGoal, customProteinTarget);

    return {
      bmr,
      maintenance,
      targetCalories: rec.targetCalories,
      proteinTarget,
      isMinor: rec.isMinor,
      minSafetyWarning: rec.minSafetyWarning
    };
  }, [weight, height, age, sex, activityLevel, fitnessGoal, customCalorieTarget, customProteinTarget]);

  const handleSave = async () => {
    const updated: UserProfile = {
      ...profile,
      age,
      height,
      weight,
      sex,
      activityLevel,
      fitnessGoal,
      customCalorieTarget: fitnessGoal === 'custom' ? customCalorieTarget : undefined,
      customProteinTarget: fitnessGoal === 'custom' ? customProteinTarget : undefined,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };
    await updateProfile(updated);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-[#E8E2D5] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E8E2D5] bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white border border-[#E8E2D5] text-[#C85A32]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-[#221F1D]">
                  Personalize Your Energy Needs
                </h2>
                <p className="text-xs text-[#7A7265]">
                  Mifflin-St Jeor BMR & Maintenance Calorie Calculator
                </p>
              </div>
            </div>
            {profile.onboardingCompleted && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#7A7265] hover:text-[#221F1D] hover:bg-[#E8E2D5]/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Live Calculation preview banner */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D5]">
                  <div className="text-[10px] text-[#7A7265] font-medium uppercase tracking-wide">Resting BMR</div>
                  <div className="font-serif text-lg font-semibold text-[#221F1D]">{liveStats.bmr}</div>
                  <div className="text-[9px] text-[#A89F91]">Mifflin-St Jeor</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D5]">
                  <div className="text-[10px] text-[#7A7265] font-medium uppercase tracking-wide">Maintenance (TDEE)</div>
                  <div className="font-serif text-lg font-semibold text-[#221F1D]">{liveStats.maintenance}</div>
                  <div className="text-[9px] text-[#A89F91]">Daily burn</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#C85A32]/40">
                  <div className="text-[10px] text-[#C85A32] font-medium uppercase tracking-wide">Calorie Target</div>
                  <div className="font-serif text-lg font-semibold text-[#C85A32]">{liveStats.targetCalories}</div>
                  <div className="text-[9px] text-[#C85A32]/80">kcal/day</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#2D6A4F]/40">
                  <div className="text-[10px] text-[#2D6A4F] font-medium uppercase tracking-wide">Protein Target</div>
                  <div className="font-serif text-lg font-semibold text-[#2D6A4F]">{liveStats.proteinTarget}g</div>
                  <div className="text-[9px] text-[#2D6A4F]/80">Per day</div>
                </div>
              </div>

              {liveStats.minSafetyWarning && (
                <div className="mt-3 flex items-start gap-2 text-xs text-[#C85A32] bg-[#FDF0EC] p-2.5 rounded-xl border border-[#F2C5B8]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#C85A32] mt-0.5" />
                  <span>{liveStats.minSafetyWarning}</span>
                </div>
              )}
            </div>

            {/* Step 1: Body Measurements */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#C85A32] uppercase tracking-wider">
                1. Body Metrics & Equation Settings
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#7A7265] mb-1">Sex (Equation)</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D5]">
                    <button
                      type="button"
                      onClick={() => setSex('male')}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        sex === 'male' ? 'bg-white text-[#221F1D] shadow-sm font-semibold' : 'text-[#7A7265] hover:text-[#221F1D]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setSex('female')}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        sex === 'female' ? 'bg-white text-[#221F1D] shadow-sm font-semibold' : 'text-[#7A7265] hover:text-[#221F1D]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7A7265] mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="14"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-sm text-[#221F1D] font-mono focus:border-[#C85A32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7A7265] mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 175)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-sm text-[#221F1D] font-mono focus:border-[#C85A32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7A7265] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="35"
                    max="180"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 65)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-sm text-[#221F1D] font-mono focus:border-[#C85A32] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Activity Level */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#C85A32] uppercase tracking-wider">
                2. Activity Level (Physical Lifestyle Factor)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(ACTIVITY_FACTORS) as ActivityLevel[]).map((key) => {
                  const act = ACTIVITY_FACTORS[key];
                  const isSelected = activityLevel === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setActivityLevel(key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#C85A32] text-[#221F1D] shadow-sm'
                          : 'bg-white border-[#E8E2D5] text-[#7A7265] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-[#221F1D]">{act.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#C85A32] border border-[#E8E2D5]">
                          {act.factor}x
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7265] mt-1">{act.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Fitness Goal */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#C85A32] uppercase tracking-wider">
                3. Fitness Goal & Energy Target
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(FITNESS_GOALS) as FitnessGoal[]).map((key) => {
                  const goalItem = FITNESS_GOALS[key];
                  const isSelected = fitnessGoal === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setFitnessGoal(key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#C85A32] text-[#221F1D] shadow-sm'
                          : 'bg-white border-[#E8E2D5] text-[#7A7265] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-[#221F1D]">{goalItem.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                      </div>
                      <p className="text-[11px] text-[#7A7265] mt-1">{goalItem.description}</p>
                    </div>
                  );
                })}
              </div>

              {fitnessGoal === 'custom' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#7A7265] mb-1">
                      Custom Daily Calorie Target (kcal)
                    </label>
                    <input
                      type="number"
                      value={customCalorieTarget}
                      onChange={(e) => setCustomCalorieTarget(parseInt(e.target.value) || 2000)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-sm text-[#221F1D] font-mono focus:border-[#C85A32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#7A7265] mb-1">
                      Custom Protein Target (g)
                    </label>
                    <input
                      type="number"
                      value={customProteinTarget}
                      onChange={(e) => setCustomProteinTarget(parseInt(e.target.value) || 120)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-sm text-[#221F1D] font-mono focus:border-[#2D6A4F]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-t border-[#E8E2D5] bg-[#FAF7F2]">
            <span className="text-xs text-[#7A7265]">
              * Baseline estimate; adjustable anytime.
            </span>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-medium text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Save & Apply Target</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
