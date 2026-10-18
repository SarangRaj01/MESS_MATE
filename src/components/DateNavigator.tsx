import React from 'react';
import { useApp, getLocalTodayDate, getYesterdayDate } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';

export const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate, changeDateByOffset, goToToday, goToYesterday } = useApp();

  const isToday = selectedDate === getLocalTodayDate();
  const isYesterday = selectedDate === getYesterdayDate();

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const extractedDates = [
    { date: '2026-10-12', label: 'Oct 12 (Sun)' },
    { date: '2026-10-19', label: 'Oct 19 (Sun)' },
    { date: '2026-10-20', label: 'Oct 20 (Mon)' },
    { date: '2026-10-21', label: 'Oct 21 (Tue)' },
    { date: '2026-10-22', label: 'Oct 22 (Wed)' },
    { date: '2026-10-23', label: 'Oct 23 (Thu)' },
    { date: '2026-10-24', label: 'Oct 24 (Fri)' },
    { date: '2026-10-25', label: 'Oct 25 (Sat)' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between bg-white border border-[#E8E2D5] rounded-2xl p-2 sm:px-4 shadow-[0_1px_4px_rgba(45,35,25,0.03)]">
        {/* Prev day */}
        <button
          onClick={() => changeDateByOffset(-1)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-[#6E675F] hover:text-[#221F1D] hover:bg-[#FAF5ED] transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Day</span>
        </button>

        {/* Center label */}
        <div className="flex items-center gap-2">
          <label className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#F3ECE1] border border-[#E5DFD5] cursor-pointer transition-all">
            <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
            <span className="font-serif-editorial font-medium text-base sm:text-lg text-[#221F1D]">
              {formatDateLabel(selectedDate)}
            </span>
            {isToday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7]">
                Today
              </span>
            )}
            {isYesterday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF0F6] text-[#2D5A7B] border border-[#D5E1ED]">
                Yesterday
              </span>
            )}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {!isToday && (
            <button
              onClick={goToToday}
              className="hidden xs:inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF0EB] text-[#C85A32] border border-[#F3D5C7] hover:bg-[#F5E5DC] transition-all"
            >
              Today
            </button>
          )}
        </div>

        {/* Next day */}
        <button
          onClick={() => changeDateByOffset(1)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-[#6E675F] hover:text-[#221F1D] hover:bg-[#FAF5ED] transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
        >
          <span className="hidden sm:inline">Next Day</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Date pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8C8278] shrink-0 pr-1">
          <Sparkles className="w-3 h-3 text-[#C85A32]" />
          Mess Menus:
        </span>
        {extractedDates.map((item) => {
          const isCurrent = selectedDate === item.date;
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`shrink-0 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                isCurrent
                  ? 'bg-[#C85A32] text-white font-semibold shadow-sm'
                  : 'bg-white text-[#6E675F] hover:text-[#221F1D] hover:bg-[#FAF5ED] border border-[#E8E2D5]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
