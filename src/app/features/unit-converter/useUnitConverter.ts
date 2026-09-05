import { useState } from "react";

export type Category = "length" | "weight" | "temperature";

export interface UnitData {
  units: string[];
  toBase: number[];
}

export const unitData: Record<Category, UnitData> = {
  length: {
    units: ["Meters", "Kilometers", "Miles", "Feet", "Inches", "Centimeters"],
    toBase: [1, 1000, 1609.34, 0.3048, 0.0254, 0.01],
  },
  weight: {
    units: ["Kilograms", "Grams", "Pounds", "Ounces", "Tonnes"],
    toBase: [1, 0.001, 0.453592, 0.0283495, 1000],
  },
  temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: [1, 1, 1],
  },
};

export function useUnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [value, setValue] = useState("");

  const data = unitData[category];

  const convert = (): string | null => {
    if (!value) return null;
    const v = parseFloat(value);
    if (isNaN(v)) return null;

    if (category === "temperature") {
      // Convert to Celsius first
      const celsius =
        fromIndex === 0
          ? v
          : fromIndex === 1
            ? ((v - 32) * 5) / 9
            : v - 273.15;

      // Convert from Celsius to target
      const result =
        toIndex === 0
          ? celsius
          : toIndex === 1
            ? (celsius * 9) / 5 + 32
            : celsius + 273.15;

      return result.toFixed(4);
    }

    // For length and weight
    return (((v * data.toBase[fromIndex]) / data.toBase[toIndex]).toFixed(6));
  };

  const result = convert();

  return {
    category,
    setCategory,
    fromIndex,
    setFromIndex,
    toIndex,
    setToIndex,
    value,
    setValue,
    data,
    result,
  };
}
