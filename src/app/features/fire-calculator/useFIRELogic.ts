/**
 * src/app/features/fire-calculator/useFIRELogic.ts
 * FIRE calculation logic - extracted to a reusable hook
 * This example shows how to extract calculator logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { CurrencyCode } from '../../utils/constants';
import { convertInputValue } from '../../utils/currency';

export function useFIRELogic(currency: CurrencyCode) {
  const [income, setIncome] = useState("120000");
  const [expenses, setExpenses] = useState("48000");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  const previousCurrencyRef = useRef<CurrencyCode>(currency);

  // Parse values
  const inc = parseFloat(income) || 0;
  const exp = parseFloat(expenses) || 0;
  const cur = parseFloat(currentSavings) || 0;
  const rr = (parseFloat(returnRate) || 7) / 100;
  const ir = (parseFloat(inflationRate) || 3) / 100;
  const wr = (parseFloat(withdrawalRate) || 4) / 100;

  // Calculate metrics
  const annualSavings = inc - exp;
  const savingsRate = inc > 0 ? (annualSavings / inc) * 100 : 0;
  const fireNumber = exp / wr;
  const realReturn = (1 + rr) / (1 + ir) - 1;

  // Calculate years to FIRE via simulation
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

  // Handle currency changes
  useEffect(() => {
    const prev = previousCurrencyRef.current;
    if (prev === currency) return;

    setIncome(v => convertInputValue(v, prev, currency));
    setExpenses(v => convertInputValue(v, prev, currency));
    setCurrentSavings(v => convertInputValue(v, prev, currency));

    previousCurrencyRef.current = currency;
  }, [currency]);

  // Memoized handlers
  const handleIncomeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(e.target.value);
  }, []);

  const handleExpensesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenses(e.target.value);
  }, []);

  const handleCurrentSavingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSavings(e.target.value);
  }, []);

  const handleReturnRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnRate(e.target.value);
  }, []);

  const handleInflationRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInflationRate(e.target.value);
  }, []);

  const handleWithdrawalRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawalRate(e.target.value);
  }, []);

  return {
    // State
    income,
    setIncome,
    handleIncomeChange,
    expenses,
    setExpenses,
    handleExpensesChange,
    currentSavings,
    setCurrentSavings,
    handleCurrentSavingsChange,
    returnRate,
    setReturnRate,
    handleReturnRateChange,
    inflationRate,
    setInflationRate,
    handleInflationRateChange,
    withdrawalRate,
    setWithdrawalRate,
    handleWithdrawalRateChange,

    // Results
    annualSavings,
    savingsRate,
    fireNumber,
    realReturn,
    yearsToFire,
    retirementYear,
    chartData,
    cur,
  };
}
