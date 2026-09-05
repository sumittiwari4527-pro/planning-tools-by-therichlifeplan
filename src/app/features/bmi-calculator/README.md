# BMI Calculator Feature

## Overview

Simple and fast BMI (Body Mass Index) calculator that provides instant health category feedback based on user inputs.

## Files

- **useBMILogic.ts** - Custom hook for BMI calculation logic
- **BMICalculator.tsx** - React component for the BMI Calculator UI
- **README.md** - This file

## How to Use

### Import the component

```typescript
import { BMICalculator } from "@/app/features/bmi-calculator/BMICalculator";

// In your router or parent component
<BMICalculator />
```

### Using the hook directly

```typescript
import { useBMILogic } from "@/app/features/bmi-calculator/useBMILogic";

const { height, setHeight, weight, setWeight, bmi, category } = useBMILogic();
```

## How It Works

### BMI Formula

BMI = weight (kg) / height (m)²

The calculator:
1. Takes height in centimeters and weight in kilograms
2. Converts height to meters (height / 100)
3. Squares the height value
4. Divides weight by height²
5. Returns result with 1 decimal place

### Category Ranges

| BMI Range | Category | Color |
|-----------|----------|-------|
| < 18.5 | Underweight | Cyan (#06b6d4) |
| 18.5 – 25 | Normal weight | Green (#10b981) |
| 25 – 30 | Overweight | Amber (#f59e0b) |
| > 30 | Obese | Red (#ef4444) |

Each category includes health-related guidance.

## Modifying the Feature

### Change category ranges

Edit `useBMILogic.ts` in the `getCategory()` function:

```typescript
const getCategory = (b: number): BMICategory => {
  if (b < 19) return { ... }; // Changed from 18.5
  if (b < 26) return { ... }; // Changed from 25
  // etc.
};
```

### Update category tips

Edit the `tip` property in each category return:

```typescript
if (b < 18.5)
  return {
    label: "Underweight",
    color: "#06b6d4",
    tip: "Your custom health advice here",
  };
```

### Change placeholder values

Edit `BMICalculator.tsx`:

```typescript
{ label: "Height (cm)", value: height, set: setHeight, ph: "180" }, // Changed from 175
{ label: "Weight (kg)", value: weight, set: setWeight, ph: "80" }, // Changed from 72
```

### Customize styling

Edit `BMICalculator.tsx` - all Tailwind classes use design tokens:
- Primary color: `#10b981` (green)
- Background: `bg-[#f8f9fb]`
- Text: `text-[#0f1523]` (dark), `text-[#6b7a99]` (gray)

## Testing

```typescript
// Test BMI calculations
const { bmi, category } = useBMILogic();

// Input: height = "175", weight = "72"
// Expected bmi: ~23.5 (Normal weight, green)

// Input: height = "160", weight = "90"
// Expected bmi: ~35.2 (Obese, red)
```

## Dependencies

- React (hooks: useState)

## Performance Notes

- No external API calls
- Simple mathematical calculation
- Instant result updates
- Minimal re-renders

## Integration Checklist

- [ ] Import BMICalculator component
- [ ] Add to main router/nav alongside other tools
- [ ] Test with various height/weight inputs
- [ ] Verify category colors and ranges match documentation
- [ ] Check mobile responsiveness
