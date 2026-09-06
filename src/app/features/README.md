# Features Folder Structure

This folder contains all the application features/sections.

## What's a Feature?

Each feature is a self-contained section with its own:
- UI components
- Business logic hooks
- Local utilities
- README documentation

## Current Features

- **fire-calculator/** - FIRE (Financial Independence/Retire Early) calculator
- **goal-planner/** - Multi-goal financial planning
- **bmi-calculator/** - BMI & health metrics
- **unit-converter/** - Unit conversions
- **blog/** - Articles & insights
- **home/** - Landing/home page (future)

## Adding a New Feature

1. Create a new folder: `src/app/features/my-feature/`
2. Create main component: `MyFeature.tsx`
3. Create logic hook: `useMyFeatureLogic.ts` (if needed)
4. Add `README.md` documenting the feature
5. Import and use in `App.tsx`

## Key Rules

✅ **DO:**
- Keep feature logic inside its folder
- Use hooks for reusable state/calculations
- Export from `index.ts` for clean imports
- Document each feature in README

❌ **DON'T:**
- Import from sibling features
- Mix UI and business logic
- Duplicate calculations from other features
- Add to App.tsx until ready

## Example Import

```tsx
// Clean import from feature folder
import { FIRECalculator } from '@/features/fire-calculator';

// Inside App.tsx
{page === 'fire' && <FIRECalculator {...props} />}
```

---

Each feature folder is self-contained and swappable!
