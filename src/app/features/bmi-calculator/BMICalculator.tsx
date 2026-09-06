import { useBMILogic } from "./useBMILogic";

export function BMICalculator() {
  const { height, setHeight, weight, setWeight, bmi, category } = useBMILogic();

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-emerald-50 border border-[#e4e8f0]">
        <div className="text-[#10b981] text-xs font-mono uppercase tracking-widest mb-6">BMI Calculator</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: "Height (cm)", value: height, set: setHeight, ph: "175" },
            { label: "Weight (kg)", value: weight, set: setWeight, ph: "72" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[#6b7a99] text-sm block mb-1.5">{f.label}</label>
              <input
                type="number"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.ph}
                className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-3 text-[#0f1523] font-mono focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10"
              />
            </div>
          ))}
        </div>
        {bmi && category && (
          <div className="p-5 rounded-2xl text-center" style={{ backgroundColor: category.color + "10" }}>
            <div className="text-5xl font-mono font-light" style={{ color: category.color }}>
              {bmi.toFixed(1)}
            </div>
            <div className="text-sm mt-1 font-semibold" style={{ color: category.color }}>
              {category.label}
            </div>
            <p className="text-[#6b7a99] text-xs mt-3 leading-relaxed">{category.tip}</p>
          </div>
        )}
        <div className="mt-4 flex justify-between text-xs font-mono">
          {[
            ["<18.5", "#06b6d4"],
            ["18.5–25", "#10b981"],
            ["25–30", "#f59e0b"],
            [">30", "#ef4444"],
          ].map(([r, c]) => (
            <span key={r} style={{ color: c as string }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
