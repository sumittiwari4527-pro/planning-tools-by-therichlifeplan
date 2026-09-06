/**
 * src/app/components/Field.tsx
 * Reusable input field component with tooltip support
 */

import { Info } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  tooltip?: string;
}

const inputCls = "w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-2.5 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]";

export function Field({ label, value, onChange, prefix = "$", tooltip }: Props) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[#6b7a99] text-xs font-medium">{label}</label>
        {tooltip && (
          <div className="group relative">
            <Info size={11} className="text-[#c4cad9] cursor-help" />
            <div className="absolute left-0 bottom-5 w-48 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4cad9] font-mono text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={`${inputCls} ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
}
