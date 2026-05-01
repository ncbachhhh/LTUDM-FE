
export default function ChatInput() {
  return (
    <div className="flex items-center gap-5 border-t border-gray-50 px-6 py-0">
      <button
        type="button"
        className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
      >
        <img src="/icon-micro.svg" className="h-6 w-6" alt="Biểu tượng micro" />
      </button>

      <button
        type="button"
        className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
      >
        <img src="/icon-anh.svg" className="h-6 w-6" alt="Biểu tượng ảnh" />
      </button>

      <div className="flex-1 rounded-full bg-[#0033FF]/5 px-6 py-4">
        <input
          type="text"
          className="w-full bg-transparent text-sm font-medium outline-none"
          placeholder="Nhập tin nhắn..."
        />
      </div>

      <button
        type="button"
        className="text-3xl text-blue-600 transition-transform hover:scale-110"
      >
        <img src="/nut-like.svg" className="h-6 w-6" alt="Biểu tượng thích" />
      </button>
    </div>
  );
}
