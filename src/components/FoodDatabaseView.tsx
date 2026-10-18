import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, FoodItem } from '../types';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Dumbbell,
  Trash2,
  Edit2,
  X
} from 'lucide-react';

export const FoodDatabaseView: React.FC = () => {
  const { foodDatabase, addCustomFood, updateFood, deleteFood } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>('all');
  const [filterProtein, setFilterProtein] = useState(false);
  const [filterLowCal, setFilterLowCal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<MealCategory>('lunch');
  const [servingSize, setServingSize] = useState(1);
  const [servingUnit, setServingUnit] = useState('serving');
  const [calories, setCalories] = useState(150);
  const [protein, setProtein] = useState(6);
  const [carbs, setCarbs] = useState(20);
  const [fat, setFat] = useState(5);
  const [fibre, setFibre] = useState(2);
  const [notes, setNotes] = useState('');

  const filteredFoods = useMemo(() => {
    return foodDatabase.filter(food => {
      if (selectedCategory !== 'all' && food.category !== selectedCategory && food.category !== 'all') {
        return false;
      }
      if (search) {
        const query = search.toLowerCase();
        const matches =
          food.name.toLowerCase().includes(query) ||
          food.notes?.toLowerCase().includes(query) ||
          food.tags?.some(t => t.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (filterProtein && food.protein < 8) return false;
      if (filterLowCal && food.calories > 130) return false;
      return true;
    });
  }, [foodDatabase, selectedCategory, search, filterProtein, filterLowCal]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingFood) {
      await updateFood({
        ...editingFood,
        name: name.trim(),
        category,
        servingSize,
        servingUnit: servingUnit.trim() || 'serving',
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fibre: Number(fibre) || 0,
        notes: notes.trim()
      });
      setEditingFood(null);
    } else {
      await addCustomFood({
        name: name.trim(),
        category,
        servingSize,
        servingUnit: servingUnit.trim() || 'serving',
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fibre: Number(fibre) || 0,
        source: 'User Custom Entry',
        confidence: 'estimated',
        notes: notes.trim() || 'Custom mess preparation',
        icon: '🍱'
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleStartEdit = (food: FoodItem) => {
    setEditingFood(food);
    setName(food.name);
    setCategory(food.category === 'all' ? 'lunch' : food.category);
    setServingSize(food.servingSize);
    setServingUnit(food.servingUnit);
    setCalories(food.calories);
    setProtein(food.protein);
    setCarbs(food.carbs);
    setFat(food.fat);
    setFibre(food.fibre || 0);
    setNotes(food.notes || '');
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setEditingFood(null);
    setName('');
    setCategory('lunch');
    setServingSize(1);
    setServingUnit('serving');
    setCalories(150);
    setProtein(6);
    setCarbs(20);
    setFat(5);
    setFibre(2);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial font-medium text-2xl sm:text-3xl text-[#221F1D]">
            Mess Food & Nutrition Library
          </h2>
          <p className="text-xs text-[#6E675F] mt-1">
            Verified Indian food metrics calibrated to typical VIT Vellore mess recipes
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B64D28] text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Food</span>
        </button>
      </div>

      {/* Controls Bar: Search & Category tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C8278] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dosa, paneer, biryani, dal, poriyal..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0D8CB] rounded-2xl text-sm text-[#221F1D] placeholder-[#8C8278] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Quick Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterProtein(!filterProtein)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              filterProtein
                ? 'bg-[#EAF3EE] text-[#2D6A4F] border border-[#D0E5D7]'
                : 'bg-white text-[#6E675F] hover:text-[#221F1D] border border-[#E8E2D5]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>High Protein (&gt;8g)</span>
          </button>
          <button
            onClick={() => setFilterLowCal(!filterLowCal)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterLowCal
                ? 'bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7]'
                : 'bg-white text-[#6E675F] hover:text-[#221F1D] border border-[#E8E2D5]'
            }`}
          >
            <span>Low Calorie (&lt;130 kcal)</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
        {(['all', 'breakfast', 'lunch', 'snacks', 'dinner'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-[#221F1D] text-white font-semibold'
                : 'bg-white text-[#6E675F] hover:text-[#221F1D] border border-[#E8E2D5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="rounded-3xl bg-white border border-[#E8E2D5] p-5 hover:border-[#D0C7B8] transition-all flex flex-col justify-between shadow-[0_2px_8px_-2px_rgba(45,35,25,0.03)]"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-2xl bg-[#FAF5ED] border border-[#EAE3D6]">
                    {food.icon || '🍛'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-[#221F1D]">{food.name}</h4>
                    <span className="text-xs text-[#8C8278]">
                      Serving: {food.servingSize} {food.servingUnit}
                    </span>
                  </div>
                </div>

                {food.isCustom && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7]">
                    Custom
                  </span>
                )}
              </div>

              {/* Macro stats */}
              <div className="grid grid-cols-4 gap-2 my-4 p-3 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6] text-center">
                <div>
                  <div className="text-[10px] text-[#8C8278] font-medium">Calories</div>
                  <div className="font-serif-editorial text-base font-semibold text-[#C85A32]">{food.calories}</div>
                  <div className="text-[9px] text-[#8C8278]">kcal</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8C8278] font-medium">Protein</div>
                  <div className="font-serif-editorial text-base font-semibold text-[#2D6A4F]">{food.protein}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8C8278] font-medium">Carbs</div>
                  <div className="font-serif-editorial text-base font-semibold text-[#B26B1E]">{food.carbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8C8278] font-medium">Fat</div>
                  <div className="font-serif-editorial text-base font-semibold text-[#6E675F]">{food.fat}g</div>
                </div>
              </div>

              {food.notes && (
                <p className="text-xs text-[#6E675F] italic line-clamp-2 mb-3">"{food.notes}"</p>
              )}
            </div>

            {/* Bottom info & actions */}
            <div className="pt-3 border-t border-[#EFEAE0] flex items-center justify-between text-xs text-[#8C8278]">
              <span className="truncate max-w-[170px]" title={food.source}>
                {food.source}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(food)}
                  className="p-1.5 rounded-lg hover:bg-[#FAF5ED] text-[#8C8278] hover:text-[#221F1D] transition-colors"
                  title="Edit nutrition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {food.isCustom && (
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="p-1.5 rounded-lg hover:bg-[#FAF0EB] text-[#8C8278] hover:text-[#C85A32] transition-colors"
                    title="Delete custom food"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-3">
              <h3 className="font-serif-editorial font-medium text-xl text-[#221F1D]">
                {editingFood ? 'Edit Food Nutrition' : 'Add Custom Food Item'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8C8278] hover:text-[#221F1D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A433D] mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masala Dosa, Egg Omelette"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A433D] mb-1">Meal Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MealCategory)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A433D] mb-1">Serving Unit</label>
                  <input
                    type="text"
                    value={servingUnit}
                    onChange={(e) => setServingUnit(e.target.value)}
                    placeholder="e.g. piece, bowl (150g)"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#C85A32] mb-1">Calories</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2D6A4F] mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#B26B1E] mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E675F] mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-xs text-[#221F1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A433D] mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. prepared in sunflower oil, mild spice"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl text-sm text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5ED] text-[#6E675F] text-xs font-semibold hover:bg-[#F3ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-semibold hover:bg-[#B64D28] shadow-sm"
                >
                  {editingFood ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
