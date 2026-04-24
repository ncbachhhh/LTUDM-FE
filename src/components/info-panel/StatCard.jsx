export default function StatCard({ label, value, subValue }) {
  return (
    <div className="flex min-h-[92px] flex-col items-center justify-center rounded-[20px] bg-[#F6F8FF] p-4">
      <div className="flex items-baseline">
        <span className="text-2xl font-normal">{value}</span>
        {subValue && (
          <span className="ml-1 text-[11px] font-bold text-gray-400">
            {subValue}
          </span>
        )}
      </div>

      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </span>
    </div>
  );
}
