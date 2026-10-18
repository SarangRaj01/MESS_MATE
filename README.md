
# 🍽️ MessMate

### AI-Powered Mess Calorie & Nutrition Tracker

**A nutrition tracker designed around real college-mess meals at VIT
Vellore.**

Track calories, understand your macros, review previous days, and make
more informed food choices---all in one responsive web app.

`<br/>`{=html}

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind
CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
:::

------------------------------------------------------------------------

## 📌 Table of Contents

-   [Why MessMate?](#-why-messmate)
-   [Features](#-features)
-   [Tech Stack](#-tech-stack)
-   [Project Structure](#-project-structure)
-   [Getting Started](#-getting-started)
-   [Available Scripts](#-available-scripts)
-   [How Nutrition Targets Work](#-how-nutrition-targets-work)
-   [Data Storage and Backup](#-data-storage-and-backup)
-   [Testing](#-testing)
-   [Roadmap](#-roadmap)
-   [Disclaimer](#-disclaimer)

## 🌟 Why MessMate?

Generic calorie trackers can be inconvenient when your meals come from a
college mess. MessMate is designed around that everyday reality:
familiar Indian foods, mess-specific meal timings, portion-aware
logging, and a quick view of how your intake compares with your daily
target.

The goal is to make nutrition tracking **practical, understandable, and
consistent**---without treating food choices as a pass-or-fail score.

## ✨ Features

### 🍛 1. Mess Menus and Meal Logging

-   Date-specific VIT Vellore mess menus for the dates currently
    included in the project data.
-   Separate meal periods for breakfast, lunch, evening snacks, and
    dinner.
-   Add foods from a searchable food library and adjust portions.
-   Manually add or edit menu entries for future dates.
-   Avoids presenting an unprovided menu as verified data.

### 🔥 2. Daily Calorie Budget

-   Displays the daily calorie target, calories consumed, and calories
    remaining.
-   Updates the progress bar and circular progress indicator as food
    portions change.
-   Shows when the daily target has been exceeded without shaming the
    user.
-   Keeps the calorie summary visible as a central part of the
    dashboard.

### 🥗 3. Macronutrient Tracking

Track the main macronutrients (nutrients that provide energy):

-   **Protein**
-   **Carbohydrates**
-   **Fat**
-   **Dietary fibre**

The app visualizes nutrient totals and the estimated share of energy
from protein, carbohydrates, and fat.

### ⚖️ 4. Personalized Calorie Targets

The onboarding calculator estimates:

-   **BMR (Basal Metabolic Rate):** the energy your body uses at rest.
-   **TDEE (Total Daily Energy Expenditure):** estimated daily energy
    use after accounting for activity.
-   Suggested targets for maintaining weight, fat loss, weight gain, or
    muscle building.
-   A custom calorie target and protein goal.

Estimates use the Mifflin--St Jeor equation and an activity factor. They
are estimates---not medical measurements.

### 📅 5. History and Analytics

-   Calendar view to distinguish days with logged meals from days
    without logs.
-   Historical daily calorie intake compared with the target.
-   Protein-intake trends and periodic weight entries.
-   Select a chart to open the corresponding day's food log.
-   Historical entries retain the target and nutrient values captured
    when the meal was logged, so later changes to current settings do
    not silently rewrite the past.

### 💡 6. Food Insights and Mess Swaps

-   Compare common mess-food choices and portions.
-   Highlight foods that can help increase protein intake.
-   Explore practical alternatives using the foods available in the
    app's library.

Nutrition values depend on ingredients, preparation, and serving size;
comparisons should be treated as estimates.

### 💾 7. Local Persistence, Export, and Restore

-   Stores app data in the browser using IndexedDB, with a fallback
    mechanism.
-   Keeps data available across refreshes and browser restarts on the
    same browser profile.
-   Export records to CSV for spreadsheet analysis.
-   Back up and restore application data through JSON.
-   Includes duplicate-prevention handling during restoration.

**Important:** Browser-local data is not automatically synced across
devices or browsers. Clearing site data or changing browsers may remove
access to locally stored records. Export backups regularly.

## 🧰 Tech Stack

  -----------------------------------------------------------------------
  Area                    Technology              Purpose
  ----------------------- ----------------------- -----------------------
  UI                      React 19                Component-based user
                                                  interface

  Language                TypeScript              Type checking and safer
                                                  refactoring

  Build tool              Vite 8                  Local development
                                                  server and production
                                                  build

  Styling                 Tailwind CSS 4          Responsive styling and
                                                  design utilities

  Animation               Framer Motion           Interface transitions
                                                  and motion

  Icons                   Lucide React            Consistent interface
                                                  icons

  Charts                  Recharts                Nutrition and weight
                                                  visualizations

  Local database          IndexedDB via `idb`     Persistent browser-side
                                                  structured data

  Testing                 Vitest                  Automated tests
  -----------------------------------------------------------------------

## 🗂️ Project Structure

``` text
messmate/
├── src/
│   ├── components/
│   │   ├── AddFoodModal.tsx
│   │   ├── AnalyticsView.tsx
│   │   ├── AppLayout.tsx
│   │   ├── BackupRestoreView.tsx
│   │   ├── CalorieBudgetCard.tsx
│   │   ├── DateNavigator.tsx
│   │   ├── DashboardView.tsx
│   │   ├── FoodDatabaseView.tsx
│   │   ├── FoodInsightsView.tsx
│   │   ├── HistoryView.tsx
│   │   ├── MacronutrientBreakdown.tsx
│   │   ├── MealCard.tsx
│   │   ├── OnboardingModal.tsx
│   │   └── TodayMenuView.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── data/
│   │   ├── foodDatabase.ts
│   │   └── messMenus.ts
│   ├── services/
│   │   ├── dataIntegrity.test.ts
│   │   ├── nutritionCalculations.ts
│   │   ├── nutritionCalculations.test.ts
│   │   └── persistenceService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
└── vite.config.ts
```

*The tree reflects the project structure documented for the current
version. File names may change as the application evolves.*

## 🚀 Getting Started

### Prerequisites

Install a current version of **Node.js** (which includes npm, the
JavaScript package manager). Verify the installation:

``` bash
node --version
npm --version
```

### 1. Open the project folder

In PowerShell, move into the project directory. Replace the example path
if your folder is stored elsewhere:

``` powershell
cd "C:\Users\SARANG RAJ\.gemini\antigravity\scratch\messmate"
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Start the development server

``` bash
npm run dev
```

Open the local URL printed in your terminal. Vite commonly uses:

``` text
http://localhost:5173
```

### 4. Create a production build

``` bash
npm run build
npm run preview
```

The build command checks and bundles the app for production. The preview
command serves the generated build locally so you can check it before
deployment.

## 🧪 Available Scripts

  Command             Purpose
  ------------------- --------------------------------------
  `npm install`       Install project dependencies
  `npm run dev`       Start the local development server
  `npx vitest run`    Run the test suite once
  `npm run build`     Build the production version
  `npm run preview`   Preview the production build locally

## 🧮 How Nutrition Targets Work

MessMate uses the Mifflin--St Jeor equation to estimate BMR.

**Male equation**

``` text
BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + 5
```

**Female equation**

``` text
BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) − 161
```

Estimated maintenance calories are calculated as:

``` text
TDEE = BMR × activity factor
```

The app can then suggest a target based on the selected goal. These
formulas are estimates and can differ from a person's actual energy
needs. Food values also vary by recipe and serving size.

## 🗄️ Data Storage and Backup

MessMate is designed for browser-local storage rather than a hosted
account database.

1.  Log meals and update profile details in the app.
2.  Export a CSV when you want to inspect records in a spreadsheet.
3.  Create a JSON backup periodically.
4.  Keep backup files in a safe location.
5.  Test restoration with a backup copy before relying on it as your
    only recovery method.

Do not include sensitive personal information in public issue reports or
screenshots.

## ✅ Testing

Run the automated tests with:

``` bash
npx vitest run
```

The project includes tests for nutrition calculations and data
integrity. Run the tests after changing calculation formulas, portion
handling, menu data, or persistence logic.

## 🛣️ Roadmap

Potential improvements for future versions:

-   [ ] Add app screenshots and a short demo GIF.
-   [ ] Publish a live demo.
-   [ ] Add optional encrypted backup export.
-   [ ] Add cross-device sync through a secure backend.
-   [ ] Expand and validate the food database and mess-menu coverage.
-   [ ] Add more automated tests for backup restoration and
    historical-record integrity.

## ⚠️ Disclaimer

MessMate is an educational nutrition-tracking application. Calorie and
nutrient values are estimates and should not be treated as medical
advice. Individual needs vary. Consult a qualified healthcare
professional or registered dietitian for personalized medical or
nutrition guidance, especially if you are under 18 or have a medical
condition.

------------------------------------------------------------------------

::: {align="center"}
**Built to make everyday mess meals easier to track.** 🍽️
:::
