/**
 * src/app/utils/formatting.ts
 * General formatting utilities
 */

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date, locale = "en-US"): string => {
  return new Intl.DateTimeFormat(locale).format(date);
};

export const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
