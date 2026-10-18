import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, FoodItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Plus,
  Dumbbell,
  Check,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: MealCategory;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, category }) => {
  const { currentMenu, foodDatabase, addMealItem, addCustomFood } = useApp();

  const [activeTab, setActiveTab] = useState<'menu' | 'database' | 'custom'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'high_protein' | 'low_cal'>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portion, setPortion] = useState<number>(1.0);

  const [customName, setCustomName] = useState('');
  const [customServingUnit, setCustomServingUnit] = useState('serving');
  const [customCalories, setCustomCalories] = useState<number>(150);
  const [customProtein, setCustomProtein] = useState<number>(5);
  const [customCarbs, setCustomCarbs] = useState<number>(20);
  const [customFat, setCustomFat] = useState<number>(4);
  const [customFibre, setCustomFibre] = useState<number>(2);

  const menuFoodIds = currentMenu?.meals?.[category]?.itemIds || [];
  const menuFoods: FoodItem[] = useMemo(() => {
    return menuFoodIds
      .map(id => foodDatabase.find(f => f.id === id))
      .filter((f): f is FoodItem => Boolean(f));
  }, [menuFoodIds, foodDatabase]);

  const displayedFoods = useMemo(() => {
    const list = activeTab === 'menu' ? menuFoods : foodDatabase;
    return list.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterTag === 'high_protein') return item.protein >= 7.0;
      if (filterTag === 'low_cal') return item.calories <= 120;
      return true;
    });
  }, [activeTab, menuFoods, foodDatabase, searchQuery, filterTag]);

  const portionPresets = [0.5, 1.0, 1.5, 2.0, 3.0];

  const calcCalories = selectedFood ? Math.round(selectedFood.calories * portion) : 0;
  const calcProtein = selectedFood ? Number((selectedFood.protein * portion).toFixed(1)) : 0;

  const handleConfirmAdd = async () => {
    if (!selectedFood) return;
    await addMealItem(category, selectedFood, portion);
    onClose();
    setSelectedFood(null);
    setPortion(1.0);
  };

  const handleCreateAndAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const created = await addCustomFood({
      name: customName.trim(),
      category,
      servingSize: 1,
      servingUnit: customServingUnit.trim() || 'serving',
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fibre: Number(customFibre) || 0,
      source: 'User Custom Input',
      confidence: 'estimated',
      notes: 'Custom user mess item'
    });

    await addMealItem(category, created, portion);
    onClose();
    setCustomName('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-[#E8E2D5] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EFEAE0]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial font-medium text-xl text-[#221F1D]">
                  Add Food to <span className="capitalize text-[#C85A32]">{category}</span>
                </h3>
              </div>
              <p className="text-xs text-[#6E675F] mt-0.5">
                Pick from today's VIT mess menu or search the complete food library
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8C8278] hover:text-[#221F1D] hover:bg-[#FAF5ED] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-2 bg-[#FAF7F2] border-b border-[#EFEAE0] text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('menu'); setSelectedFood(null); }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'menu'
                  ? 'bg-white text-[#221F1D] font-bold shadow-xs border border-[#E8E2D5]'
                  : 'text-[#6E675F] hover:text-[#221F1D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Today's Menu ({menuFoods.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('database'); setSelectedFood(null); }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'database'
                  ? 'bg-white text-[#221F1D] font-bold shadow-xs border border-[#E8E2D5]'
                  : 'text-[#6E675F] hover:text-[#221F1D]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C8872B]" />
              <span>Full Library ({foodDatabase.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('custom'); setSelectedFood(null); }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'custom'
                  ? 'bg-white text-[#221F1D] font-bold shadow-xs border border-[#E8E2D5]'
                  : 'text-[#6E675F] hover:text-[#221F1D]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Custom Food</span>
            </button>
          </div>

          {activeTab !== 'custom' ? (
            <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-5">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C8278] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab === 'menu' ? "today's menu..." : 'all foods...'}`}
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-sm text-[#221F1D] placeholder-[#8C8278] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterTag('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterTag === 'all'
                        ? 'bg-[#221F1D] text-white'
                        : 'bg-[#FAF5ED] text-[#6E675F] hover:text-[#221F1D] border border-[#E8E2D5]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterTag('high_protein')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      filterTag === 'high_protein'
                        ? 'bg-[#EAF3EE] text-[#2D6A4F] border border-[#D0E5D7]'
                        : 'bg-[#FAF5ED] text-[#6E675F] hover:text-[#2D6A4F] border border-[#E8E2D5]'
                    }`}
                  >
                    <Dumbbell className="w-3 h-3" />
                    High Protein
                  </button>
                  <button
                    onClick={() => setFilterTag('low_cal')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterTag === 'low_cal'
                        ? 'bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7]'
                        : 'bg-[#FAF5ED] text-[#6E675F] hover:text-[#C85A32] border border-[#E8E2D5]'
                    }`}
                  >
                    Low Calorie
                  </button>
                </div>
              </div>

              {/* Food List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[280px]">
                {displayedFoods.length > 0 ? (
                  displayedFoods.map((food) => {
                    const isSelected = selectedFood?.id === food.id;
                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#FAF0EB] border-[#F3D5C7] shadow-xs'
                            : 'bg-[#FDFBF7] border-[#EAE3D6] hover:bg-[#F8F4EC]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl p-1.5 rounded-xl bg-white border border-[#E8E2D5]">
                            {food.icon || '🍛'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#221F1D]">{food.name}</span>
                              <span className="text-[10px] text-[#8C8278]">
                                ({food.servingSize} {food.servingUnit})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#6E675F] mt-0.5">
                              <span className="text-[#C85A32] font-semibold">{food.calories} kcal</span>
                              <span>•</span>
                              <span className="text-[#2D6A4F]">P: {food.protein}g</span>
                              <span>•</span>
                              <span>C: {food.carbs}g</span>
                              <span>•</span>
                              <span>F: {food.fat}g</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-[#C85A32] text-white flex items-center justify-center font-bold">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-[#D8D0C2] text-[#8C8278] flex items-center justify-center">
                              <Plus className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-[#8C8278] text-xs">
                    No foods found matching "{searchQuery}". Try the full food library tab or create a custom item!
                  </div>
                )}
              </div>

              {/* Portion & Confirm Section */}
              {selectedFood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-[#EFEAE0] bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-[#8C8278]">Selected Food:</span>
                      <div className="text-sm font-semibold text-[#221F1D]">
                        {selectedFood.name} ({selectedFood.servingUnit})
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E5DFD5]">
                      <span className="text-[#C85A32] font-semibold text-sm">{calcCalories} kcal</span>
                      <span className="text-[#2D6A4F] font-semibold">{calcProtein}g protein</span>
                    </div>
                  </div>

                  {/* Portion Presets */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#6E675F] font-medium">Portion:</span>
                    <div className="flex items-center gap-1.5">
                      {portionPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setPortion(preset)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                            portion === preset
                              ? 'bg-[#C85A32] text-white shadow-xs'
                              : 'bg-white text-[#6E675F] hover:bg-[#F3ECE1] border border-[#E5DFD5]'
                          }`}
                        >
                          {preset}x
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="10"
                      value={portion}
                      onChange={(e) => setPortion(Math.max(0.25, parseFloat(e.target.value) || 1))}
                      className="w-16 px-2 py-1 bg-white border border-[#DCD5C8] rounded-lg text-xs font-mono text-center text-[#221F1D]"
                    />
                  </div>

                  <button
                    onClick={handleConfirmAdd}
                    className="w-full py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B64D28] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log {portion}x Portion ({calcCalories} kcal)</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            /* Custom Food Form */
            <form onSubmit={handleCreateAndAddCustom} className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A433D] mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa, Egg Omelette, Paneer Roll"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A433D] mb-1">Serving Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. piece, bowl (150g)"
                    value={customServingUnit}
                    onChange={(e) => setCustomServingUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A433D] mb-1">Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2D6A4F] mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#B26B1E] mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#C85A32] mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customFat}
                    onChange={(e) => setCustomFat(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A6B53] mb-1">Fibre (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customFibre}
                    onChange={(e) => setCustomFibre(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0D8CB] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B64D28] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Food & Log to {category}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
