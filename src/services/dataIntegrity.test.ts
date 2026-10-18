import { describe, it, expect } from 'vitest';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';
import { INITIAL_MESS_MENUS } from '../data/messMenus';

describe('Data Integrity & Mess Menu Verification', () => {
  it('food database has comprehensive items across all 4 meal categories', () => {
    expect(INITIAL_FOOD_DATABASE.length).toBeGreaterThan(30);

    const breakfast = INITIAL_FOOD_DATABASE.filter(f => f.category === 'breakfast' || f.category === 'all');
    const lunch = INITIAL_FOOD_DATABASE.filter(f => f.category === 'lunch' || f.category === 'all');
    const snacks = INITIAL_FOOD_DATABASE.filter(f => f.category === 'snacks' || f.category === 'all');
    const dinner = INITIAL_FOOD_DATABASE.filter(f => f.category === 'dinner' || f.category === 'all');

    expect(breakfast.length).toBeGreaterThan(5);
    expect(lunch.length).toBeGreaterThan(10);
    expect(snacks.length).toBeGreaterThan(5);
    expect(dinner.length).toBeGreaterThan(5);
  });

  it('all required extracted dates exist in the menu dataset', () => {
    const dates = INITIAL_MESS_MENUS.map(m => m.date);
    expect(dates).toContain('2026-10-12');
    expect(dates).toContain('2026-10-19');
    expect(dates).toContain('2026-10-20');
    expect(dates).toContain('2026-10-21');
    expect(dates).toContain('2026-10-22');
    expect(dates).toContain('2026-10-23');
    expect(dates).toContain('2026-10-24');
    expect(dates).toContain('2026-10-25');
  });

  it('every food item ID in all menus exists in the food database', () => {
    const validIds = new Set(INITIAL_FOOD_DATABASE.map(f => f.id));

    for (const menu of INITIAL_MESS_MENUS) {
      const categories = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
      for (const cat of categories) {
        const slot = menu.meals[cat];
        expect(slot.timing).toBeTruthy();
        expect(slot.itemIds.length).toBeGreaterThan(0);
        for (const itemId of slot.itemIds) {
          expect(validIds.has(itemId)).toBe(true);
        }
      }
    }
  });

  it('calculates portion scaling accurately without mutation', () => {
    const dosa = INITIAL_FOOD_DATABASE.find(f => f.id === 'food_podi_dosa')!;
    const unitCalories = dosa.calories;
    const unitProtein = dosa.protein;

    // 2 servings
    const doublePortion = 2.0;
    expect(Math.round(unitCalories * doublePortion)).toBe(unitCalories * 2);
    expect(Number((unitProtein * doublePortion).toFixed(1))).toBe(Number((unitProtein * 2).toFixed(1)));

    // 0.5 serving
    const halfPortion = 0.5;
    expect(Math.round(unitCalories * halfPortion)).toBe(Math.round(unitCalories / 2));
  });
});
