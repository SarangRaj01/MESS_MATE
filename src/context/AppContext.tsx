import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  DailyMealLog,
  FoodItem,
  LoggedMealItem,
  MealCategory,
  MessMenu,
  NutrientTotals,
  UserProfile,
  WeightRecord
} from '../types';
import {
  initializeDatabase,
  getFoodItems,
  saveFoodItem,
  deleteFoodItem as dbDeleteFood,
  getMenuForDate,
  getAllMenus,
  saveMenu,
  getDailyLog,
  saveDailyLog,
  getAllDailyLogs,
  getUserProfile,
  saveUserProfile,
  getWeightHistory,
  saveWeightRecord as dbSaveWeight
} from '../services/persistenceService';
import {
  calculateRecommendedTarget,
  calculateProteinTarget
} from '../services/nutritionCalculations';

export type AppTab = 'dashboard' | 'menu' | 'foods' | 'history' | 'analytics' | 'insights' | 'profile';

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToYesterday: () => void;
  changeDateByOffset: (days: number) => void;
  
  profile: UserProfile;
  updateProfile: (newProfile: UserProfile) => Promise<void>;
  
  foodDatabase: FoodItem[];
  addCustomFood: (food: Omit<FoodItem, 'id'>) => Promise<FoodItem>;
  updateFood: (food: FoodItem) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  
  currentMenu: MessMenu | null;
  allMenus: MessMenu[];
  updateMenu: (menu: MessMenu) => Promise<void>;
  
  currentLog: DailyMealLog;
  allLogs: DailyMealLog[];
  refreshAllLogs: () => Promise<void>;
  
  addMealItem: (meal: MealCategory, food: FoodItem, portion: number) => Promise<void>;
  updateMealItemPortion: (meal: MealCategory, itemId: string, portion: number) => Promise<void>;
  removeMealItem: (meal: MealCategory, itemId: string) => Promise<void>;
  clearMeal: (meal: MealCategory) => Promise<void>;
  
  weightHistory: WeightRecord[];
  logWeight: (weight: number, date?: string, notes?: string) => Promise<void>;
  
  saveStatus: 'idle' | 'saving' | 'saved';
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const getLocalTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDate = (): string => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalTodayDate());
  const [profile, setProfileState] = useState<UserProfile>({} as UserProfile);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>([]);
  const [currentMenu, setCurrentMenu] = useState<MessMenu | null>(null);
  const [allMenus, setAllMenus] = useState<MessMenu[]>([]);
  const [allLogs, setAllLogs] = useState<DailyMealLog[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Compute recommended target from current profile
  const computedTargets = useMemo(() => {
    if (!profile.age) {
      return { targetCalories: 2200, maintenanceCalories: 2200, bmr: 1650, goal: 'maintain' };
    }
    const rec = calculateRecommendedTarget(profile);
    const targetProtein = calculateProteinTarget(profile.weight, profile.fitnessGoal, profile.customProteinTarget);
    return {
      targetCalories: rec.targetCalories,
      maintenanceCalories: rec.maintenanceCalories,
      bmr: rec.bmr,
      targetProtein,
      goal: profile.fitnessGoal
    };
  }, [profile]);

  // Current log state for selectedDate
  const currentLog = useMemo<DailyMealLog>(() => {
    const existing = allLogs.find(l => l.date === selectedDate);
    if (existing) return existing;

    // Return empty log with default target snapshot
    return {
      date: selectedDate,
      meals: {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: []
      },
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 },
      targetSnapshot: {
        targetCalories: computedTargets.targetCalories,
        targetProtein: computedTargets.targetProtein || 120,
        maintenanceCalories: computedTargets.maintenanceCalories,
        bmr: computedTargets.bmr,
        goal: computedTargets.goal
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [allLogs, selectedDate, computedTargets]);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await initializeDatabase();

      const [loadedProfile, loadedFoods, loadedMenus, loadedLogs, loadedWeights] = await Promise.all([
        getUserProfile(),
        getFoodItems(),
        getAllMenus(),
        getAllDailyLogs(),
        getWeightHistory()
      ]);

      setProfileState(loadedProfile);
      setFoodDatabase(loadedFoods);
      setAllMenus(loadedMenus);
      setAllLogs(loadedLogs);
      setWeightHistory(loadedWeights);

      if (!loadedProfile.onboardingCompleted) {
        setShowOnboarding(true);
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  // Update current menu when selectedDate changes or allMenus changes
  useEffect(() => {
    async function loadMenu() {
      const menu = await getMenuForDate(selectedDate);
      setCurrentMenu(menu);
    }
    loadMenu();
  }, [selectedDate, allMenus]);

  // Trigger brief 'saved' indicator
  const triggerSavedFeedback = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2200);
    }, 200);
  }, []);

  // Recalculate totals helper
  const calculateTotals = (meals: DailyMealLog['meals']): NutrientTotals => {
    const totals: NutrientTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
    const categories: MealCategory[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

    for (const cat of categories) {
      for (const item of meals[cat]) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
        totals.fibre += item.fibre || 0;
      }
    }

    return {
      calories: Math.round(totals.calories),
      protein: Number(totals.protein.toFixed(1)),
      carbs: Number(totals.carbs.toFixed(1)),
      fat: Number(totals.fat.toFixed(1)),
      fibre: Number(totals.fibre.toFixed(1))
    };
  };

  // Persist updated log
  const persistLog = useCallback(async (updatedLog: DailyMealLog) => {
    setAllLogs(prev => {
      const filtered = prev.filter(l => l.date !== updatedLog.date);
      return [...filtered, updatedLog].sort((a, b) => a.date.localeCompare(b.date));
    });
    await saveDailyLog(updatedLog);
    triggerSavedFeedback();
  }, [triggerSavedFeedback]);

  // DATE HELPERS
  const goToToday = useCallback(() => setSelectedDate(getLocalTodayDate()), []);
  const goToYesterday = useCallback(() => setSelectedDate(getYesterdayDate()), []);
  const changeDateByOffset = useCallback((days: number) => {
    setSelectedDate(prev => {
      const date = new Date(prev);
      date.setDate(date.getDate() + days);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
  }, []);

  // PROFILE
  const updateProfile = async (newProfile: UserProfile) => {
    const updated = { ...newProfile, updatedAt: new Date().toISOString() };
    setProfileState(updated);
    await saveUserProfile(updated);
    triggerSavedFeedback();
  };

  // FOOD OPERATIONS
  const addCustomFood = async (food: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
    const newId = `custom_food_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullItem: FoodItem = {
      ...food,
      id: newId,
      isCustom: true
    };
    await saveFoodItem(fullItem);
    setFoodDatabase(prev => [...prev, fullItem]);
    triggerSavedFeedback();
    return fullItem;
  };

  const updateFood = async (food: FoodItem) => {
    await saveFoodItem(food);
    setFoodDatabase(prev => prev.map(f => f.id === food.id ? food : f));
    triggerSavedFeedback();
  };

  const deleteFood = async (id: string) => {
    await dbDeleteFood(id);
    setFoodDatabase(prev => prev.filter(f => f.id !== id));
    triggerSavedFeedback();
  };

  // MENU OPERATIONS
  const updateMenu = async (menu: MessMenu) => {
    await saveMenu(menu);
    setAllMenus(prev => {
      const idx = prev.findIndex(m => m.date === menu.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = menu;
        return copy;
      }
      return [...prev, menu];
    });
    if (menu.date === selectedDate) {
      setCurrentMenu(menu);
    }
    triggerSavedFeedback();
  };

  // REFRESH ALL LOGS
  const refreshAllLogs = async () => {
    const logs = await getAllDailyLogs();
    setAllLogs(logs);
  };

  // MEAL LOGGING ACTIONS
  const addMealItem = async (meal: MealCategory, food: FoodItem, portion: number = 1.0) => {
    const itemCalories = Math.round(food.calories * portion);
    const itemProtein = Number((food.protein * portion).toFixed(1));
    const itemCarbs = Number((food.carbs * portion).toFixed(1));
    const itemFat = Number((food.fat * portion).toFixed(1));
    const itemFibre = food.fibre ? Number((food.fibre * portion).toFixed(1)) : 0;

    const loggedItem: LoggedMealItem = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      foodItemId: food.id,
      name: food.name,
      category: meal,
      portion,
      servingUnit: food.servingUnit,
      calories: itemCalories,
      protein: itemProtein,
      carbs: itemCarbs,
      fat: itemFat,
      fibre: itemFibre,
      loggedAt: new Date().toISOString(),
      sourceSnapshot: {
        unitCalories: food.calories,
        unitProtein: food.protein,
        unitCarbs: food.carbs,
        unitFat: food.fat,
        confidence: food.confidence
      }
    };

    const newMeals = {
      ...currentLog.meals,
      [meal]: [...currentLog.meals[meal], loggedItem]
    };

    const newTotals = calculateTotals(newMeals);

    const updatedLog: DailyMealLog = {
      ...currentLog,
      meals: newMeals,
      totals: newTotals,
      updatedAt: new Date().toISOString()
    };

    await persistLog(updatedLog);
  };

  const updateMealItemPortion = async (meal: MealCategory, itemId: string, portion: number) => {
    if (portion <= 0) {
      await removeMealItem(meal, itemId);
      return;
    }

    const newMeals = {
      ...currentLog.meals,
      [meal]: currentLog.meals[meal].map(item => {
        if (item.id === itemId) {
          const unitCal = item.sourceSnapshot.unitCalories;
          const unitPro = item.sourceSnapshot.unitProtein;
          const unitCarb = item.sourceSnapshot.unitCarbs;
          const unitFat = item.sourceSnapshot.unitFat;
          return {
            ...item,
            portion,
            calories: Math.round(unitCal * portion),
            protein: Number((unitPro * portion).toFixed(1)),
            carbs: Number((unitCarb * portion).toFixed(1)),
            fat: Number((unitFat * portion).toFixed(1)),
            fibre: item.fibre ? Number(((item.fibre / (item.portion || 1)) * portion).toFixed(1)) : 0
          };
        }
        return item;
      })
    };

    const newTotals = calculateTotals(newMeals);

    const updatedLog: DailyMealLog = {
      ...currentLog,
      meals: newMeals,
      totals: newTotals,
      updatedAt: new Date().toISOString()
    };

    await persistLog(updatedLog);
  };

  const removeMealItem = async (meal: MealCategory, itemId: string) => {
    const newMeals = {
      ...currentLog.meals,
      [meal]: currentLog.meals[meal].filter(item => item.id !== itemId)
    };

    const newTotals = calculateTotals(newMeals);

    const updatedLog: DailyMealLog = {
      ...currentLog,
      meals: newMeals,
      totals: newTotals,
      updatedAt: new Date().toISOString()
    };

    await persistLog(updatedLog);
  };

  const clearMeal = async (meal: MealCategory) => {
    const newMeals = {
      ...currentLog.meals,
      [meal]: []
    };

    const newTotals = calculateTotals(newMeals);

    const updatedLog: DailyMealLog = {
      ...currentLog,
      meals: newMeals,
      totals: newTotals,
      updatedAt: new Date().toISOString()
    };

    await persistLog(updatedLog);
  };

  // WEIGHT RECORDING
  const logWeight = async (weight: number, dateStr?: string, notes?: string) => {
    const recordDate = dateStr || getLocalTodayDate();
    const newRecord: WeightRecord = {
      id: `weight_${recordDate}_${Date.now()}`,
      date: recordDate,
      weight,
      notes,
      recordedAt: new Date().toISOString()
    };
    await dbSaveWeight(newRecord);
    setWeightHistory(prev => {
      const filtered = prev.filter(r => r.date !== recordDate);
      return [...filtered, newRecord].sort((a, b) => a.date.localeCompare(b.date));
    });
    // Also update current profile weight if date is today
    if (recordDate === getLocalTodayDate()) {
      await updateProfile({ ...profile, weight });
    }
    triggerSavedFeedback();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        goToToday,
        goToYesterday,
        changeDateByOffset,
        profile,
        updateProfile,
        foodDatabase,
        addCustomFood,
        updateFood,
        deleteFood,
        currentMenu,
        allMenus,
        updateMenu,
        currentLog,
        allLogs,
        refreshAllLogs,
        addMealItem,
        updateMealItemPortion,
        removeMealItem,
        clearMeal,
        weightHistory,
        logWeight,
        saveStatus,
        showOnboarding,
        setShowOnboarding,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
