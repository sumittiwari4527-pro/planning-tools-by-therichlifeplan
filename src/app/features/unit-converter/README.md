# Unit Converter Feature

## Overview

Comprehensive unit converter supporting length, weight, and temperature conversions with instant calculations.

## Files

- **useUnitConverter.ts** - Custom hook for unit conversion logic
- **UnitConverter.tsx** - React component for the Unit Converter UI
- **README.md** - This file

## How to Use

### Import the component

```typescript
import { UnitConverter } from "@/app/features/unit-converter/UnitConverter";

// In your router or parent component
<UnitConverter />
```

### Using the hook directly

```typescript
import { useUnitConverter } from "@/app/features/unit-converter/useUnitConverter";

const { category, fromIndex, toIndex, value, data, result } = useUnitConverter();
```

## Supported Units

### Length
- Meters (base unit)
- Kilometers
- Miles
- Feet
- Inches
- Centimeters

### Weight
- Kilograms (base unit)
- Grams
- Pounds
- Ounces
- Tonnes

### Temperature
- Celsius (base)
- Fahrenheit
- Kelvin

## How It Works

### Conversion Algorithm

For **length and weight**:
1. Convert input value to base unit using `toBase[fromIndex]`
2. Convert from base unit to target using `toBase[toIndex]`
3. Result = (value × toBase[from]) / toBase[to]

For **temperature**:
1. Convert input to Celsius first (from any temperature scale)
2. Convert from Celsius to target scale
3. Special handling for Fahrenheit ↔ Celsius offset

### Base Unit Conversions

| Category | From Unit | To Base | Calculation |
|----------|-----------|---------|-------------|
| Length | Miles | Meters | miles × 1609.34 |
| Weight | Pounds | Kilograms | pounds × 0.453592 |
| Temperature | Fahrenheit | Celsius | (F - 32) × 5/9 |

## Modifying the Feature

### Add a new unit

Edit `useUnitConverter.ts`:

```typescript
export const unitData: Record<Category, UnitData> = {
  length: {
    units: ["Meters", "Kilometers", "Miles", "Feet", "Inches", "Centimeters", "Yards"],
    toBase: [1, 1000, 1609.34, 0.3048, 0.0254, 0.01, 0.9144],
  },
  // ...
};
```

### Add a new category

1. Add to `Category` type:
```typescript
export type Category = "length" | "weight" | "temperature" | "volume";
```

2. Add to `unitData`:
```typescript
volume: {
  units: ["Liters", "Milliliters", "Gallons", "Pints"],
  toBase: [1, 0.001, 3.78541, 0.473176],
},
```

3. Update category selector in `UnitConverter.tsx` (automatically includes new category)

### Change default category

Edit `useUnitConverter.ts`:

```typescript
const [category, setCategory] = useState<Category>("weight"); // Changed from "length"
```

### Customize styling

Edit `UnitConverter.tsx` - color theme uses amber:
- Primary: `#f59e0b` (amber)
- Background highlight: `bg-[#fef3c7]`
- Text: `text-[#0f1523]` (dark), `text-[#92400e]` (dark amber)

## Testing

```typescript
// Test conversions
const { result } = useUnitConverter();

// 1 mile to km
// Input: value="1", fromIndex=2, toIndex=1
// Expected: ~1.60934 km

// 70 kg to pounds
// Input: value="70", fromIndex=0, toIndex=2
// Expected: ~154.324 lbs

// 32°F to Celsius
// Input: value="32", category="temperature", fromIndex=1, toIndex=0
// Expected: 0°C
```

## Dependencies

- React (hooks: useState)

## Performance Notes

- No external API calls
- Simple arithmetic operations
- Instant result updates
- Zero formatting overhead for length/weight (fixed decimal places)
- Precision: 6 decimals for length/weight, 4 decimals for temperature

## Integration Checklist

- [ ] Import UnitConverter component
- [ ] Add to main router/nav alongside other tools
- [ ] Test conversions in all categories
- [ ] Verify base unit conversions are accurate
- [ ] Test edge cases (zero, negative, very large numbers)
- [ ] Check mobile responsiveness
