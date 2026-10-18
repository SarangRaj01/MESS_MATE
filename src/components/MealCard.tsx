import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, FoodItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Sun,
  Sunset,
  Moon,
  Plus,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface MealCardProps {
  category: MealCategory;
  onOpenAddModal: (category: MealCategory) => void;
}

const MEAL_CONFIG: Record<
  MealCategory,
  {
    title: string;
    icon: React.ReactNode;
    color: string;
    bgAccent: string;
    defaultTiming: string;
  }
> = {
  breakfast: {
    title: 'Breakfast',
    icon: <Coffee className="w-4 h-4 text-[#C85A32]" />,
    color: 'text-[#C85A32]',
    bgAccent: 'bg-[#FAF0EB]',
    defaultTiming: '7:30 AM – 9:30 AM'
  },
  lunch: {
    title: 'Lunch',
    icon: <Sun className="w-4 h-4 text-[#C8872B]" />,
    color: 'text-[#C8872B]',
    bgAccent: 'bg-[#FCF8F2]',
    defaultTiming: '12:30 PM – 2:30 PM'
  },
  snacks: {
    title: 'Evening Snacks',
    icon: <Sunset className="w-4 h-4 text-[#D9653B]" />,
    color: 'text-[#D9653B]',
    bgAccent: 'bg-[#FAF2EE]',
    defaultTiming: '4:30 PM – 6:15 PM'
  },
  dinner: {
    title: 'Dinner',
    icon: <Moon className="w-4 h-4 text-[#4A5D6E]" />,
    color: 'text-[#4A5D6E]',
    bgAccent: 'bg-[#F2F5F8]',
    defaultTiming: '7:00 PM – 9:00 PM'
  }
};

export const MealCard: React.FC<MealCardProps> = ({ category, onOpenAddModal }) => {
  const { currentLog, currentMenu, foodDatabase, updateMealItemPortion, removeMealItem, addMealItem } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const config = MEAL_CONFIG[category];
  const loggedItems = currentLog.meals[category] || [];

  const mealCalories = loggedItems.reduce((sum, item) => sum + item.calories, 0);
  const mealProtein = loggedItems.reduce((sum, item) => sum + item.protein, 0);

  const timing = currentMenu?.meals?.[category]?.timing || config.defaultTiming;

  const menuFoodIds = currentMenu?.meals?.[category]?.itemIds || [];
  const menuFoods: FoodItem[] = menuFoodIds
    .map(id => foodDatabase.find(f => f.id === id))
    .filter((f): f is FoodItem => Boolean(f));

  const handleQuickAdd = async (food: FoodItem) => {
    await addMealItem(category, food, 1.0);
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE0]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.bgAccent} border border-[#EAE3D6]`}>
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-editorial font-medium text-lg text-[#221F1D]">{config.title}</h3>
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#6E675F] bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#E8E2D5]">
                <Clock className="w-3 h-3 text-[#8C8278]" />
                {timing}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8C8278] mt-0.5">
              <span>{loggedItems.length} {loggedItems.length === 1 ? 'item' : 'items'} logged</span>
              {mealProtein > 0 && (
                <span className="text-[#2D6A4F] font-semibold">• {mealProtein.toFixed(1)}g protein</span>
              )}
            </div>
          </div>
        </div>

        {/* Meal Total */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-serif-editorial text-2xl font-semibold text-[#221F1D]">{mealCalories}</span>
            <span className="text-xs font-semibold text-[#8C8278] ml-1">kcal</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-[#8C8278] hover:text-[#221F1D] hover:bg-[#FAF5ED] transition-all"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            {/* List of Logged Items */}
            {loggedItems.length > 0 ? (
              <div className="space-y-2">
                {loggedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6] hover:border-[#D8CFBF] transition-all"
                  >
                    <div className="flex-1 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#221F1D]">{item.name}</span>
                        {item.sourceSnapshot.confidence === 'verified' && (
                          <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#EAF3EE] px-1.5 py-0.2 rounded border border-[#D0E5D7]">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6E675F] mt-0.5">
                        <span className="font-semibold text-[#C85A32]">{item.calories} kcal</span>
                        <span>•</span>
                        <span>P: {item.protein}g</span>
                        <span>•</span>
                        <span>C: {item.carbs}g</span>
                        <span>•</span>
                        <span>F: {item.fat}g</span>
                      </div>
                    </div>

                    {/* Portion Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-[#DCD5C8] rounded-xl p-0.5">
                        <button
                          onClick={() => updateMealItemPortion(category, item.id, Math.max(0.25, item.portion - 0.5))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF5ED] text-[#221F1D] font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#221F1D] min-w-[44px] text-center">
                          {item.portion}x
                        </span>
                        <button
                          onClick={() => updateMealItemPortion(category, item.id, item.portion + 0.5)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF5ED] text-[#221F1D] font-bold text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeMealItem(category, item.id)}
                        className="p-2 rounded-xl text-[#8C8278] hover:text-[#C85A32] hover:bg-[#FAF0EB] transition-all"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 px-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#E0D8CB]">
                <p className="text-xs text-[#6E675F]">
                  No items logged for {config.title.toLowerCase()} yet.
                </p>
              </div>
            )}

            {/* Quick add chips from today's mess menu */}
            {menuFoods.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#EFEAE0]">
                <div className="flex items-center justify-between text-xs text-[#6E675F] mb-2">
                  <span className="flex items-center gap-1 font-semibold text-[#221F1D]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                    Today's Mess Counter:
                  </span>
                  <span className="text-[11px] text-[#8C8278]">Tap to log 1 serving</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {menuFoods.map((food) => {
                    const isAlreadyLogged = loggedItems.some(i => i.foodItemId === food.id);
                    return (
                      <button
                        key={food.id}
                        onClick={() => handleQuickAdd(food)}
                        className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                          isAlreadyLogged
                            ? 'bg-[#FAF0EB] border-[#F3D5C7] text-[#C85A32] font-semibold'
                            : 'bg-white hover:bg-[#FAF5ED] border-[#E2DAD0] text-[#4A433D] hover:text-[#221F1D]'
                        }`}
                      >
                        <span>{food.icon || '🍽️'}</span>
                        <span className="font-medium">{food.name}</span>
                        <span className="text-[10px] text-[#8C8278] font-mono">{food.calories} kcal</span>
                        <Plus className="w-3 h-3 text-[#C85A32]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Add Food Button */}
            <div className="mt-4">
              <button
                onClick={() => onOpenAddModal(category)}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF5ED] hover:bg-[#F3ECE1] text-[#221F1D] font-semibold text-xs sm:text-sm border border-[#E2DAD0] transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C85A32]" />
                <span>Browse Full Menu & Custom Foods</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
