# FIRE Calculator Feature

## Quick Start

This feature is self-contained in this folder. To use it:

```tsx
import { FIRECalculator } from '@/features/fire-calculator';

<FIRECalculator currency={currency} setCurrency={setCurrency} />
```

## Files

- **FIRECalculator.tsx** - Main component UI
- **useFIRELogic.ts** - Calculation & state management hook
- **README.md** - This file

## How It Works

1. **useFIRELogic()** hook handles all calculation logic and state
2. **FIRECalculator** component renders the UI using the hook
3. No business logic mixed with UI

## To Modify

**Change calculations?** → Edit `useFIRELogic.ts`

**Change UI?** → Edit `FIRECalculator.tsx`

## To Add Similar Features

1. Copy this entire folder
2. Rename folder and files
3. Update calculations in the hook
4. Update UI in the component
5. Register in `App.tsx`

Done! Takes ~30 minutes for a new calculator.

## Testing

Because logic is in a hook, you can test independently:

```ts
describe('useFIRELogic', () => {
  it('calculates retirement date', () => {
    const { result } = renderHook(() => useFIRELogic('USD'));
    // test calculations...
  });
});
```

---

See `MODULARIZATION_GUIDE.md` in the root for full architecture details.
