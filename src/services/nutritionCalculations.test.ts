import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateMaintenanceCalories,
  calculateRecommendedTarget,
  calculateProteinTarget,
  ACTIVITY_FACTORS,
  FITNESS_GOALS
} from './nutritionCalculations';

describe('Nutrition & Calorie Calculations', () => {
  it('calculates Mifflin-St Jeor BMR correctly for Male', () => {
    // Male: 10 * 70kg + 6.25 * 175cm - 5 * 20yo + 5
    // 700 + 1093.75 - 100 + 5 = 1698.75 -> 1699 kcal
    const bmr = calculateBMR(70, 175, 20, 'male');
    expect(bmr).toBe(1699);
  });

  it('calculates Mifflin-St Jeor BMR correctly for Female', () => {
    // Female: 10 * 60kg + 6.25 * 165cm - 5 * 20yo - 161
    // 600 + 1031.25 - 100 - 161 = 1370.25 -> 1370 kcal
    const bmr = calculateBMR(60, 165, 20, 'female');
    expect(bmr).toBe(1370);
  });

  it('calculates TDEE Maintenance correctly across all activity levels', () => {
    const bmr = 1700;
    expect(calculateMaintenanceCalories(bmr, 'sedentary')).toBe(Math.round(1700 * 1.20));
    expect(calculateMaintenanceCalories(bmr, 'lightly_active')).toBe(Math.round(1700 * 1.375));
    expect(calculateMaintenanceCalories(bmr, 'moderately_active')).toBe(Math.round(1700 * 1.55));
    expect(calculateMaintenanceCalories(bmr, 'very_active')).toBe(Math.round(1700 * 1.725));
    expect(calculateMaintenanceCalories(bmr, 'extra_active')).toBe(Math.round(1700 * 1.90));
  });

  it('calculates target for weight loss, maintenance, muscle building, and surplus', () => {
    const profile = {
      age: 21,
      height: 175,
      weight: 70,
      sex: 'male' as const,
      activityLevel: 'moderately_active' as const,
      fitnessGoal: 'lose_weight' as const
    };

    const lossResult = calculateRecommendedTarget(profile);
    expect(lossResult.targetCalories).toBeLessThan(lossResult.maintenanceCalories);

    const gainResult = calculateRecommendedTarget({
      ...profile,
      fitnessGoal: 'gain_weight'
    });
    expect(gainResult.targetCalories).toBeGreaterThan(gainResult.maintenanceCalories);

    const maintainResult = calculateRecommendedTarget({
      ...profile,
      fitnessGoal: 'maintain'
    });
    expect(maintainResult.targetCalories).toBe(maintainResult.maintenanceCalories);
  });

  it('protects minors under 18 from aggressive calorie deficits', () => {
    const minorProfile = {
      age: 16,
      height: 170,
      weight: 65,
      sex: 'male' as const,
      activityLevel: 'moderately_active' as const,
      fitnessGoal: 'lose_weight' as const
    };

    const res = calculateRecommendedTarget(minorProfile);
    expect(res.isMinor).toBe(true);
    // Should fallback to maintenance with safety explanation
    expect(res.targetCalories).toBe(res.maintenanceCalories);
    expect(res.minSafetyWarning).toBeDefined();
  });

  it('calculates optimal protein targets based on fitness goal', () => {
    const weight = 70;
    const muscleProtein = calculateProteinTarget(weight, 'build_muscle');
    expect(muscleProtein).toBe(Math.round(70 * 1.8)); // 126g

    const customProtein = calculateProteinTarget(weight, 'custom', 150);
    expect(customProtein).toBe(150);
  });
});
