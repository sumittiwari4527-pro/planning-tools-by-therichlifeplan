import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { CurrencyCode, SITE_NAME } from "../../utils/constants";
import { formatCurrencyCompact, formatCurrencyAxis } from "../../utils/currency";
import { getCurrencySymbol } from "../../utils/currency";
import { CurrencySelector } from "../../components/CurrencySelector";
import { Field } from "../../components/Field";
import { useGoalLogic, GOAL_PRESETS } from "./useGoalLogic";
import type { Goal, ChartDataPoint } from "./useGoalLogic";

export function GoalPlanner({ currency, setCurrency }: { currency: CurrencyCode; setCurrency: (currency: CurrencyCode) => void }) {
  const logic = useGoalLogic(currency);
  const currencySymbol = getCurrencySymbol(currency);

  const GoalTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#e4e8f0] rounded-xl p-3 shadow-lg text-xs">
        <div className="text-[#6b7a99] mb-1 font-mono">{label}</div>
        <div className="text-[#8b5cf6] font-semibold font-mono">{formatCurrencyCompact(payload[0]?.value ?? 0, currency)}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Row 1: Finances | Stats + Goals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Finances */}
        <div className="bg-white rounded-3xl p-6 border border-[#e4e8f0] shadow-sm space-y-4 lg:col-span-1">
          <div className="text-[#8b5cf6] text-xs font-mono uppercase tracking-widest">Your Finances</div>
          <CurrencySelector currency={currency} onChange={setCurrency} />

          {/* Available banner */}
          <div className={`rounded-2xl p-4 ${logic.isFeasible ? "bg-[#d1fae5]" : "bg-[#fee2e2]"}`}>
            <div className="text-xs font-medium mb-0.5" style={{ color: logic.isFeasible ? "#065f46" : "#991b1b" }}>
              Monthly Available to Save
            </div>
            <div className="text-2xl font-mono font-bold" style={{ color: logic.isFeasible ? "#10b981" : "#ef4444" }}>
              {formatCurrencyCompact(logic.availableMonthly, currency)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: logic.isFeasible ? "#047857" : "#b91c1c" }}>
              {logic.isFeasible ? `${formatCurrencyCompact(logic.surplus, currency)} surplus after goals` : `${formatCurrencyCompact(logic.shortfall, currency)}/mo shortfall`}
            </div>
          </div>

          <Field label="Monthly Income" value={logic.monthlyIncome} onChange={(e) => logic.setMonthlyIncome(e.target.value)} prefix={currencySymbol} tooltip="Total take-home monthly income." />
          <Field label="Monthly Expenses" value={logic.monthlyExpenses} onChange={(e) => logic.setMonthlyExpenses(e.target.value)} prefix={currencySymbol} tooltip="All fixed + variable monthly spending (rent, food, transport, etc.)" />

          <div className="pt-2 border-t border-[#f1f3f8]">
            <div className="text-[#c4cad9] text-xs font-mono uppercase tracking-widest mb-3">Assumptions</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Return %", v: logic.returnRate, set: logic.setReturnRate, tip: "Expected annual nominal return on investments." },
                { label: "Inflation %", v: logic.inflationRate, set: logic.setInflationRate, tip: "Expected annual inflation rate." },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex items-center gap-1 mb-1.5">
                    <label className="text-[#6b7a99] text-xs">{f.label}</label>
                    <div className="group relative">
                      <Info size={10} className="text-[#c4cad9] cursor-help" />
                      <div className="absolute left-0 bottom-5 w-44 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{f.tip}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={f.v}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-lg px-2 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/20 pr-5"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c4cad9] text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Summary stats + Goal cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Goals Set", value: `${logic.goals.length}`, sub: "active goals", accent: "#8b5cf6", bg: "#f3f0ff" },
              { label: "Total Target", value: formatCurrencyCompact(logic.goalData.reduce((s, g) => s + g.target, 0), currency), sub: "across all goals", accent: "#8b5cf6", bg: "#f3f0ff" },
              { label: "Needed/Month", value: formatCurrencyCompact(logic.totalRequired, currency), sub: "to hit all goals", accent: logic.isFeasible ? "#10b981" : "#ef4444", bg: logic.isFeasible ? "#d1fae5" : "#fee2e2" },
              { label: "Status", value: logic.isFeasible ? "On Track" : "Shortfall", sub: logic.isFeasible ? `${formatCurrencyCompact(logic.surplus, currency)} surplus` : `${formatCurrencyCompact(logic.shortfall, currency)} short`, accent: logic.isFeasible ? "#10b981" : "#ef4444", bg: logic.isFeasible ? "#d1fae5" : "#fee2e2" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#e4e8f0] shadow-sm">
                <div className="text-xs text-[#6b7a99] mb-1">{s.label}</div>
                <div className="text-xl font-bold font-mono leading-tight" style={{ color: s.accent }}>
                  {s.value}
                </div>
                <div className="text-xs text-[#c4cad9] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Goal cards */}
          <div className="bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#8b5cf6] text-xs font-mono uppercase tracking-widest">Your Goals</div>
              <button
                onClick={() => logic.setShowAddGoal(!logic.showAddGoal)}
                className="text-xs bg-[#f3f0ff] text-[#8b5cf6] border border-violet-100 px-3 py-1.5 rounded-xl font-medium hover:bg-[#ede9fe] transition-colors cursor-pointer"
              >
                + Add Goal
              </button>
            </div>

            {/* Add goal form */}
            {logic.showAddGoal && (
              <div className="mb-4 p-4 bg-[#faf8ff] border border-violet-100 rounded-2xl space-y-3">
                <div className="text-xs text-[#8b5cf6] font-mono uppercase tracking-widest">New Goal</div>
                <div className="flex flex-wrap gap-1.5">
                  {GOAL_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        logic.setNewGoal({
                          ...logic.newGoal,
                          name: p.name,
                          emoji: p.emoji,
                          targetAmount: p.amount,
                          targetYears: p.years,
                        })
                      }
                      className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#e4e8f0] text-[#6b7a99] hover:border-violet-200 hover:text-[#8b5cf6] cursor-pointer transition-all"
                    >
                      {p.emoji} {p.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#6b7a99] text-xs block mb-1">Goal Name</label>
                    <input
                      value={logic.newGoal.name}
                      onChange={(e) => logic.setNewGoal({ ...logic.newGoal, name: e.target.value })}
                      placeholder="e.g. House Down Payment"
                      className="w-full bg-white border border-[#e4e8f0] rounded-xl px-3 py-2 text-[#0f1523] text-sm focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6b7a99] text-xs block mb-1">Emoji</label>
                    <input
                      value={logic.newGoal.emoji}
                      onChange={(e) => logic.setNewGoal({ ...logic.newGoal, emoji: e.target.value })}
                      maxLength={2}
                      className="w-full bg-white border border-[#e4e8f0] rounded-xl px-3 py-2 text-center text-xl focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6b7a99] text-xs block mb-1">
                      Target Amount ({currency})
                    </label>
                    <input
                      type="number"
                      value={logic.newGoal.targetAmount}
                      onChange={(e) => logic.setNewGoal({ ...logic.newGoal, targetAmount: e.target.value })}
                      placeholder="100000"
                      className="w-full bg-white border border-[#e4e8f0] rounded-xl px-3 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6b7a99] text-xs block mb-1">Years to Goal</label>
                    <input
                      type="number"
                      value={logic.newGoal.targetYears}
                      onChange={(e) => logic.setNewGoal({ ...logic.newGoal, targetYears: e.target.value })}
                      placeholder="5"
                      className="w-full bg-white border border-[#e4e8f0] rounded-xl px-3 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#6b7a99] text-xs block mb-1">Already Saved ({currency})</label>
                    <input
                      type="number"
                      value={logic.newGoal.currentSaved}
                      onChange={(e) => logic.setNewGoal({ ...logic.newGoal, currentSaved: e.target.value })}
                      placeholder="0"
                      className="w-full bg-white border border-[#e4e8f0] rounded-xl px-3 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={logic.addGoal}
                    className="bg-[#8b5cf6] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#7c3aed] transition-colors cursor-pointer shadow-md shadow-violet-100"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => logic.setShowAddGoal(false)}
                    className="text-[#6b7a99] px-4 py-2 rounded-xl text-xs hover:bg-[#f1f3f8] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Goal cards list */}
            <div className="space-y-3">
              {logic.goalData.map((g) => {
                const alloc = logic.getAlloc(g.id);
                return (
                  <div
                    key={g.id}
                    className={`border rounded-2xl p-4 transition-all ${alloc.full ? "border-[#d1fae5]" : "border-[#fee2e2]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5 select-none">{g.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            value={g.name}
                            onChange={(e) => logic.updateGoal(g.id, "name", e.target.value)}
                            className="text-[#0f1523] text-sm font-semibold bg-transparent border-0 focus:outline-none focus:bg-[#f8f9fb] rounded px-1 -ml-1 flex-1 min-w-0"
                          />
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium shrink-0 ${alloc.full ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"}`}
                          >
                            {alloc.full ? "✓ Funded" : `${Math.round(alloc.pct)}% funded`}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {[
                            { label: `Target (${currency})`, field: "targetAmount" as keyof Goal, val: g.targetAmount, pre: currencySymbol },
                            { label: "In (yrs)", field: "targetYears" as keyof Goal, val: g.targetYears, pre: "" },
                            { label: `Saved (${currency})`, field: "currentSaved" as keyof Goal, val: g.currentSaved, pre: currencySymbol },
                          ].map((f) => (
                            <div key={f.label}>
                              <div className="text-[#c4cad9] text-[10px] mb-0.5">{f.label}</div>
                              <div className="relative">
                                {f.pre && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#c4cad9] text-xs">{f.pre}</span>}
                                <input
                                  type="number"
                                  value={f.val}
                                  onChange={(e) => logic.updateGoal(g.id, f.field, e.target.value)}
                                  className={`w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-lg py-1.5 text-[#0f1523] font-mono text-xs focus:outline-none focus:border-[#8b5cf6] ${f.pre ? "pl-5 pr-1" : "px-2"}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[#6b7a99]">
                            Need{" "}
                            <span className="font-mono text-[#8b5cf6] font-semibold">{formatCurrencyCompact(g.required, currency)}/mo</span>
                            <span className="text-[#c4cad9] ml-2">→ {g.targetYear}</span>
                          </span>
                          <button
                            onClick={() => logic.removeGoal(g.id)}
                            className="text-[#c4cad9] hover:text-[#ef4444] transition-colors cursor-pointer ml-2 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="bg-[#f1f3f8] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${g.progress}%`,
                              backgroundColor: alloc.full ? "#10b981" : "#8b5cf6",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {logic.goals.length === 0 && (
                <div className="text-center py-8 text-[#c4cad9] text-sm">No goals yet. Click "+ Add Goal" to get started.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Chart + Plan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm">
          <div className="text-[#8b5cf6] text-xs font-mono uppercase tracking-widest mb-4">Portfolio Growth Projection</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={logic.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
              <Tooltip content={<GoalTooltip />} />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#goalGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#8b5cf6", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-3">
            {logic.goalData.map((g) => (
              <div key={g.id} className="flex items-center gap-1.5 text-xs text-[#6b7a99]">
                <span>{g.emoji}</span>
                <span>{g.name}</span>
                <span className="text-[#c4cad9] font-mono">→ {g.targetYear}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations panel */}
        <div className="bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm space-y-4">
          <div className="text-[#8b5cf6] text-xs font-mono uppercase tracking-widest">Your Plan</div>

          {logic.isFeasible ? (
            <>
              <div className="p-4 bg-[#d1fae5] border border-emerald-100 rounded-2xl">
                <div className="text-[#065f46] text-sm font-semibold mb-1">✓ All Goals Achievable!</div>
                <p className="text-[#047857] text-xs leading-relaxed">
                  Saving <span className="font-mono font-semibold">{formatCurrencyCompact(logic.totalRequired, currency)}/mo</span> funds all{" "}
                  {logic.goals.length} goal{logic.goals.length !== 1 ? "s" : ""}. You have{" "}
                  <span className="font-mono font-semibold">{formatCurrencyCompact(logic.surplus, currency)}/mo</span> to spare.
                </p>
              </div>
              {logic.surplus > 0 && (
                <div className="border border-[#f1f3f8] rounded-2xl p-3">
                  <div className="text-[#0f1523] text-xs font-semibold mb-1">💡 Invest your surplus</div>
                  <p className="text-[#6b7a99] text-xs leading-relaxed">
                    Put the <span className="font-mono text-[#8b5cf6] font-semibold">{formatCurrencyCompact(logic.surplus, currency)}/mo</span> surplus into a
                    401k, IRA, or index fund to accelerate wealth building.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-[#fee2e2] border border-red-100 rounded-2xl">
                <div className="text-[#991b1b] text-sm font-semibold mb-1">
                  ⚠ {formatCurrencyCompact(logic.shortfall, currency)}/mo Shortfall
                </div>
                <p className="text-[#b91c1c] text-xs leading-relaxed">
                  You need <span className="font-mono font-semibold">{formatCurrencyCompact(logic.shortfall, currency)}</span> more per month. Choose a path:
                </p>
              </div>
              <div className="text-[#c4cad9] text-[10px] font-mono uppercase tracking-widest">Options to Get on Track</div>

              {logic.stepUpSuggestion !== null && (
                <div className="border border-[#f1f3f8] rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-[#ede9fe] flex items-center justify-center text-[10px] font-bold text-[#8b5cf6] shrink-0">
                      1
                    </div>
                    <div className="text-[#0f1523] text-xs font-semibold">Step Up Savings Yearly</div>
                  </div>
                  <p className="text-[#6b7a99] text-xs leading-relaxed pl-7">
                    Increase your savings by{" "}
                    <span className="text-[#8b5cf6] font-semibold">{logic.stepUpSuggestion}% each year</span> (via raises or annual expense cuts) to hit
                    every goal on schedule.
                  </p>
                </div>
              )}

              <div className="border border-[#f1f3f8] rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[#ede9fe] flex items-center justify-center text-[10px] font-bold text-[#8b5cf6] shrink-0">
                    2
                  </div>
                  <div className="text-[#0f1523] text-xs font-semibold">Reduce Monthly Expenses</div>
                </div>
                <p className="text-[#6b7a99] text-xs leading-relaxed pl-7">
                  Cut spending by{" "}
                  <span className="text-[#8b5cf6] font-semibold">{formatCurrencyCompact(logic.shortfall, currency)}/mo</span> (
                  {formatCurrencyCompact(logic.shortfall * 12, currency)}/yr) to make all goals immediately feasible.
                </p>
              </div>

              {logic.extendSuggestion && (
                <div className="border border-[#f1f3f8] rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-[#ede9fe] flex items-center justify-center text-[10px] font-bold text-[#8b5cf6] shrink-0">
                      3
                    </div>
                    <div className="text-[#0f1523] text-xs font-semibold">Extend Lowest-Priority Goal</div>
                  </div>
                  <p className="text-[#6b7a99] text-xs leading-relaxed pl-7">
                    Push <span className="text-[#8b5cf6] font-semibold">{logic.extendSuggestion.name}</span> back by {logic.extendSuggestion.extra} year
                    {logic.extendSuggestion.extra > 1 ? "s" : ""} to make everything else feasible.
                  </p>
                </div>
              )}

              {/* Priority waterfall */}
              <div className="border border-[#f1f3f8] rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[#ede9fe] flex items-center justify-center text-[10px] font-bold text-[#8b5cf6] shrink-0">
                    4
                  </div>
                  <div className="text-[#0f1523] text-xs font-semibold">Priority Funding (Top → Bottom)</div>
                </div>
                <div className="space-y-2 pl-7">
                  {[...logic.goalData]
                    .sort((a, b) => a.priority - b.priority)
                    .map((g) => {
                      const alloc = logic.getAlloc(g.id);
                      return (
                        <div key={g.id} className="flex items-center gap-2">
                          <span className="text-base shrink-0">{g.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-[10px] mb-0.5">
                              <span className="text-[#6b7a99] truncate">{g.name}</span>
                              <span className={`ml-1 shrink-0 font-mono ${alloc.full ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                {Math.round(alloc.pct)}%
                              </span>
                            </div>
                            <div className="bg-[#f1f3f8] rounded-full h-1">
                              <div
                                className="h-1 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(alloc.pct, 100)}%`,
                                  backgroundColor: alloc.full ? "#10b981" : "#8b5cf6",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Allocation table ── */}
      <div className="bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm">
        <div className="text-[#8b5cf6] text-xs font-mono uppercase tracking-widest mb-4">Monthly Savings Allocation Plan</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f3f8]">
                {["Goal", "Target", "Already Saved", "Needed/Month", "Target Year", "Status"].map((h) => (
                  <th key={h} className="text-left text-[#c4cad9] text-xs font-mono uppercase pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8f9fb]">
              {logic.goalData.map((g) => {
                const alloc = logic.getAlloc(g.id);
                return (
                  <tr key={g.id}>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="mr-1.5">{g.emoji}</span>
                      <span className="text-[#0f1523] font-medium">{g.name}</span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[#0f1523]">{formatCurrencyCompact(g.target, currency)}</td>
                    <td className="py-3 pr-4 font-mono text-[#6b7a99]">{formatCurrencyCompact(g.saved, currency)}</td>
                    <td className="py-3 pr-4 font-mono text-[#8b5cf6] font-semibold">{formatCurrencyCompact(g.required, currency)}</td>
                    <td className="py-3 pr-4 font-mono text-[#6b7a99]">{g.targetYear}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          alloc.full ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"
                        }`}
                      >
                        {alloc.full ? "✓ On Track" : "Needs Funding"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="border-t-2 border-[#e4e8f0]">
                <td className="py-3 pr-4 font-bold text-[#0f1523]">Total</td>
                <td className="py-3 pr-4 font-mono font-bold text-[#0f1523]">
                  {formatCurrencyCompact(logic.goalData.reduce((s, g) => s + g.target, 0), currency)}
                </td>
                <td className="py-3 pr-4 font-mono text-[#6b7a99]">
                  {formatCurrencyCompact(logic.goalData.reduce((s, g) => s + g.saved, 0), currency)}
                </td>
                <td className="py-3 pr-4 font-mono font-bold" style={{ color: logic.isFeasible ? "#10b981" : "#ef4444" }}>
                  {formatCurrencyCompact(logic.totalRequired, currency)}
                </td>
                <td className="py-3 pr-4" />
                <td className="py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      logic.isFeasible ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {logic.isFeasible ? "✓ Feasible" : `${formatCurrencyCompact(logic.shortfall, currency)}/mo short`}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-[#f3f0ff] border border-violet-100 rounded-2xl px-5 py-4 text-xs text-[#6b7a99] leading-relaxed">
        <span className="text-[#8b5cf6] font-semibold">How it works: </span>
        Each goal's required monthly contribution uses the annuity future-value formula at{" "}
        <span className="font-mono text-[#8b5cf6]">{logic.returnRate}%</span> annual return — existing savings grow at the same rate, reducing your
        required payment. Step-up suggestions simulate year-by-year contribution increases proportional to your goal allocation. Funding status reflects
        priority order: highest-priority goals are funded first from your available monthly surplus.
      </div>
    </div>
  );
}
