export type MealCategory = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type NutritionConfidence = 'verified' | 'estimated' | 'mess-average';

export interface FoodItem {
  id: string;
  name: string;
  category: MealCategory | 'all';
  servingSize: number;
  servingUnit: string;
  calories: number; // kcal per serving
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fibre?: number;   // grams
  source: string;   // e.g., "NIN IFCT 2024", "Standard Indian Mess Survey"
  confidence: NutritionConfidence;
  notes?: string;
  isCustom?: boolean;
  icon?: string;
  tags?: string[];
}

export interface MealSlotMenu {
  timing: string;
  itemIds: string[]; // references FoodItem id
}

export interface MessMenu {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "Sunday", "Monday"
  title?: string; // e.g. "Special Feast Menu"
  meals: {
    breakfast: MealSlotMenu;
    lunch: MealSlotMenu;
    snacks: MealSlotMenu;
    dinner: MealSlotMenu;
  };
}

export interface LoggedMealItem {
  id: string;
  foodItemId: string;
  name: string;
  category: MealCategory;
  portion: number; // multiplier, e.g. 1.0, 1.5, 2.0
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre?: number;
  loggedAt: string;
  sourceSnapshot: {
    unitCalories: number;
    unitProtein: number;
    unitCarbs: number;
    unitFat: number;
    confidence: NutritionConfidence;
  };
}

export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

export interface TargetSnapshot {
  targetCalories: number;
  targetProtein: number;
  maintenanceCalories: number;
  bmr: number;
  goal: string;
}

export interface DailyMealLog {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast: LoggedMealItem[];
    lunch: LoggedMealItem[];
    snacks: LoggedMealItem[];
    dinner: LoggedMealItem[];
  };
  totals: NutrientTotals;
  targetSnapshot: TargetSnapshot;
  createdAt: string;
  updatedAt: string;
}

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type FitnessGoal =
  | 'maintain'
  | 'lose_weight'
  | 'gain_weight'
  | 'build_muscle'
  | 'general_nutrition'
  | 'custom';

export type DietaryPreference = 'veg' | 'jain' | 'non_veg' | 'egg';

export interface UserProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  sex: 'male' | 'female';
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  targetWeight?: number;
  customCalorieTarget?: number;
  customProteinTarget?: number;
  dietaryPreference?: DietaryPreference;
  allergies?: string[];
  exerciseRoutine?: string;
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  notes?: string;
  recordedAt: string;
}
