import { useUnitConverter, type Category } from "./useUnitConverter";

export function UnitConverter() {
  const { category, setCategory, fromIndex, setFromIndex, toIndex, setToIndex, value, setValue, data, result } = useUnitConverter();

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-amber-50 border border-[#e4e8f0]">
        <div className="text-[#f59e0b] text-xs font-mono uppercase tracking-widest mb-6">Unit Converter</div>

        {/* Category selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["length", "weight", "temperature"] as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setFromIndex(0);
                setToIndex(1);
                setValue("");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                category === c
                  ? "bg-[#f59e0b] text-white shadow-md shadow-amber-200"
                  : "bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* From/To selectors */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "From", val: fromIndex, set: setFromIndex },
            { label: "To", val: toIndex, set: setToIndex },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[#6b7a99] text-xs block mb-1.5">{f.label}</label>
              <select
                value={f.val}
                onChange={(e) => f.set(Number(e.target.value))}
                className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-3 py-2.5 text-[#0f1523] text-sm focus:outline-none focus:border-[#f59e0b] cursor-pointer"
              >
                {data.units.map((u, i) => (
                  <option key={u} value={i}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Input field */}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-3 text-[#0f1523] font-mono focus:outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-amber-100 transition-all"
        />

        {/* Result display */}
        {result && (
          <div className="p-5 bg-[#fef3c7] rounded-2xl text-center mt-4">
            <div className="text-3xl font-mono font-light text-[#92400e]">{result}</div>
            <div className="text-xs text-[#a16207] mt-1">{data.units[toIndex]}</div>
            <div className="text-xs text-[#b45309] mt-2 font-mono opacity-70">
              {value} {data.units[fromIndex]} = {result} {data.units[toIndex]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
