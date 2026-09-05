# Goal Planner Feature

## Overview

The Goal Planner feature helps users plan and track multiple financial goals simultaneously. It calculates required monthly savings, provides priority-based allocation, and suggests actionable steps when goals aren't feasible.

## Files

- **useGoalLogic.ts** - Custom hook containing all goal calculation and state management logic
- **GoalPlanner.tsx** - React component for the Goal Planner UI
- **README.md** - This file

## How to Use

### Import the component

```typescript
import { GoalPlanner } from "@/app/features/goal-planner/GoalPlanner";

// In your router or parent component
<GoalPlanner currency={currency} setCurrency={setCurrency} />
```

### Key Exports from useGoalLogic

```typescript
// Hook function
useGoalLogic(currency: CurrencyCode) // Returns all state, computed values, and handlers

// Types
interface Goal { ... }
interface GoalData extends Goal { ... }
interface ChartDataPoint { ... }

// Constants
GOAL_PRESETS // Pre-built goal templates
```

## How It Works

### Calculations

1. **Monthly Payment (PMT)**: Uses the annuity future-value formula to calculate the required monthly contribution:
   - FV = Future Value (goal target)
   - Existing savings earn returns at the same rate
   - PMT accounts for monthly compounding at the returnRate

2. **Priority-Based Allocation**: Sorts goals by priority and allocates available monthly savings:
   - Highest-priority goals funded first
   - Remaining budget allocated proportionally
   - Generates "funding percentage" for each goal

3. **Feasibility Analysis**:
   - **Feasible**: Total required ≤ Available monthly
   - **Shortfall**: Total required > Available monthly

### Smart Suggestions (when shortfall exists)

1. **Step-Up Percentage**: Annual savings increase rate needed to hit all goals
2. **Expense Reduction**: Amount to cut spending to make goals immediately feasible
3. **Goal Extension**: Years to extend lowest-priority goal to make others feasible
4. **Priority Waterfall**: Visual breakdown of how available budget is allocated

## Modifying the Feature

### Add a new preset goal

Edit `useGoalLogic.ts`:

```typescript
export const GOAL_PRESETS = [
  { name: "New Goal", emoji: "🎯", amount: "50000", years: "5" },
  // ...existing presets
];
```

### Change default values

Edit `useGoalLogic.ts` initial state in `useGoalLogic()`:

```typescript
const [monthlyIncome, setMonthlyIncome] = useState("8000"); // Change this
const [monthlyExpenses, setMonthlyExpenses] = useState("5000"); // And this
```

### Adjust chart range

Edit the chart years calculation in `useGoalLogic.ts`:

```typescript
const chartYears = Math.min(Math.ceil(maxYears) + 5, 40); // Change +5 or 40
```

### Customize styling

Edit `GoalPlanner.tsx` - all Tailwind classes use design tokens:
- Colors: `#8b5cf6` (violet), `#10b981` (green), `#ef4444` (red)
- Text: `text-[#0f1523]` (dark), `text-[#6b7a99]` (gray)
- Backgrounds: `bg-[#f8f9fb]` (light), `bg-[#f3f0ff]` (violet tint)

## Testing

```typescript
// Test with different scenarios
const { goals, addGoal, goalData, isFeasible } = useGoalLogic("USD");

// Add goal and check if feasible
addGoal();
console.log(isFeasible); // true or false
console.log(goalData); // Array of processed goals with required amounts
```

## Dependencies

- React (hooks: useState, useRef, useEffect, useCallback)
- Recharts (charts)
- Lucide-react (icons)
- @/utils/constants (CurrencyCode type)
- @/utils/currency (currency utilities)
- @/components/ (CurrencySelector, Field components)

## Performance Notes

- Calculations run on every state change (renders are fast)
- Chart data recalculates annually up to 40 years out
- Memoized with useCallback for handler functions
- No external API calls - all client-side math

## Integration Checklist

- [ ] Import useGoalLogic in parent component if accessing raw state
- [ ] Pass currency and setCurrency props to GoalPlanner
- [ ] Add to main router/nav alongside other tools
- [ ] Test currency conversion works correctly
- [ ] Verify chart renders on mobile (responsive container)
- [ ] Check tooltip displays correctly on hover
