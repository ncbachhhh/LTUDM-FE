export default function SearchBar() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Tìm kiếm bạn bè"
        className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-sm font-bold text-gray-500 outline-none shadow-sm"
      />
      <img
        src="/icon-tim-kiem.svg"
        alt="Tìm kiếm"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
      />
    </div>
  );
}
