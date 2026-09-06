import { useState, useRef, useEffect, useCallback } from "react";
import { CurrencyCode } from "../../utils/constants";
import { convertInputValue } from "../../utils/currency";

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: string;
  targetYears: string;
  currentSaved: string;
  priority: number;
}

export interface GoalData extends Goal {
  target: number;
  years: number;
  saved: number;
  months: number;
  required: number;
  progress: number;
  targetYear: number;
}

export interface ChartDataPoint {
  year: number;
  portfolio: number;
}

export interface AllocationData {
  id: string;
  give: number;
  pct: number;
  full: boolean;
}

export interface Suggestion {
  name: string;
  extra: number;
}

export const GOAL_PRESETS = [
  { name: "Emergency Fund", emoji: "🛡️", amount: "30000", years: "2" },
  { name: "Home Down Payment", emoji: "🏠", amount: "100000", years: "5" },
  { name: "Car", emoji: "🚗", amount: "25000", years: "3" },
  { name: "Vacation", emoji: "✈️", amount: "5000", years: "1" },
  { name: "Education Fund", emoji: "🎓", amount: "50000", years: "10" },
  { name: "Retirement", emoji: "🌴", amount: "1000000", years: "25" },
];

export function useGoalLogic(currency: CurrencyCode) {
  const [monthlyIncome, setMonthlyIncome] = useState("8000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("5000");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [goals, setGoals] = useState<Goal[]>([
    { id: "g1", name: "Emergency Fund", emoji: "🛡️", targetAmount: "30000", targetYears: "2", currentSaved: "5000", priority: 1 },
    { id: "g2", name: "Home Down Payment", emoji: "🏠", targetAmount: "100000", targetYears: "5", currentSaved: "0", priority: 2 },
    { id: "g3", name: "Retirement", emoji: "🌴", targetAmount: "1000000", targetYears: "25", currentSaved: "10000", priority: 3 },
  ]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", emoji: "🎯", targetAmount: "", targetYears: "", currentSaved: "0" });
  const previousCurrencyRef = useRef<CurrencyCode>(currency);

  // Handle currency changes
  useEffect(() => {
    const prev = previousCurrencyRef.current;
    if (prev === currency) return;

    setMonthlyIncome((v) => convertInputValue(v, prev, currency));
    setMonthlyExpenses((v) => convertInputValue(v, prev, currency));
    setGoals((prevGoals) =>
      prevGoals.map((g) => ({
        ...g,
        targetAmount: convertInputValue(g.targetAmount, prev, currency),
        currentSaved: convertInputValue(g.currentSaved, prev, currency),
      }))
    );
    setNewGoal((prevGoal) => ({
      ...prevGoal,
      targetAmount: convertInputValue(prevGoal.targetAmount, prev, currency),
      currentSaved: convertInputValue(prevGoal.currentSaved, prev, currency),
    }));

    previousCurrencyRef.current = currency;
  }, [currency]);

  // Core calculations
  const inc = parseFloat(monthlyIncome) || 0;
  const exp = parseFloat(monthlyExpenses) || 0;
  const mRate = Math.pow(1 + (parseFloat(returnRate) || 7) / 100, 1 / 12) - 1;
  const availableMonthly = inc - exp;

  // PMT: monthly payment needed to reach remaining FV
  const pmt = useCallback(
    (target: number, months: number, saved: number): number => {
      if (target <= 0 || months <= 0) return 0;
      const fvSaved = saved * Math.pow(1 + mRate, months);
      const remaining = Math.max(target - fvSaved, 0);
      if (remaining <= 0) return 0;
      return mRate === 0 ? remaining / months : (remaining * mRate) / (Math.pow(1 + mRate, months) - 1);
    },
    [mRate]
  );

  // Process goal data
  const goalData = goals.map((g) => {
    const target = parseFloat(g.targetAmount) || 0;
    const years = parseFloat(g.targetYears) || 1;
    const saved = parseFloat(g.currentSaved) || 0;
    const months = Math.round(years * 12);
    const required = pmt(target, months, saved);
    const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
    const targetYear = new Date().getFullYear() + Math.ceil(years);
    return { ...g, target, years, saved, months, required, progress, targetYear };
  });

  const totalRequired = goalData.reduce((s, g) => s + g.required, 0);
  const shortfall = Math.max(totalRequired - availableMonthly, 0);
  const surplus = Math.max(availableMonthly - totalRequired, 0);
  const isFeasible = shortfall < 0.01;

  // Priority-based waterfall allocation
  let budgetLeft = availableMonthly;
  const allocated = [...goalData]
    .sort((a, b) => a.priority - b.priority)
    .map((g) => {
      const give = Math.min(g.required, Math.max(budgetLeft, 0));
      budgetLeft -= give;
      const pct = g.required > 0 ? (give / g.required) * 100 : 100;
      return { id: g.id, give, pct, full: pct >= 99.5 };
    });

  const getAlloc = (id: string): AllocationData => allocated.find((a) => a.id === id) ?? { id, give: 0, pct: 0, full: false };

  // Suggestion 1: Annual step-up %
  const stepUpSuggestion: number | string | null = (() => {
    if (isFeasible || availableMonthly <= 0 || totalRequired <= 0) return null;
    for (let s = 1; s <= 60; s++) {
      const rate = s / 100;
      let ok = true;
      for (const g of goalData) {
        if (g.required === 0) continue;
        const base = availableMonthly * (g.required / totalRequired);
        let acc = g.saved;
        for (let m = 0; m < g.months; m++) {
          acc = acc * (1 + mRate) + base * Math.pow(1 + rate, Math.floor(m / 12));
        }
        if (acc < g.target * 0.99) {
          ok = false;
          break;
        }
      }
      if (ok) return s;
    }
    return ">60";
  })();

  // Suggestion 2: Extend lowest-priority goal
  const extendSuggestion: Suggestion | null = (() => {
    if (isFeasible || goalData.length === 0 || availableMonthly <= 0 || totalRequired <= 0) return null;
    const last = [...goalData].sort((a, b) => b.priority - a.priority)[0];
    const fraction = last.required / totalRequired;
    const forGoal = availableMonthly * fraction;
    if (forGoal <= 0) return null;
    for (let extra = 1; extra <= 30; extra++) {
      const newMonths = last.months + extra * 12;
      const req = pmt(last.target, newMonths, last.saved);
      if (req <= forGoal * 1.02) return { name: last.name, extra };
    }
    return null;
  })();

  // Goal management
  const addGoal = useCallback(() => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetYears) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `g${Date.now()}`,
        name: newGoal.name,
        emoji: newGoal.emoji,
        targetAmount: newGoal.targetAmount,
        targetYears: newGoal.targetYears,
        currentSaved: newGoal.currentSaved || "0",
        priority: prev.length + 1,
      },
    ]);
    setNewGoal({ name: "", emoji: "🎯", targetAmount: "", targetYears: "", currentSaved: "0" });
    setShowAddGoal(false);
  }, [newGoal]);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateGoal = useCallback((id: string, field: keyof Goal, value: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  }, []);

  // Chart data
  const maxYears = Math.max(...goalData.map((g) => g.years), 10);
  const chartYears = Math.min(Math.ceil(maxYears) + 5, 40);
  const chartData: ChartDataPoint[] = Array.from({ length: chartYears + 1 }, (_, y) => {
    let total = 0;
    goalData.forEach((g) => {
      const m = y * 12;
      const acc =
        m === 0
          ? g.saved
          : mRate === 0
            ? g.saved + g.required * m
            : g.saved * Math.pow(1 + mRate, m) + (g.required * (Math.pow(1 + mRate, m) - 1)) / mRate;
      total += Math.max(acc, 0);
    });
    return { year: new Date().getFullYear() + y, portfolio: Math.round(total) };
  });

  return {
    // State
    monthlyIncome,
    setMonthlyIncome,
    monthlyExpenses,
    setMonthlyExpenses,
    returnRate,
    setReturnRate,
    inflationRate,
    setInflationRate,
    goals,
    setGoals,
    showAddGoal,
    setShowAddGoal,
    newGoal,
    setNewGoal,

    // Computed
    inc,
    exp,
    availableMonthly,
    goalData,
    totalRequired,
    shortfall,
    surplus,
    isFeasible,
    getAlloc,
    stepUpSuggestion,
    extendSuggestion,
    chartData,

    // Handlers
    addGoal,
    removeGoal,
    updateGoal,
  };
}
