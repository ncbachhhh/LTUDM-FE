export default function StatCard({ label, value, subValue }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-[#F6F8FF] py-2 px-1">
      <div className="flex items-baseline">
        <span className="text-2xl font-normal">{value}</span>
        {subValue && (
          <span className="ml-1 text-base font-bold text-gray-400">
            {subValue && (
              <span className="text-[9px] font-bold text-slate-400">{subValue}</span>)}
          </span>
        )}
      </div>

      <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </span>
    </div>
  );
}
