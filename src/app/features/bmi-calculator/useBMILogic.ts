import { useState } from "react";

export interface BMICategory {
  label: string;
  color: string;
  tip: string;
}

export function useBMILogic() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const bmi = h && w ? w / Math.pow(h / 100, 2) : null;

  const getCategory = (b: number): BMICategory => {
    if (b < 18.5)
      return {
        label: "Underweight",
        color: "#06b6d4",
        tip: "Consult a nutritionist to reach a healthy weight.",
      };
    if (b < 25)
      return {
        label: "Normal weight",
        color: "#10b981",
        tip: "You're in the healthy BMI range. Keep it up.",
      };
    if (b < 30)
      return {
        label: "Overweight",
        color: "#f59e0b",
        tip: "Light exercise and diet adjustments may help.",
      };
    return {
      label: "Obese",
      color: "#ef4444",
      tip: "Consulting a healthcare professional is recommended.",
    };
  };

  const category = bmi ? getCategory(bmi) : null;

  return {
    height,
    setHeight,
    weight,
    setWeight,
    bmi,
    category,
  };
}
