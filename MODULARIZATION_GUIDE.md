# Repository Structure Review & Modularization Guide

## Current State Analysis

### Problems with Current Structure
- **1,658 lines in App.tsx** - contains EVERYTHING: data, UI, logic, calculators
- **No separation between features** - FIRE, Goal Planner, BMI, Unit Converter all in one file
- **Hard to maintain** - find what you need in a massive file
- **Difficult to scale** - adding new calculator = more code in same file
- **Article data embedded** - 6 articles hardcoded in App.tsx
- **Code duplication** - currency logic, formatting repeated throughout
- **No code reuse** - utilities can't be used outside this component

---

## Proposed Simple Structure

```
src/app/
├── App.tsx                      # Just router & main layout (50 lines)
├── components/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── CurrencySelector.tsx
├── utils/
│   ├── currency.ts              # Currency conversion & formatting
│   ├── formatting.ts            # Number/date formatting
│   └── constants.ts             # APP_NAME, CURRENCY_OPTIONS, etc
├── data/
│   ├── articles.ts              # All article data (6 articles)
│   └── tools.ts                 # Tool definitions
├── features/
│   ├── fire-calculator/
│   │   ├── FIRECalculator.tsx
│   │   ├── useFIRELogic.ts      # Hook with calculation logic
│   │   └── README.md
│   ├── goal-planner/
│   │   ├── GoalPlanner.tsx
│   │   ├── useGoalLogic.ts
│   │   └── README.md
│   ├── bmi-calculator/
│   │   ├── BMICalculator.tsx
│   │   └── README.md
│   ├── unit-converter/
│   │   ├── UnitConverter.tsx
│   │   └── README.md
│   └── blog/
│       ├── Blog.tsx
│       ├── ArticleCard.tsx
│       ├── ArticleView.tsx
│       └── README.md
└── styles/
    └── (unchanged)
```

---

## Step-by-Step Implementation

### Step 1: Extract Constants & Utilities (5 min each)

#### 1a. Create `src/app/utils/constants.ts`
Extract from App.tsx:
```ts
// CURRENT (in App.tsx)
const SITE_NAME = "RichLifeTools";
const SITE_URL = "https://richlifetools.com";
const CURRENCY_OPTIONS = [...]

// MOVE TO → src/app/utils/constants.ts
export const SITE_NAME = "RichLifeTools";
export const SITE_URL = "https://richlifetools.com";
export const SITE_DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  // ... rest
];

export const USD_PER_CURRENCY = {
  USD: 1,
  EUR: 1.08,
  // ... rest
};
```

#### 1b. Create `src/app/utils/currency.ts`
Extract currency functions:
```ts
import { CURRENCY_OPTIONS, USD_PER_CURRENCY } from './constants';

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "INR";

export const getCurrencyConfig = (currency: CurrencyCode) =>
  CURRENCY_OPTIONS.find(c => c.code === currency) ?? CURRENCY_OPTIONS[0];

export const getCurrencySymbol = (currency: CurrencyCode): string => {
  const { locale } = getCurrencyConfig(currency);
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(0);
  return parts.find(p => p.type === "currency")?.value ?? "$";
};

export const formatCurrencyCompact = (n: number, currency: CurrencyCode): string => {
  const { locale } = getCurrencyConfig(currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
};

export const convertCurrencyAmount = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
  if (!Number.isFinite(amount) || from === to) return amount;
  const usdAmount = amount * USD_PER_CURRENCY[from];
  return usdAmount / USD_PER_CURRENCY[to];
};

export const convertInputValue = (value: string, from: CurrencyCode, to: CurrencyCode): string => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return String(parseFloat((n * USD_PER_CURRENCY[from] / USD_PER_CURRENCY[to]).toFixed(2)));
};
```

#### 1c. Create `src/app/utils/formatting.ts`
```ts
export const toInputNumberString = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  return String(parseFloat(value.toFixed(2)));
};

export const formatCurrencyAxis = (n: number, currency: string): string => {
  // ... move from App.tsx
};

// Add any other formatting utilities
```

### Step 2: Extract Data (10 min each)

#### 2a. Create `src/app/data/articles.ts`
Move all 6 articles:
```ts
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
  tagColor: string;
  tagBg: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "The Hidden Cost of Compound Interest...",
    excerpt: "...",
    body: [...],
    // ... rest
  },
  // ... other 5 articles
];
```

#### 2b. Create `src/app/data/tools.ts`
```ts
import { Flame, Target, TrendingUp, Hash } from "lucide-react";

export const tools = [
  { 
    id: "fire", 
    icon: Flame, 
    name: "FIRE Calculator", 
    desc: "Retirement date, savings rate & portfolio projection", 
    color: "#4f46e5", 
    bg: "#eef0fd" 
  },
  { 
    id: "goal", 
    icon: Target, 
    name: "Goal Planner", 
    desc: "Multi-goal financial planning with actionable steps", 
    color: "#8b5cf6", 
    bg: "#f3f0ff" 
  },
  // ... rest
];
```

### Step 3: Extract Components (20 min each)

