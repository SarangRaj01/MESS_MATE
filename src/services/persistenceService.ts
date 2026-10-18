import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DailyMealLog, FoodItem, MessMenu, UserProfile, WeightRecord } from '../types';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';
import { INITIAL_MESS_MENUS } from '../data/messMenus';

interface MessMateDBSchema extends DBSchema {
  dailyLogs: {
    key: string; // date YYYY-MM-DD
    value: DailyMealLog;
    indexes: { 'by-date': string };
  };
  foodItems: {
    key: string; // id
    value: FoodItem;
    indexes: { 'by-category': string };
  };
  menus: {
    key: string; // date YYYY-MM-DD
    value: MessMenu;
    indexes: { 'by-date': string };
  };
  userProfile: {
    key: string; // 'current_profile'
    value: UserProfile;
  };
  weightHistory: {
    key: string; // id
    value: WeightRecord;
    indexes: { 'by-date': string };
  };
}

const DB_NAME = 'MessMateDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MessMateDBSchema>> | null = null;

export const DEFAULT_USER_PROFILE: UserProfile = {
  age: 20,
  height: 175,
  weight: 68,
  sex: 'male',
  activityLevel: 'moderately_active',
  fitnessGoal: 'maintain',
  dietaryPreference: 'veg',
  allergies: [],
  onboardingCompleted: false,
  updatedAt: new Date().toISOString()
};

export async function getDB(): Promise<IDBPDatabase<MessMateDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<MessMateDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Daily logs
        if (!db.objectStoreNames.contains('dailyLogs')) {
          const logStore = db.createObjectStore('dailyLogs', { keyPath: 'date' });
          logStore.createIndex('by-date', 'date');
        }
        // Food items
        if (!db.objectStoreNames.contains('foodItems')) {
          const foodStore = db.createObjectStore('foodItems', { keyPath: 'id' });
          foodStore.createIndex('by-category', 'category');
        }
        // Menus
        if (!db.objectStoreNames.contains('menus')) {
          const menuStore = db.createObjectStore('menus', { keyPath: 'date' });
          menuStore.createIndex('by-date', 'date');
        }
        // User Profile
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile');
        }
        // Weight History
        if (!db.objectStoreNames.contains('weightHistory')) {
          const weightStore = db.createObjectStore('weightHistory', { keyPath: 'id' });
          weightStore.createIndex('by-date', 'date');
        }
      }
    });
  }
  return dbPromise;
}

