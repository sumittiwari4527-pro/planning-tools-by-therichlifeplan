/**
 * src/app/components/CurrencySelector.tsx
 * Reusable currency selector component
 */

import { CurrencyCode, CURRENCY_OPTIONS } from '../utils/constants';

interface Props {
  currency: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ currency, onChange }: Props) {
  return (
    <div>
      <label className="text-[#6b7a99] text-xs font-medium block mb-1.5">Currency</label>
      <select
        value={currency}
        onChange={e => onChange(e.target.value as CurrencyCode)}
        className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-3 py-2.5 text-[#0f1523] text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5] cursor-pointer"
      >
        {CURRENCY_OPTIONS.map(option => (
          <option key={option.code} value={option.code}>
            {option.code} - {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
