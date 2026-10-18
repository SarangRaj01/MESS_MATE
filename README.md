# MessMate — AI-Powered Mess Calorie & Nutrition Tracker (VIT Vellore)

> **A premium, mobile-first fitness and nutrition tracking web application built specifically for college students dining at VIT Vellore messes.**

---

## 🌟 Overview & Key Capabilities

**MessMate** solves the daily challenge of tracking calorie and macronutrient intake for college hostel students. Rather than relying on generic western food databases, MessMate is founded directly on **actual mess menus served at VIT Vellore**, with accurate Indian portion sizes, verified meal timings, and standardized ICMR-NIN (National Institute of Nutrition) food composition data.

### Core Features

1. **Date-Specific Real Mess Menus**:
   - Menus for dates including **October 12, 19, 20, 21, 22, 23, 24, and 25** extracted with authentic VIT Vellore timings:
     - **Breakfast**: 7:30 AM – 9:30 AM (7:00 AM – 9:00 AM on Sunday Special Feast days)
     - **Lunch**: 12:30 PM – 2:30 PM
     - **Evening Snacks**: 4:30 PM – 6:15 PM
     - **Dinner**: 7:00 PM – 9:00 PM
   - Interactive Menu Manager allows manual additions and edits for any future dates without fabricating unseen menus.

2. **Top Priority Live Calorie-Remaining Bar**:
   - Prominent hero budget card updating in real time as items or portions are adjusted.
   - Shows **Daily Calorie Target**, **Calories Consumed**, and **Calories Remaining** or **Target Exceeded Overage**.
   - Dual visualization: Horizontal animated fill bar (clamped to 100%) and circular SVG progress ring gauge.
   - Non-shaming, constructive badge when budget is exceeded.

3. **Macronutrient Tracking**:
   - Real-time animated tracking for **Protein**, **Carbohydrates**, **Fats**, and **Dietary Fibre**.
   - Energy contribution breakdown (% kcal from protein, carbs, and fat).
   - Dynamic protein target based on body weight and fitness goal (1.2–2.0g/kg).

4. **Personalized BMR & Maintenance Calorie Calculator**:
   - Clinically validated **Mifflin–St Jeor** equation:
     $$\text{BMR}_{\text{male}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$$
     $$\text{BMR}_{\text{female}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$$
   - Total Daily Energy Expenditure (TDEE): $\text{Maintenance} = \text{BMR} \times \text{Activity Factor}$.
   - Personalized target suggestions:
     - **Maintain Weight**: 100% of TDEE
     - **Healthy Fat Loss**: ~15% deficit (with safety floor capping at 1200 kcal for females, 1500 kcal for males, and pediatric guidance for minors)
     - **Weight Gain**: ~10% surplus
     - **Build Muscle**: ~6% surplus with high protein
     - **Custom Target**: Manual calorie and protein target input.

5. **100% Persistent Data Storage (IndexedDB + LocalStorage Sync)**:
   - Full structured storage across browser refreshes and restarts using `idb`.
   - Snapshots historical targets and nutrient unit costs when a meal is logged, ensuring that editing the food library or updating today's target never silently modifies past records.

6. **Calendar-Based History & Analytics**:
   - Interactive calendar grid distinguishing confirmed logged days from unlogged days.
   - Recharts visual graphs: Daily calories vs target line, daily protein intake trend, and periodic weight logging.
   - 1-click interactive chart navigation: clicking any bar navigates straight into that day's log.

7. **Smart Mess Swaps & Insights**:
   - Actionable comparisons tailored to VIT mess foods (e.g. 3 Phulkas vs 2 Pooris, White Channa Sundal vs Mysore Bonda).
   - High-protein mess champions ranking.

8. **Export, Backup & Restore**:
   - 1-click CSV spreadsheet export.
   - Complete JSON database backup and restoration with duplicate prevention.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4 (with dark aesthetic design system: deep charcoal, warm amber, and spiced orange gradients)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Database**: IndexedDB (`idb` v8) with synchronous fallback
- **Testing**: Vitest

---

## 🚀 Getting Started

### 1. Installation

```bash
cd "C:\Users\SARANG RAJ\.gemini\antigravity\scratch\messmate"
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit the local development server (typically `http://localhost:5173`).

### 3. Run Automated Tests

```bash
npx vitest run
```

### 4. Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
messmate/
├── src/
│   ├── components/
│   │   ├── AddFoodModal.tsx          # Multi-tab food selection & custom item creator
│   │   ├── AnalyticsView.tsx         # Recharts intake trends & weight tracking
│   │   ├── AppLayout.tsx             # Responsive header, bottom dock & view routing
│   │   ├── BackupRestoreView.tsx     # CSV export & JSON backup/restore
│   │   ├── CalorieBudgetCard.tsx     # Top priority live calorie-remaining bar & ring gauge
│   │   ├── DateNavigator.tsx         # Date picker, prev/next & VIT mess date pills
│   │   ├── DashboardView.tsx         # Hero greeting, budget card, macros & 4 meal cards
│   │   ├── FoodDatabaseView.tsx      # Searchable, filterable Indian food library
│   │   ├── FoodInsightsView.tsx      # Smart mess food swaps & protein rankings
│   │   ├── HistoryView.tsx           # Monthly interactive calendar & past record inspector
│   │   ├── MacronutrientBreakdown.tsx# Animated protein, carbs, fat & fibre bars
│   │   ├── MealCard.tsx              # Interactive breakfast, lunch, snacks & dinner cards
│   │   ├── OnboardingModal.tsx       # BMR, TDEE, & personalized target calculator wizard
│   │   └── TodayMenuView.tsx         # Date-specific mess menu & 1-click meal logger
│   ├── context/
│   │   └── AppContext.tsx            # Global state, reactive totals, and IndexedDB sync
│   ├── data/
│   │   ├── foodDatabase.ts           # Standardized NIN IFCT Indian mess foods
│   │   └── messMenus.ts              # Oct 12, 19, 20, 21, 22, 23, 24, 25 VIT mess menus
│   ├── services/
│   │   ├── dataIntegrity.test.ts     # Menu integrity and portion scaling test suite
│   │   ├── nutritionCalculations.ts  # Mifflin-St Jeor BMR, TDEE & macro formulas
│   │   ├── nutritionCalculations.test.ts # Vitest suite for calculations
│   │   └── persistenceService.ts     # IndexedDB CRUD, schema, export/import
│   ├── types/
│   │   └── index.ts                  # TypeScript models and interfaces
│   ├── App.tsx                       # Root application component
│   ├── index.css                     # Tailwind v4 variables & glassmorphism utilities
│   └── main.tsx                      # Vite React entry point
├── package.json
└── vite.config.ts
```
