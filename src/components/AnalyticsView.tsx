import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid
} from 'recharts';
import {
  Activity,
  Flame,
  Dumbbell,
  Scale,
  Plus,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { allLogs, setSelectedDate, setActiveTab, weightHistory, logWeight } = useApp();

  const [newWeight, setNewWeight] = useState<number>(68);
  const [weightDate, setWeightDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightNotes, setWeightNotes] = useState<string>('');

  // Extract confirmed logged days (only days where meals were actually logged)
  const confirmedLogs = useMemo(() => {
    return allLogs
      .filter(l => l.totals && l.totals.calories > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allLogs]);

  // Aggregate stats
  const stats = useMemo(() => {
    if (confirmedLogs.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        highestDay: null as { date: string; calories: number } | null,
        lowestDay: null as { date: string; calories: number } | null,
        totalLoggedDays: 0
      };
    }

    let totalCal = 0;
    let totalPro = 0;
    let high = confirmedLogs[0];
    let low = confirmedLogs[0];

    for (const log of confirmedLogs) {
      totalCal += log.totals.calories;
      totalPro += log.totals.protein;
      if (log.totals.calories > high.totals.calories) high = log;
      if (log.totals.calories < low.totals.calories) low = log;
    }

    return {
      avgCalories: Math.round(totalCal / confirmedLogs.length),
      avgProtein: Number((totalPro / confirmedLogs.length).toFixed(1)),
      highestDay: { date: high.date, calories: high.totals.calories },
      lowestDay: { date: low.date, calories: low.totals.calories },
      totalLoggedDays: confirmedLogs.length
    };
  }, [confirmedLogs]);

  // Chart data
  const calorieChartData = useMemo(() => {
    return confirmedLogs.slice(-14).map(log => ({
      date: log.date.slice(5), // MM-DD
      fullDate: log.date,
      calories: log.totals.calories,
      target: log.targetSnapshot?.targetCalories || 2200,
      protein: log.totals.protein,
      carbs: log.totals.carbs,
      fat: log.totals.fat
    }));
  }, [confirmedLogs]);

  // Handle bar click to navigate
  const handleBarClick = (data: any) => {
    if (data && data.fullDate) {
      setSelectedDate(data.fullDate);
      setActiveTab('dashboard');
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight <= 0) return;
    await logWeight(newWeight, weightDate, weightNotes);
    setWeightNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#221F1D]">
            Nutritional Analytics & Progress
          </h2>
          <p className="text-xs text-[#7A7265] mt-1">
            Calculated from your confirmed daily meal logs with interactive date navigation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#554E45] border border-[#E8E2D5]">
          <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>{stats.totalLoggedDays} Logged Days in Record</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Calories */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between text-[#7A7265] text-xs mb-1">
            <span>Avg Daily Intake</span>
            <Flame className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#221F1D]">
              {stats.avgCalories}
            </span>
            <span className="text-xs text-[#7A7265]">kcal/day</span>
          </div>
          <span className="text-[11px] text-[#A89F91]">Confirmed logged days only</span>
        </div>

        {/* Average Protein */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between text-[#7A7265] text-xs mb-1">
            <span>Avg Daily Protein</span>
            <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D6A4F]">
              {stats.avgProtein}
            </span>
            <span className="text-xs text-[#7A7265]">g/day</span>
          </div>
          <span className="text-[11px] text-[#A89F91]">Essential for muscle recovery</span>
        </div>

        {/* Highest Intake */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between text-[#7A7265] text-xs mb-1">
            <span>Peak Calorie Day</span>
            <Award className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#C85A32]">
              {stats.highestDay?.calories || 0}
            </span>
            <span className="text-xs text-[#7A7265]">kcal</span>
          </div>
          <span className="text-[11px] text-[#A89F91]">{stats.highestDay?.date || 'No logs yet'}</span>
        </div>

        {/* Lowest Intake */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between text-[#7A7265] text-xs mb-1">
            <span>Lowest Calorie Day</span>
            <Activity className="w-4 h-4 text-[#554E45]" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#554E45]">
              {stats.lowestDay?.calories || 0}
            </span>
            <span className="text-xs text-[#7A7265]">kcal</span>
          </div>
          <span className="text-[11px] text-[#A89F91]">{stats.lowestDay?.date || 'No logs yet'}</span>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Intake vs Target Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base text-[#221F1D]">
                Daily Calories vs Target
              </h3>
              <p className="text-xs text-[#7A7265]">
                Click any bar to jump directly into that day's meal entries
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#C85A32] border border-[#E8E2D5]">
              Interactive
            </span>
          </div>

          {calorieChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieChartData} onClick={(e: any) => e?.activePayload && handleBarClick(e.activePayload[0]?.payload)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                  <XAxis dataKey="date" stroke="#A89F91" fontSize={11} />
                  <YAxis stroke="#A89F91" fontSize={11} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FAF7F2', borderColor: '#E8E2D5', borderRadius: '12px', color: '#221F1D' }}
                    labelStyle={{ color: '#C85A32', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="calories" fill="#C85A32" radius={[6, 6, 0, 0]} cursor="pointer" name="Calories Consumed (kcal)" />
                  <Line type="monotone" dataKey="target" stroke="#2D6A4F" strokeWidth={2} dot={false} name="Calorie Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8E2D5]">
              <AlertCircle className="w-8 h-8 text-[#A89F91] mb-2" />
              <p className="text-sm font-serif text-[#221F1D]">No meal logs recorded yet</p>
              <p className="text-xs text-[#7A7265] mt-1 max-w-xs">
                Log meals from today's VIT mess menu or historical dates to populate interactive calorie trends!
              </p>
            </div>
          )}
        </div>

        {/* Daily Protein Intake Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base text-[#221F1D]">Daily Protein Intake (g)</h3>
              <p className="text-xs text-[#7A7265]">
                Track whether mess meals meet your lean muscle target
              </p>
            </div>
          </div>

          {calorieChartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieChartData} onClick={(e: any) => e?.activePayload && handleBarClick(e.activePayload[0]?.payload)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                  <XAxis dataKey="date" stroke="#A89F91" fontSize={11} />
                  <YAxis stroke="#A89F91" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FAF7F2', borderColor: '#E8E2D5', borderRadius: '12px', color: '#221F1D' }}
                    labelStyle={{ color: '#2D6A4F', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="protein" fill="#2D6A4F" radius={[6, 6, 0, 0]} cursor="pointer" name="Protein (g)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8E2D5]">
              <Dumbbell className="w-8 h-8 text-[#A89F91] mb-2" />
              <p className="text-sm font-serif text-[#221F1D]">No protein records yet</p>
              <p className="text-xs text-[#7A7265] mt-1 max-w-xs">
                Add high-protein mess foods like chana sundal, paneer, and dals to see your trend.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weight History & Tracking Section */}
      <div className="rounded-2xl bg-white border border-[#E8E2D5] p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C85A32]" />
              <h3 className="font-serif text-lg text-[#221F1D]">Periodic Weight Tracking</h3>
            </div>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Track weight trends over multiple weeks. Short-term daily changes reflect fluid and digestion.
            </p>
          </div>
        </div>

        {/* Add weight record form */}
        <form onSubmit={handleAddWeight} className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5]">
          <div className="flex-1 min-w-[130px]">
            <label className="block text-[11px] font-medium text-[#7A7265] mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              value={newWeight}
              onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-xs font-mono text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-medium text-[#7A7265] mb-1">Date</label>
            <input
              type="date"
              required
              value={weightDate}
              onChange={(e) => setWeightDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-xs text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[11px] font-medium text-[#7A7265] mb-1">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. morning weigh-in, post gym"
              value={weightNotes}
              onChange={(e) => setWeightNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#E8E2D5] rounded-xl text-xs text-[#221F1D] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Weight</span>
            </button>
          </div>
        </form>

        {/* Weight Trend Chart */}
        {weightHistory.length > 0 ? (
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                <XAxis dataKey="date" stroke="#A89F91" fontSize={11} />
                <YAxis stroke="#A89F91" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: '#FAF7F2', borderColor: '#E8E2D5', borderRadius: '12px', color: '#221F1D' }} />
                <Line type="monotone" dataKey="weight" stroke="#C85A32" strokeWidth={2.5} dot={{ r: 4, fill: '#C85A32' }} name="Body Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#7A7265] bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8E2D5]">
            No weight entries logged yet. Log your weight periodically to observe long-term trends!
          </div>
        )}
      </div>
    </div>
  );
};
