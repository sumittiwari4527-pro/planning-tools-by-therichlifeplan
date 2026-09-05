/**
 * src/app/utils/currency.ts
 * All currency-related utilities
 */

import { CURRENCY_OPTIONS, USD_PER_CURRENCY, CurrencyCode } from './constants';

export type { CurrencyCode };

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

export const formatCurrencyAxis = (n: number, currency: CurrencyCode): string => {
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

export const toInputNumberString = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  return String(parseFloat(value.toFixed(2)));
};

export const convertInputValue = (value: string, from: CurrencyCode, to: CurrencyCode): string => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return toInputNumberString(convertCurrencyAmount(n, from, to));
};
