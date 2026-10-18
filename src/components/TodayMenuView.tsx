import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, FoodItem, MessMenu } from '../types';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Plus,
  Check,
  Edit3
} from 'lucide-react';

export const TodayMenuView: React.FC = () => {
  const {
    selectedDate,
    currentMenu,
    foodDatabase,
    currentLog,
    addMealItem,
    updateMenu
  } = useApp();

  const [isEditingMenu, setIsEditingMenu] = useState<boolean>(false);

  const categories: MealCategory[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

  const categoryHeaders: Record<MealCategory, { title: string; defaultTiming: string }> = {
    breakfast: { title: 'Breakfast', defaultTiming: '7:30 AM – 9:30 AM' },
    lunch: { title: 'Lunch', defaultTiming: '12:30 PM – 2:30 PM' },
    snacks: { title: 'Evening Snacks', defaultTiming: '4:30 PM – 6:15 PM' },
    dinner: { title: 'Dinner', defaultTiming: '7:00 PM – 9:00 PM' }
  };

  const handleLogFood = async (meal: MealCategory, food: FoodItem) => {
    await addMealItem(meal, food, 1.0);
  };

  return (
    <div className="space-y-6">
      {/* Menu Header Banner */}
      <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C8278]">
              VIT Vellore Mess Schedule
            </span>
          </div>
          <h2 className="font-serif-editorial font-medium text-2xl sm:text-3xl text-[#221F1D] mt-1">
            {currentMenu?.title || 'Daily College Mess Menu'}
          </h2>
          <p className="text-xs text-[#6E675F] mt-0.5">
            Date: <span className="text-[#221F1D] font-semibold">{selectedDate}</span> •{' '}
            {currentMenu?.dayName || 'Standard Day'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingMenu(!isEditingMenu)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF5ED] hover:bg-[#F3ECE1] text-[#221F1D] text-xs font-semibold border border-[#E2DAD0] transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>{isEditingMenu ? 'Close Menu Editor' : 'Edit / Add Menu'}</span>
          </button>
        </div>
      </div>

      {/* Manual Menu Editor */}
      {isEditingMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-3xl bg-white border border-[#E8E2D5] p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3">
            <h3 className="font-serif-editorial font-medium text-lg text-[#221F1D]">
              Custom Menu Editor ({selectedDate})
            </h3>
            <span className="text-xs text-[#6E675F]">
              Tap items to toggle them on today's mess menu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const currentItemIds = currentMenu?.meals?.[cat]?.itemIds || [];
              return (
                <div key={cat} className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6]">
                  <h4 className="text-xs font-bold text-[#C85A32] uppercase mb-2 capitalize tracking-wider">
                    {cat} Options ({currentItemIds.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {foodDatabase
                      .filter(f => f.category === cat || f.category === 'all')
                      .map((food) => {
                        const isInMenu = currentItemIds.includes(food.id);
                        return (
                          <div
                            key={food.id}
                            onClick={async () => {
                              const updatedIds = isInMenu
                                ? currentItemIds.filter(id => id !== food.id)
                                : [...currentItemIds, food.id];
                              
                              const updatedMenu: MessMenu = {
                                id: currentMenu?.id || `menu_${selectedDate}`,
                                date: selectedDate,
                                dayName: currentMenu?.dayName || 'Day',
                                title: currentMenu?.title || 'Custom Mess Menu',
                                meals: {
                                  breakfast: currentMenu?.meals?.breakfast || { timing: '7:30 AM – 9:30 AM', itemIds: [] },
                                  lunch: currentMenu?.meals?.lunch || { timing: '12:30 PM – 2:30 PM', itemIds: [] },
                                  snacks: currentMenu?.meals?.snacks || { timing: '4:30 PM – 6:15 PM', itemIds: [] },
                                  dinner: currentMenu?.meals?.dinner || { timing: '7:00 PM – 9:00 PM', itemIds: [] },
                                  [cat]: {
                                    timing: currentMenu?.meals?.[cat]?.timing || categoryHeaders[cat].defaultTiming,
                                    itemIds: updatedIds
                                  }
                                }
                              };
                              await updateMenu(updatedMenu);
                            }}
                            className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer border transition-all ${
                              isInMenu
                                ? 'bg-[#FAF0EB] border-[#F3D5C7] text-[#C85A32] font-semibold'
                                : 'bg-white border-[#EAE3D6] text-[#6E675F] hover:text-[#221F1D]'
                            }`}
                          >
                            <span>{food.icon || '🍽️'} {food.name}</span>
                            {isInMenu && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 4 Meal Menu Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const slot = currentMenu?.meals?.[cat];
          const timing = slot?.timing || categoryHeaders[cat].defaultTiming;
          const itemIds = slot?.itemIds || [];
          const foods: FoodItem[] = itemIds
            .map(id => foodDatabase.find(f => f.id === id))
            .filter((f): f is FoodItem => Boolean(f));

          const loggedInThisMeal = currentLog.meals[cat] || [];

          return (
            <div
              key={cat}
              className="rounded-3xl bg-white border border-[#E8E2D5] p-6 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE0]">
                  <div>
                    <h3 className="font-serif-editorial font-medium text-xl text-[#221F1D] capitalize">
                      {categoryHeaders[cat].title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E675F] mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C8278]" />
                      <span>{timing}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF5ED] text-[#6E675F] font-semibold border border-[#E2DAD0]">
                    {foods.length} items
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {foods.length > 0 ? (
                    foods.map((food) => {
                      const loggedCount = loggedInThisMeal
                        .filter(l => l.foodItemId === food.id)
                        .reduce((sum, l) => sum + l.portion, 0);

                      return (
                        <div
                          key={food.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6] hover:border-[#D8CFBF] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{food.icon || '🍛'}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[#221F1D]">
                                  {food.name}
                                </span>
                                {food.protein >= 8 && (
                                  <span className="text-[9px] font-bold text-[#2D6A4F] bg-[#EAF3EE] px-1.5 py-0.2 rounded border border-[#D0E5D7]">
                                    High Protein
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#6E675F] mt-0.5">
                                <span className="text-[#C85A32] font-semibold">{food.calories} kcal</span>
                                <span>•</span>
                                <span className="text-[#2D6A4F]">P: {food.protein}g</span>
                                <span>•</span>
                                <span>C: {food.carbs}g</span>
                                <span>•</span>
                                <span>F: {food.fat}g</span>
                                <span className="hidden sm:inline text-[#8C8278]">({food.servingUnit})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {loggedCount > 0 && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#EAF3EE] text-[#2D6A4F] border border-[#D0E5D7]">
                                {loggedCount}x Logged
                              </span>
                            )}
                            <button
                              onClick={() => handleLogFood(cat, food)}
                              className="px-3 py-1.5 rounded-xl bg-[#FAF0EB] hover:bg-[#F5E5DC] text-[#C85A32] font-semibold text-xs border border-[#F3D5C7] flex items-center gap-1 transition-all"
                              title="Log 1 serving"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Eat</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-[#8C8278] bg-[#FAF7F2] rounded-2xl border border-dashed border-[#E0D8CB]">
                      No menu set for {cat} on this date. Click "Edit / Add Menu" to set items!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
