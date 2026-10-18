import { ActivityLevel, FitnessGoal, UserProfile } from '../types';

export const ACTIVITY_FACTORS: Record<ActivityLevel, { factor: number; label: string; description: string }> = {
  sedentary: {
    factor: 1.20,
    label: 'Sedentary',
    description: 'Little or no structured exercise, desk work / studying.'
  },
  lightly_active: {
    factor: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise or brisk walking 1–3 days per week.'
  },
  moderately_active: {
    factor: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise or sports 3–5 days per week.'
  },
  very_active: {
    factor: 1.725,
    label: 'Very Active',
    description: 'Hard training or intense physical activity 6–7 days per week.'
  },
  extra_active: {
    factor: 1.90,
    label: 'Extra Active',
    description: 'Demanding physical training, athletic conditioning or heavy physical labor.'
  }
};

export const FITNESS_GOALS: Record<FitnessGoal, { label: string; description: string; multiplier: number }> = {
  maintain: {
    label: 'Maintain Weight',
    description: 'Keep weight stable by eating approximately at your daily energy expenditure.',
    multiplier: 1.0
  },
  lose_weight: {
    label: 'Healthy Fat Loss',
    description: 'Moderate calorie deficit (~15% below maintenance) for sustainable fat loss while preserving muscle.',
    multiplier: 0.85
  },
  gain_weight: {
    label: 'Healthy Weight Gain',
    description: 'Modest calorie surplus (~10% above maintenance) for controlled weight gain.',
    multiplier: 1.10
  },
  build_muscle: {
    label: 'Lean Muscle Building',
    description: 'Slight surplus (~5-8% above maintenance) combined with high protein to maximize hypertrophy.',
    multiplier: 1.06
  },
  general_nutrition: {
    label: 'General Nutrition & Health',
    description: 'Balanced nourishment focused on mess food quality, fiber, and steady daily energy.',
    multiplier: 1.0
  },
  custom: {
    label: 'Custom Target',
    description: 'Specify your own exact daily calorie and protein targets.',
    multiplier: 1.0
  }
};

/**
 * Calculates Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor equation.
 * Male: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) / Maintenance Calories.
 * Maintenance = BMR × Activity Factor
 */
export function calculateMaintenanceCalories(bmr: number, activityLevel: ActivityLevel): number {
  const factor = ACTIVITY_FACTORS[activityLevel]?.factor || 1.20;
  return Math.round(bmr * factor);
}

/**
 * Estimates recommended daily calorie target based on profile, age, and goal.
 */
export function calculateRecommendedTarget(
  profile: Pick<UserProfile, 'age' | 'height' | 'weight' | 'sex' | 'activityLevel' | 'fitnessGoal' | 'customCalorieTarget'>
): {
  targetCalories: number;
  maintenanceCalories: number;
  bmr: number;
  isMinor: boolean;
  minSafetyWarning?: string;
} {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.sex);
  const maintenance = calculateMaintenanceCalories(bmr, profile.activityLevel);
  const isMinor = profile.age < 18;

  if (profile.fitnessGoal === 'custom' && profile.customCalorieTarget && profile.customCalorieTarget > 500) {
    return {
      targetCalories: profile.customCalorieTarget,
      maintenanceCalories: maintenance,
      bmr,
      isMinor
    };
  }

  // Under-18 safety guidance: avoid aggressive calorie restrictions
  if (isMinor && profile.fitnessGoal === 'lose_weight') {
    return {
      targetCalories: maintenance,
      maintenanceCalories: maintenance,
      bmr,
      isMinor: true,
      minSafetyWarning: 'For growing individuals under 18, caloric restriction is not recommended without pediatrician guidance. Maintenance calories have been applied as your baseline.'
    };
  }

  const multiplier = FITNESS_GOALS[profile.fitnessGoal]?.multiplier || 1.0;
  let target = Math.round(maintenance * multiplier);

  // Safety floor check (1200 kcal female, 1500 kcal male)
  const absoluteFloor = profile.sex === 'female' ? 1200 : 1500;
  let minSafetyWarning: string | undefined = undefined;

  if (target < absoluteFloor && profile.fitnessGoal === 'lose_weight') {
    target = absoluteFloor;
    minSafetyWarning = `To safeguard essential metabolic function, your target is capped at the safe physiological floor of ${absoluteFloor} kcal/day.`;
  }

  return {
    targetCalories: target,
    maintenanceCalories: maintenance,
    bmr,
    isMinor,
    minSafetyWarning
  };
}

/**
 * Calculates optimal daily protein target in grams.
 */
export function calculateProteinTarget(
  weightKg: number,
  goal: FitnessGoal,
  customProtein?: number
): number {
  if (customProtein && customProtein > 20) return customProtein;
  
  switch (goal) {
    case 'build_muscle':
      // 1.8g to 2.0g per kg for hypertrophy
      return Math.round(weightKg * 1.8);
    case 'lose_weight':
      // 1.8g per kg to preserve lean muscle during deficit
      return Math.round(weightKg * 1.7);
    case 'gain_weight':
      return Math.round(weightKg * 1.6);
    case 'maintain':
    case 'general_nutrition':
    default:
      // 1.2g - 1.4g per kg for active college students
      return Math.round(weightKg * 1.3);
  }
}