/**
 * Initializes database and seeds default food items & menus if first launch
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDB();
    
    // Seed initial food database if empty
    const existingFoodsCount = await db.count('foodItems');
    if (existingFoodsCount === 0) {
      const tx = db.transaction('foodItems', 'readwrite');
      for (const food of INITIAL_FOOD_DATABASE) {
        await tx.store.put(food);
      }
      await tx.done;
    }

    // Seed initial menus if empty
    const existingMenusCount = await db.count('menus');
    if (existingMenusCount === 0) {
      const tx = db.transaction('menus', 'readwrite');
      for (const menu of INITIAL_MESS_MENUS) {
        await tx.store.put(menu);
      }
      await tx.done;
    }

    // Check user profile
    const existingProfile = await db.get('userProfile', 'current_profile');
    if (!existingProfile) {
      await db.put('userProfile', DEFAULT_USER_PROFILE, 'current_profile');
    }

    // Seed sample initial logs for extracted dates if empty
    const existingLogsCount = await db.count('dailyLogs');
    if (existingLogsCount === 0) {
      const sampleOct12: DailyMealLog = {
        date: '2026-10-12',
        meals: {
          breakfast: [
            {
              id: 'init_1',
              foodItemId: 'food_ven_pongal',
              name: 'Ven Pongal (Ghee Khichdi)',
              category: 'breakfast',
              portion: 1.0,
              servingUnit: 'bowl (180g)',
              calories: 285,
              protein: 7.2,
              carbs: 44.0,
              fat: 8.8,
              fibre: 2.8,
              loggedAt: '2026-10-12T08:15:00Z',
              sourceSnapshot: { unitCalories: 285, unitProtein: 7.2, unitCarbs: 44.0, unitFat: 8.8, confidence: 'verified' }
            },
            {
              id: 'init_2',
              foodItemId: 'food_medu_vada',
              name: 'Medu Vada (1 pc)',
              category: 'breakfast',
              portion: 1.0,
              servingUnit: 'piece',
              calories: 145,
              protein: 3.4,
              carbs: 14.2,
              fat: 8.5,
              fibre: 1.8,
              loggedAt: '2026-10-12T08:18:00Z',
              sourceSnapshot: { unitCalories: 145, unitProtein: 3.4, unitCarbs: 14.2, unitFat: 8.5, confidence: 'verified' }
            },
            {
              id: 'init_3',
              foodItemId: 'food_masala_tea',
              name: 'Mess Masala Chai',
              category: 'breakfast',
              portion: 1.0,
              servingUnit: 'cup (120ml)',
              calories: 75,
              protein: 2.2,
              carbs: 9.8,
              fat: 3.0,
              fibre: 0.0,
              loggedAt: '2026-10-12T08:25:00Z',
              sourceSnapshot: { unitCalories: 75, unitProtein: 2.2, unitCarbs: 9.8, unitFat: 3.0, confidence: 'verified' }
            }
          ],
          lunch: [
            {
              id: 'init_4',
              foodItemId: 'food_veg_dum_biryani',
              name: 'Vegetable Dum Biryani',
              category: 'lunch',
              portion: 1.0,
              servingUnit: 'bowl (220g)',
              calories: 340,
              protein: 7.2,
              carbs: 55.0,
              fat: 10.5,
              fibre: 4.5,
              loggedAt: '2026-10-12T13:10:00Z',
              sourceSnapshot: { unitCalories: 340, unitProtein: 7.2, unitCarbs: 55.0, unitFat: 10.5, confidence: 'verified' }
            },
            {
              id: 'init_5',
              foodItemId: 'food_kadai_paneer',
              name: 'Kadai Paneer Gravy',
              category: 'lunch',
              portion: 1.0,
              servingUnit: 'bowl (160g)',
              calories: 260,
              protein: 11.2,
              carbs: 11.5,
              fat: 19.0,
              fibre: 3.0,
              loggedAt: '2026-10-12T13:12:00Z',
              sourceSnapshot: { unitCalories: 260, unitProtein: 11.2, unitCarbs: 11.5, unitFat: 19.0, confidence: 'verified' }
            },
            {
              id: 'init_6',
              foodItemId: 'food_phulka',
              name: 'Phulka / Roti (Oil-free)',
              category: 'lunch',
              portion: 2.0,
              servingUnit: 'phulka',
              calories: 140,
              protein: 5.2,
              carbs: 28.4,
              fat: 0.8,
              fibre: 4.6,
              loggedAt: '2026-10-12T13:14:00Z',
              sourceSnapshot: { unitCalories: 70, unitProtein: 2.6, unitCarbs: 14.2, unitFat: 0.4, confidence: 'verified' }
            },
            {
              id: 'init_7',
              foodItemId: 'food_curd',
              name: 'Fresh Curd (Dahi)',
              category: 'lunch',
              portion: 1.0,
              servingUnit: 'katori (100g)',
              calories: 62,
              protein: 3.4,
              carbs: 4.5,
              fat: 3.2,
              fibre: 0.0,
              loggedAt: '2026-10-12T13:18:00Z',
              sourceSnapshot: { unitCalories: 62, unitProtein: 3.4, unitCarbs: 4.5, unitFat: 3.2, confidence: 'verified' }
            }
          ],
          snacks: [
            {
              id: 'init_8',
              foodItemId: 'food_channa_sundal',
              name: 'White Channa Sundal',
              category: 'snacks',
              portion: 1.0,
              servingUnit: 'bowl (100g)',
              calories: 165,
              protein: 8.8,
              carbs: 24.0,
              fat: 4.2,
              fibre: 6.2,
              loggedAt: '2026-10-12T17:15:00Z',
              sourceSnapshot: { unitCalories: 165, unitProtein: 8.8, unitCarbs: 24.0, unitFat: 4.2, confidence: 'verified' }
            },
            {
              id: 'init_9',
              foodItemId: 'food_masala_tea',
              name: 'Mess Masala Chai',
              category: 'snacks',
              portion: 1.0,
              servingUnit: 'cup (120ml)',
              calories: 75,
              protein: 2.2,
              carbs: 9.8,
              fat: 3.0,
              fibre: 0.0,
              loggedAt: '2026-10-12T17:20:00Z',
              sourceSnapshot: { unitCalories: 75, unitProtein: 2.2, unitCarbs: 9.8, unitFat: 3.0, confidence: 'verified' }
            }
          ],
          dinner: [
            {
              id: 'init_10',
              foodItemId: 'food_phulka',
              name: 'Phulka / Roti (Oil-free)',
              category: 'dinner',
              portion: 3.0,
              servingUnit: 'phulka',
              calories: 210,
              protein: 7.8,
              carbs: 42.6,
              fat: 1.2,
              fibre: 6.9,
              loggedAt: '2026-10-12T20:10:00Z',
              sourceSnapshot: { unitCalories: 70, unitProtein: 2.6, unitCarbs: 14.2, unitFat: 0.4, confidence: 'verified' }
            },
            {
              id: 'init_11',
              foodItemId: 'food_paneer_tikka_masala',
              name: 'Paneer Tikka Masala',
              category: 'dinner',
              portion: 1.0,
              servingUnit: 'bowl (160g)',
              calories: 270,
              protein: 11.0,
              carbs: 12.0,
              fat: 20.0,
              fibre: 2.8,
              loggedAt: '2026-10-12T20:12:00Z',
              sourceSnapshot: { unitCalories: 270, unitProtein: 11.0, unitCarbs: 12.0, unitFat: 20.0, confidence: 'estimated' }
            },
            {
              id: 'init_12',
              foodItemId: 'food_toor_dhal',
              name: 'Toor Dal Tadka (Yellow Dal)',
              category: 'dinner',
              portion: 1.0,
              servingUnit: 'bowl (150g)',
              calories: 140,
              protein: 6.8,
              carbs: 19.5,
              fat: 4.0,
              fibre: 4.2,
              loggedAt: '2026-10-12T20:15:00Z',
              sourceSnapshot: { unitCalories: 140, unitProtein: 6.8, unitCarbs: 19.5, unitFat: 4.0, confidence: 'verified' }
            },
            {
              id: 'init_13',
              foodItemId: 'food_papaya_bowl',
              name: 'Fresh Sweet Papaya Cubes',
              category: 'dinner',
              portion: 1.0,
              servingUnit: 'bowl (150g)',
              calories: 55,
              protein: 0.8,
              carbs: 13.5,
              fat: 0.2,
              fibre: 2.6,
              loggedAt: '2026-10-12T20:25:00Z',
              sourceSnapshot: { unitCalories: 55, unitProtein: 0.8, unitCarbs: 13.5, unitFat: 0.2, confidence: 'verified' }
            }
          ]
        },
        totals: {
          calories: 2057,
          protein: 75.0,
          carbs: 271.0,
          fat: 82.6,
          fibre: 36.4
        },
        targetSnapshot: {
          targetCalories: 2200,
          targetProtein: 120,
          maintenanceCalories: 2200,
          bmr: 1650,
          goal: 'maintain'
        },
        createdAt: '2026-10-12T21:00:00Z',
        updatedAt: '2026-10-12T21:00:00Z'
      };

      await db.put('dailyLogs', sampleOct12);
      localStorage.setItem('messmate_log_2026-10-12', JSON.stringify(sampleOct12));
    }

    // Seed sample weight history if empty
    const existingWeightsCount = await db.count('weightHistory');
    if (existingWeightsCount === 0) {
      const weights: WeightRecord[] = [
        { id: 'w_1', date: '2026-10-10', weight: 68.6, notes: 'Hostel gym morning weigh-in', recordedAt: '2026-10-10T07:00:00Z' },
        { id: 'w_2', date: '2026-10-14', weight: 68.3, notes: 'Post mid-term workout', recordedAt: '2026-10-14T07:15:00Z' },
        { id: 'w_3', date: '2026-10-18', weight: 68.0, notes: 'Consistent mess meal adherence', recordedAt: '2026-10-18T07:30:00Z' }
      ];
      for (const w of weights) {
        await db.put('weightHistory', w);
      }
      localStorage.setItem('messmate_weight', JSON.stringify(weights));
    }
  } catch (error) {
    console.error('Error initializing IndexedDB, falling back to LocalStorage:', error);
  }
}

// FOOD DATABASE OPERATIONS
export async function getFoodItems(): Promise<FoodItem[]> {
  try {
    const db = await getDB();
    const items = await db.getAll('foodItems');
    return items.length > 0 ? items : INITIAL_FOOD_DATABASE;
  } catch {
    const local = localStorage.getItem('messmate_foods');
    return local ? JSON.parse(local) : INITIAL_FOOD_DATABASE;
  }
}

export async function saveFoodItem(item: FoodItem): Promise<void> {
  try {
    const db = await getDB();
    await db.put('foodItems', item);
  } catch (e) {
    console.error('Failed to save food to IndexedDB:', e);
  }
  // Also sync in localStorage backup
  const all = await getFoodItems();
  const idx = all.findIndex(f => f.id === item.id);
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  localStorage.setItem('messmate_foods', JSON.stringify(all));
}

export async function deleteFoodItem(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('foodItems', id);
  } catch (e) {
    console.error('Failed to delete food from IndexedDB:', e);
  }
  const all = await getFoodItems();
  const filtered = all.filter(f => f.id !== id);
  localStorage.setItem('messmate_foods', JSON.stringify(filtered));
}

// MENU OPERATIONS
export async function getMenuForDate(dateStr: string): Promise<MessMenu | null> {
  try {
    const db = await getDB();
    const menu = await db.get('menus', dateStr);
    if (menu) return menu;
  } catch (e) {
    console.warn('IndexedDB menu fetch error:', e);
  }
  // Fallback to initial menus
  const found = INITIAL_MESS_MENUS.find(m => m.date === dateStr);
  return found || null;
}

export async function getAllMenus(): Promise<MessMenu[]> {
  try {
    const db = await getDB();
    const menus = await db.getAll('menus');
    return menus.length > 0 ? menus : INITIAL_MESS_MENUS;
  } catch {
    return INITIAL_MESS_MENUS;
  }
}

export async function saveMenu(menu: MessMenu): Promise<void> {
  try {
    const db = await getDB();
    await db.put('menus', menu);
  } catch (e) {
    console.error('Failed to save menu:', e);
  }
}

// DAILY LOG OPERATIONS
export async function getDailyLog(dateStr: string): Promise<DailyMealLog | null> {
  try {
    const db = await getDB();
    const log = await db.get('dailyLogs', dateStr);
    return log || null;
  } catch (e) {
    console.error('Failed to fetch daily log:', e);
    const local = localStorage.getItem(`messmate_log_${dateStr}`);
    return local ? JSON.parse(local) : null;
  }
}

export async function saveDailyLog(log: DailyMealLog): Promise<void> {
  try {
    const db = await getDB();
    await db.put('dailyLogs', log);
  } catch (e) {
    console.error('Failed to save daily log to IndexedDB:', e);
  }
  localStorage.setItem(`messmate_log_${log.date}`, JSON.stringify(log));
}

export async function getAllDailyLogs(): Promise<DailyMealLog[]> {
  try {
    const db = await getDB();
    const logs = await db.getAll('dailyLogs');
    return logs.sort((a, b) => a.date.localeCompare(b.date));
  } catch (e) {
    console.error('Failed to fetch all daily logs:', e);
    return [];
  }
}

// USER PROFILE OPERATIONS
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const db = await getDB();
    const profile = await db.get('userProfile', 'current_profile');
    if (profile) return profile;
  } catch (e) {
    console.warn('Profile fetch error:', e);
  }
  const local = localStorage.getItem('messmate_profile');
  return local ? JSON.parse(local) : DEFAULT_USER_PROFILE;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const db = await getDB();
    await db.put('userProfile', profile, 'current_profile');
  } catch (e) {
    console.error('Failed to save profile to IndexedDB:', e);
  }
  localStorage.setItem('messmate_profile', JSON.stringify(profile));
}

// WEIGHT RECORDS
export async function getWeightHistory(): Promise<WeightRecord[]> {
  try {
    const db = await getDB();
    const records = await db.getAll('weightHistory');
    return records.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    const local = localStorage.getItem('messmate_weight');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveWeightRecord(record: WeightRecord): Promise<void> {
  try {
    const db = await getDB();
    await db.put('weightHistory', record);
  } catch (e) {
    console.error('Failed to save weight record:', e);
  }
  const all = await getWeightHistory();
  const idx = all.findIndex(r => r.id === record.id || r.date === record.date);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  localStorage.setItem('messmate_weight', JSON.stringify(all));
}

export async function deleteWeightRecord(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('weightHistory', id);
  } catch (e) {
    console.error('Failed to delete weight record:', e);
  }
}

// EXPORT / IMPORT
export async function exportAllDataJSON(): Promise<string> {
  const [logs, foods, menus, profile, weightHistory] = await Promise.all([
    getAllDailyLogs(),
    getFoodItems(),
    getAllMenus(),
    getUserProfile(),
    getWeightHistory()
  ]);

  const payload = {
    app: 'MessMate',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profile,
    logs,
    foods,
    menus,
    weightHistory
  };

  return JSON.stringify(payload, null, 2);
}

export async function importAllDataJSON(jsonStr: string): Promise<{ success: boolean; message: string; importedLogsCount?: number }> {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || data.app !== 'MessMate') {
      return { success: false, message: 'Invalid file format. Please upload a valid MessMate backup JSON file.' };
    }

    const db = await getDB();

    if (data.profile) {
      await saveUserProfile(data.profile);
    }

    if (Array.isArray(data.foods)) {
      const tx = db.transaction('foodItems', 'readwrite');
      for (const food of data.foods) {
        await tx.store.put(food);
      }
      await tx.done;
    }

    if (Array.isArray(data.menus)) {
      const tx = db.transaction('menus', 'readwrite');
      for (const menu of data.menus) {
        await tx.store.put(menu);
      }
      await tx.done;
    }

    let logsCount = 0;
    if (Array.isArray(data.logs)) {
      const tx = db.transaction('dailyLogs', 'readwrite');
      for (const log of data.logs) {
        await tx.store.put(log);
        localStorage.setItem(`messmate_log_${log.date}`, JSON.stringify(log));
        logsCount++;
      }
      await tx.done;
    }

    if (Array.isArray(data.weightHistory)) {
      const tx = db.transaction('weightHistory', 'readwrite');
      for (const wr of data.weightHistory) {
        await tx.store.put(wr);
      }
      await tx.done;
    }

    return {
      success: true,
      message: `Successfully imported backup with ${logsCount} meal logs, ${data.foods?.length || 0} food items, and profile!`,
      importedLogsCount: logsCount
    };
  } catch (error: any) {
    return { success: false, message: `Import error: ${error?.message || 'Failed to parse JSON file'}` };
  }
}

export async function exportLogsToCSV(): Promise<string> {
  const logs = await getAllDailyLogs();
  const headers = [
    'Date',
    'Meal',
    'Food Name',
    'Portion',
    'Serving Unit',
    'Calories (kcal)',
    'Protein (g)',
    'Carbs (g)',
    'Fat (g)',
    'Daily Target (kcal)',
    'Daily Consumed (kcal)',
    'Daily Remaining (kcal)'
  ];

  const rows: string[] = [headers.join(',')];

  for (const log of logs) {
    const dailyTarget = log.targetSnapshot.targetCalories;
    const dailyConsumed = log.totals.calories;
    const dailyRemaining = dailyTarget - dailyConsumed;

    const meals: ('breakfast' | 'lunch' | 'snacks' | 'dinner')[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
    for (const meal of meals) {
      for (const item of log.meals[meal]) {
        rows.push([
          log.date,
          meal.toUpperCase(),
          `"${item.name.replace(/"/g, '""')}"`,
          item.portion,
          `"${item.servingUnit}"`,
          item.calories,
          item.protein,
          item.carbs,
          item.fat,
          dailyTarget,
          dailyConsumed,
          dailyRemaining
        ].join(','));
      }
    }
  }

  return rows.join('\n');
}