#### 3a. Create `src/app/components/CurrencySelector.tsx`
```tsx
import { CurrencyCode, CURRENCY_OPTIONS } from '../utils/constants';

interface Props {
  currency: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ currency, onChange }: Props) {
  return (
    <div>
      <label className="text-[#6b7a99] text-xs font-medium block mb-1.5">Currency</label>
      <select
        value={currency}
        onChange={e => onChange(e.target.value as CurrencyCode)}
        className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-3 py-2.5 text-[#0f1523] text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5] cursor-pointer"
      >
        {CURRENCY_OPTIONS.map(option => (
          <option key={option.code} value={option.code}>
            {option.code} - {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

#### 3b. Create `src/app/components/Field.tsx`
```tsx
import { Info } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  tooltip?: string;
}

export function Field({ label, value, onChange, prefix = "$", tooltip }: Props) {
  const inputCls = "w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-2.5 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]";

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[#6b7a99] text-xs font-medium">{label}</label>
        {tooltip && (
          <div className="group relative">
            <Info size={11} className="text-[#c4cad9] cursor-help" />
            <div className="absolute left-0 bottom-5 w-48 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4cad9] font-mono text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={`${inputCls} ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
}
```

### Step 4: Extract Calculator Logic (15 min per calculator)

#### 4a. Create `src/app/features/fire-calculator/useFIRELogic.ts`
Extract the calculation logic into a hook:
```tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { CurrencyCode } from '../../utils/currency';
import { convertInputValue } from '../../utils/currency';

export function useFIRELogic(currency: CurrencyCode) {
  const [income, setIncome] = useState("120000");
  const [expenses, setExpenses] = useState("48000");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  const previousCurrencyRef = useRef<CurrencyCode>(currency);

  // Parse all values
  const inc = parseFloat(income) || 0;
  const exp = parseFloat(expenses) || 0;
  const cur = parseFloat(currentSavings) || 0;
  const rr = (parseFloat(returnRate) || 7) / 100;
  const ir = (parseFloat(inflationRate) || 3) / 100;
  const wr = (parseFloat(withdrawalRate) || 4) / 100;

  // Calculate FIRE metrics
  const annualSavings = inc - exp;
  const savingsRate = inc > 0 ? (annualSavings / inc) * 100 : 0;
  const fireNumber = exp / wr;
  const realReturn = (1 + rr) / (1 + ir) - 1;

  // Calculate years to FIRE
  const yearsToFire = (() => {
    if (annualSavings <= 0 || cur >= fireNumber) return cur >= fireNumber ? 0 : null;
    let portfolio = cur;
    for (let y = 1; y <= 100; y++) {
      portfolio = portfolio * (1 + realReturn) + annualSavings;
      if (portfolio >= fireNumber) return y;
    }
    return null;
  })();

  const retirementYear = yearsToFire != null ? new Date().getFullYear() + yearsToFire : null;

  // Generate chart data
  const chartYears = Math.min(Math.max((yearsToFire ?? 30) + 10, 30), 60);
  const chartData = Array.from({ length: chartYears + 1 }, (_, y) => {
    let portfolio = cur;
    for (let i = 0; i < y; i++) portfolio = portfolio * (1 + realReturn) + annualSavings;
    return {
      year: new Date().getFullYear() + y,
      portfolio: Math.round(portfolio),
      fireTarget: Math.round(fireNumber),
    };
  });

  // Handle currency change
  useEffect(() => {
    const prev = previousCurrencyRef.current;
    if (prev === currency) return;

    setIncome(v => convertInputValue(v, prev, currency));
    setExpenses(v => convertInputValue(v, prev, currency));
    setCurrentSavings(v => convertInputValue(v, prev, currency));

    previousCurrencyRef.current = currency;
  }, [currency]);

  return {
    // State setters
    setIncome,
    setExpenses,
    setCurrentSavings,
    setReturnRate,
    setInflationRate,
    setWithdrawalRate,
    // State getters
    income,
    expenses,
    currentSavings,
    returnRate,
    inflationRate,
    withdrawalRate,
    // Calculated results
    annualSavings,
    savingsRate,
    fireNumber,
    realReturn,
    yearsToFire,
    retirementYear,
    chartData,
  };
}
```

#### 4b. Create `src/app/features/fire-calculator/FIRECalculator.tsx`
```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { CurrencyCode, getCurrencySymbol, formatCurrencyCompact } from "../../utils/currency";
import { Field } from "../../components/Field";
import { CurrencySelector } from "../../components/CurrencySelector";
import { useFIRELogic } from "./useFIRELogic";

interface Props {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

export function FIRECalculator({ currency, setCurrency }: Props) {
  const logic = useFIRELogic(currency);
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ... JSX using logic.* */}
    </div>
  );
}
```

#### 4c. Create `src/app/features/fire-calculator/README.md`
```md
# FIRE Calculator

## Overview
Calculates Financial Independence / Retire Early (FIRE) target and timeline.

## Files
- `FIRECalculator.tsx` - Main component
- `useFIRELogic.ts` - Calculation logic & state management
- `README.md` - This file

## Usage
```tsx
import { FIRECalculator } from '@/features/fire-calculator';

<FIRECalculator currency={currency} setCurrency={setCurrency} />
```

## Calculations
- **FIRE Number** = Annual Expenses / Withdrawal Rate
- **Savings Rate** = (Income - Expenses) / Income
- **Years to FIRE** = Simulated until portfolio reaches FIRE number
- **Real Return** = (1 + Nominal Return) / (1 + Inflation) - 1
```

### Step 5: Extract Blog/Articles (10 min)

#### 5a. Create `src/app/features/blog/Blog.tsx`
```tsx
import { useState } from 'react';
import { articles } from '../../data/articles';
import { ArticleCard } from './ArticleCard';
import { ArticleView } from './ArticleView';

export function Blog() {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  if (selectedArticle) {
    return <ArticleView article={selectedArticle} onClose={() => setSelectedArticleId(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">Articles & Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onClick={() => setSelectedArticleId(article.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 5b. Create `src/app/features/blog/ArticleCard.tsx`
```tsx
import { Article } from '../../data/articles';

interface Props {
  article: Article;
  onClick: () => void;
}

export function ArticleCard({ article, onClick }: Props) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#e4e8f0] hover:shadow-lg transition-shadow">
      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs px-2 py-1 rounded-full" style={{ color: article.tagColor, backgroundColor: article.tagBg }}>
            {article.tag}
          </span>
          <span className="text-xs text-[#c4cad9]">{article.readTime}</span>
        </div>
        <h3 className="font-bold text-[#0f1523] mb-2">{article.title}</h3>
        <p className="text-sm text-[#6b7a99]">{article.excerpt}</p>
        <div className="mt-4 pt-4 border-t border-[#f1f3f8] flex justify-between items-center text-xs text-[#c4cad9]">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Rebuild App.tsx (Simple Router)

#### Create new simplified `src/app/App.tsx`
```tsx
import React, { useState } from "react";
import { useSEO } from "./hooks/seo";
import { CurrencyCode } from "./utils/currency";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { FIRECalculator } from "./features/fire-calculator/FIRECalculator";
import { GoalPlanner } from "./features/goal-planner/GoalPlanner";
import { BMICalculator } from "./features/bmi-calculator/BMICalculator";
import { UnitConverter } from "./features/unit-converter/UnitConverter";
import { Blog } from "./features/blog/Blog";
import { Home } from "./features/home/Home";

type Page = "home" | "fire" | "goal" | "bmi" | "unit" | "blog";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  // Set SEO based on page
  useSEO({
    title: page === "home" ? "RichLifeTools" : "Tools",
    description: "Financial calculators and tools",
  });

  return (
    <div>
      <Header currency={currency} onCurrencyChange={setCurrency} />
      <Navigation currentPage={page} onPageChange={setPage} />
      
      <main>
        {page === "home" && <Home onToolClick={(id) => setPage(id as any)} />}
        {page === "fire" && <FIRECalculator currency={currency} setCurrency={setCurrency} />}
        {page === "goal" && <GoalPlanner currency={currency} setCurrency={setCurrency} />}
        {page === "bmi" && <BMICalculator />}
        {page === "unit" && <UnitConverter />}
        {page === "blog" && <Blog />}
      </main>
      
      <Footer />
    </div>
  );
}
```

---

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **App.tsx size** | 1,658 lines | ~50 lines |
| **Finding FIRE logic** | Search in 1,600+ lines | Open `features/fire-calculator/` |
| **Adding new calculator** | Edit App.tsx (risky) | Copy feature folder, register in App.tsx |
| **Testing FIRE logic** | Must mock entire App | Test `useFIRELogic` hook directly |
| **Reusing currency logic** | Copy-paste | `import { convertCurrencyAmount } from '@/utils/currency'` |
| **Onboarding new dev** | "Read all 1,658 lines" | "Each folder in features/ is one tool" |

---

## Implementation Timeline

- **Day 1**: Steps 1-2 (utils + data) = 30 min
- **Day 2**: Step 3 (components) = 20 min  
- **Day 3**: Step 4 (calculator extraction) = 60 min
- **Day 4**: Step 5 (blog) + Step 6 (rebuild App) = 40 min
- **Total**: ~2.5 hours

---

## Adding a New Tool (Future)

Once modularized, adding a new calculator takes 30 minutes:

1. Copy `features/bmi-calculator/` folder
2. Rename to `features/new-calculator/`
3. Edit component & hook with new logic
4. Import in App.tsx:
   ```tsx
   import { NewCalculator } from "./features/new-calculator/NewCalculator";
   ```
5. Add to navigation:
   ```tsx
   {page === "new" && <NewCalculator currency={currency} setCurrency={setCurrency} />}
   ```

**Before modularization**: 30+ min editing 1,600 line file
**After modularization**: 5 min in new folder + 2 min in App.tsx

---

## Next Steps

1. Start with Step 1 (utils/constants extraction)
2. Test that App still works after moving constants
3. Move to Step 2 (data extraction)
4. Continue sequentially to avoid merge conflicts
5. Use git branches: `feature/modularize-utils`, `feature/modularize-data`, etc.

Each step can be a separate commit/PR for easy review.
