import { useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { CurrencyCode } from "../../utils/constants";
import { formatCurrencyCompact, formatCurrencyAxis, getCurrencySymbol } from "../../utils/currency";
import { CurrencySelector } from "../../components/CurrencySelector";
import { Field } from "../../components/Field";
import { useFIRELogic } from "./useFIRELogic";

export function FIRECalculator({ currency, setCurrency }: { currency: CurrencyCode; setCurrency: (currency: CurrencyCode) => void }) {
  const logic = useFIRELogic(currency);
  const currencySymbol = getCurrencySymbol(currency);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#e4e8f0] rounded-xl p-3 shadow-lg text-xs">
        <div className="text-[#6b7a99] mb-1 font-mono">{label}</div>
        <div className="text-[#4f46e5] font-semibold font-mono">{formatCurrencyCompact(payload[0]?.value ?? 0, currency)}</div>
        <div className="text-[#c4cad9] font-mono">Target: {formatCurrencyCompact(logic.fireNumber, currency)}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-3xl p-6 border border-[#e4e8f0] shadow-sm lg:col-span-1">
          <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-5">Your Numbers</div>
          <div className="space-y-4">
            <CurrencySelector currency={currency} onChange={setCurrency} />
            <Field
              label="Annual Income"
              value={logic.income}
              onChange={(e) => logic.setIncome(e.target.value)}
              prefix={currencySymbol}
              tooltip="Your total gross annual income."
            />
            <Field
              label="Annual Expenses"
              value={logic.expenses}
              onChange={(e) => logic.setExpenses(e.target.value)}
              prefix={currencySymbol}
              tooltip="Your total yearly spending — this sets your FIRE target."
            />
            <Field
              label="Current Savings / Portfolio"
              value={logic.currentSavings}
              onChange={(e) => logic.setCurrentSavings(e.target.value)}
              prefix={currencySymbol}
              tooltip="Total invested assets today (brokerage, 401k, IRA, etc.)"
            />
            <div className="pt-2 border-t border-[#f1f3f8]">
              <div className="text-[#c4cad9] text-xs font-mono uppercase tracking-widest mb-3">Assumptions</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Return %",
                    value: logic.returnRate,
                    onChange: logic.handleReturnRateChange,
                    tooltip: "Expected annual nominal return. S&P 500 historical avg ~10%.",
                  },
                  {
                    label: "Inflation %",
                    value: logic.inflationRate,
                    onChange: logic.handleInflationRateChange,
                    tooltip: "Expected annual inflation. US historical avg ~3%.",
                  },
                  {
                    label: "Withdrawal %",
                    value: logic.withdrawalRate,
                    onChange: logic.handleWithdrawalRateChange,
                    tooltip: "Safe withdrawal rate. The Trinity Study suggests 4%.",
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-[#6b7a99] text-xs">{f.label}</label>
                      <div className="group relative">
                        <Info size={10} className="text-[#c4cad9] cursor-help" />
                        <div className="absolute left-0 bottom-5 w-44 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {f.tooltip}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={f.value}
                        onChange={f.onChange}
                        className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-lg px-2 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5] transition-all pr-5"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c4cad9] text-xs">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "FIRE Number",
                value: formatCurrencyCompact(logic.fireNumber, currency),
                sub: `at ${logic.withdrawalRate}% SWR`,
                accent: "#4f46e5",
                bg: "#eef0fd",
              },
              {
                label: "Savings Rate",
                value: `${logic.savingsRate.toFixed(1)}%`,
                sub: `${formatCurrencyCompact(logic.annualSavings, currency)}/yr saved`,
                accent: "#10b981",
                bg: "#d1fae5",
              },
              {
                label: "Years to FIRE",
                value: logic.yearsToFire != null ? `${logic.yearsToFire}` : "100+",
                sub: logic.yearsToFire != null ? `Retire in ${logic.retirementYear}` : "Increase savings",
                accent: "#f59e0b",
                bg: "#fef3c7",
              },
              {
                label: "Real Return",
                value: `${(logic.realReturn * 100).toFixed(2)}%`,
                sub: "inflation-adjusted",
                accent: "#06b6d4",
                bg: "#ecfeff",
              },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#e4e8f0] shadow-sm">
                <div className="text-xs text-[#6b7a99] mb-1">{s.label}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: s.accent }}>
                  {s.value}
                </div>
                <div className="text-xs text-[#c4cad9] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest">Portfolio Growth</div>
              {logic.yearsToFire != null && (
                <div className="text-xs text-[#6b7a99] font-mono">
                  FIRE target: <span className="text-[#4f46e5] font-semibold">{formatCurrencyCompact(logic.fireNumber, currency)}</span>
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={logic.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f8" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#c4cad9" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `'${String(v).slice(2)}`}
                  interval={Math.floor(logic.chartData.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#c4cad9" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCurrencyAxis(v, currency)}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={logic.fireNumber}
                  stroke="#4f46e5"
                  strokeDasharray="5 3"
                  strokeOpacity={0.5}
                  label={{
                    value: "FIRE",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#4f46e5",
                  }}
                />
                {logic.yearsToFire != null && (
                  <ReferenceLine
                    x={logic.retirementYear!}
                    stroke="#10b981"
                    strokeDasharray="5 3"
                    strokeOpacity={0.6}
                    label={{
                      value: `${logic.retirementYear}`,
                      position: "insideTopLeft",
                      fontSize: 10,
                      fill: "#10b981",
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#portfolioGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#4f46e5",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Milestones */}
          {logic.yearsToFire != null && (
            <div className="bg-white rounded-2xl p-5 border border-[#e4e8f0] shadow-sm">
              <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-4">Milestones</div>
              <div className="space-y-2">
                {[0.25, 0.5, 0.75, 1].map((pct) => {
                  const target = logic.fireNumber * pct;
                  let yr = 0;
                  let p = logic.cur;
                  while (p < target && yr < 100) {
                    p = p * (1 + logic.realReturn) + logic.annualSavings;
                    yr++;
                  }
                  const reached = logic.cur >= target;
                  return (
                    <div key={pct} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-mono text-[#6b7a99]">{pct * 100}% FIRE</div>
                      <div className="flex-1 bg-[#f1f3f8] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-[#4f46e5]"
                          style={{ width: `${Math.min((logic.cur / target) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs font-mono text-[#6b7a99] w-28 text-right">
                        {reached ? (
                          <span className="text-[#10b981]">Reached!</span>
                        ) : (
                          `${new Date().getFullYear() + yr} · +${yr}yr`
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-[#eef0fd] border border-indigo-100 rounded-2xl px-5 py-4 text-xs text-[#6b7a99] leading-relaxed">
        <span className="text-[#4f46e5] font-semibold">How it works: </span>
        We simulate year-by-year investment growth, applying your returns and adding annual savings, until your portfolio reaches your FIRE number
        (annual expenses ÷ withdrawal %). Milestones show progress toward key targets (25%, 50%, 75%, 100% of FIRE number). Real return adjusts nominal
        return for inflation to show purchasing power growth.
      </div>
    </div>
  );
}
