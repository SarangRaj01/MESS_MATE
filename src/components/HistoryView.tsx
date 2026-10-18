import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, DailyMealLog } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    allLogs,
    setActiveTab,
    goToToday,
    goToYesterday
  } = useApp();

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const parts = selectedDate.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  });

  const categories: MealCategory[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = allLogs.find(l => l.date === dateStr);
      days.push({ dayNumber: d, dateStr, log });
    }
    return days;
  }, [currentMonth, allLogs]);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectedRecord: DailyMealLog | undefined = allLogs.find(l => l.date === selectedDate);
  const hasLog = Boolean(selectedRecord && selectedRecord.totals.calories > 0);

  const target = selectedRecord?.targetSnapshot?.targetCalories || 2200;
  const consumed = selectedRecord?.totals.calories || 0;
  const remaining = target - consumed;
  const isExceeded = remaining < 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial font-medium text-2xl sm:text-3xl text-[#221F1D]">
            Daily Meal & Nutrition History
          </h2>
          <p className="text-xs text-[#6E675F] mt-1">
            Browse verified past days, revisit historical targets, and edit previous logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7] text-xs font-semibold hover:bg-[#F5E5DC] transition-all"
          >
            Today
          </button>
          <button
            onClick={goToYesterday}
            className="px-3.5 py-1.5 rounded-xl bg-[#FAF5ED] text-[#6E675F] border border-[#E2DAD0] text-xs font-semibold hover:bg-[#F3ECE1] transition-all"
          >
            Yesterday
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2D5] p-6 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE0]">
              <h3 className="font-serif-editorial font-medium text-lg text-[#221F1D] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#C85A32]" />
                <span>{monthName}</span>
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg bg-[#FAF5ED] text-[#6E675F] hover:text-[#221F1D]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg bg-[#FAF5ED] text-[#6E675F] hover:text-[#221F1D]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#8C8278] my-3">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((item, idx) => {
                if (!item) {
                  return <div key={`empty_${idx}`} className="h-12" />;
                }

                const isSelected = selectedDate === item.dateStr;
                const isLogged = Boolean(item.log && item.log.totals.calories > 0);

                return (
                  <button
                    key={item.dateStr}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center relative border transition-all text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#C85A32] text-white font-bold border-[#B84E28] shadow-sm'
                        : isLogged
                        ? 'bg-[#FAF0EB] text-[#C85A32] border-[#F3D5C7] hover:bg-[#F5E5DC]'
                        : 'bg-[#FDFBF7] text-[#6E675F] border-[#EAE3D6] hover:bg-[#FAF5ED]'
                    }`}
                  >
                    <span>{item.dayNumber}</span>
                    {isLogged && (
                      <span
                        className={`text-[9px] font-mono leading-none ${
                          isSelected ? 'text-white/90' : 'text-[#C85A32]'
                        }`}
                      >
                        {item.log?.totals.calories}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFEAE0] flex items-center justify-between text-[11px] text-[#8C8278]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32]" />
              <span>Logged Day</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAE3D6]" />
              <span>No Meals Logged</span>
            </span>
          </div>
        </div>

        {/* Right Column: Historical Record Details */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E8E2D5] p-6 shadow-[0_2px_12px_-2px_rgba(45,35,25,0.03)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFEAE0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#8C8278] tracking-wider">
                  Log Inspection
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#221F1D] border border-[#E2DAD0]">
                  {selectedDate}
                </span>
              </div>
              <h3 className="font-serif-editorial font-medium text-2xl text-[#221F1D] mt-1">
                {hasLog ? 'Confirmed Meal Record' : 'No Meals Recorded for this Day'}
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B64D28] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Edit / Add in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasLog ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 rounded-xl bg-white border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#8C8278] uppercase font-semibold">Target</span>
                  <div className="font-serif-editorial text-lg font-semibold text-[#221F1D]">{target}</div>
                  <span className="text-[10px] text-[#8C8278]">kcal</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#8C8278] uppercase font-semibold">Consumed</span>
                  <div className="font-serif-editorial text-lg font-semibold text-[#C85A32]">{consumed}</div>
                  <span className="text-[10px] text-[#8C8278]">kcal</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#8C8278] uppercase font-semibold">
                    {isExceeded ? 'Exceeded' : 'Remaining'}
                  </span>
                  <div
                    className={`font-serif-editorial text-lg font-semibold ${
                      isExceeded ? 'text-[#C85A32]' : 'text-[#2D6A4F]'
                    }`}
                  >
                    {isExceeded ? `+${Math.abs(remaining)}` : remaining}
                  </div>
                  <span className="text-[10px] text-[#8C8278]">kcal</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#8C8278] uppercase font-semibold">Protein</span>
                  <div className="font-serif-editorial text-lg font-semibold text-[#2D6A4F]">
                    {selectedRecord?.totals.protein}g
                  </div>
                  <span className="text-[10px] text-[#8C8278]">
                    Target: {selectedRecord?.targetSnapshot?.targetProtein || 120}g
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {categories.map((cat) => {
                  const items = selectedRecord?.meals[cat] || [];
                  const mealKcal = items.reduce((s, i) => s + i.calories, 0);

                  return (
                    <div
                      key={cat}
                      className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE3D6] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold border-b border-[#EFEAE0] pb-1.5">
                        <span className="capitalize text-[#221F1D]">{cat}</span>
                        <span className="text-[#C85A32] font-semibold">{mealKcal} kcal</span>
                      </div>

                      {items.length > 0 ? (
                        <div className="space-y-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs text-[#4A433D] py-1 px-2 rounded-lg bg-white border border-[#EFEAE0]"
                            >
                              <span>
                                {item.name}{' '}
                                <span className="text-[#8C8278] font-mono">
                                  ({item.portion}x {item.servingUnit})
                                </span>
                              </span>
                              <span className="font-mono text-[#C85A32] font-semibold">
                                {item.calories} kcal • {item.protein}g P
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#8C8278] italic">No items logged for {cat}.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 px-6 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#E0D8CB] text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#8C8278] mx-auto" />
              <h4 className="font-serif-editorial font-medium text-lg text-[#221F1D]">
                No Meals Logged for {selectedDate}
              </h4>
              <p className="text-xs text-[#6E675F] max-w-md mx-auto">
                No meal records exist for this day. You can open today's menu in your dashboard and log whatever you ate anytime.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7] text-xs font-semibold hover:bg-[#F5E5DC] transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Meals for this Date</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
