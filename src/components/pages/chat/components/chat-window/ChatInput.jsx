
export default function ChatInput() {
  const [text, setText] = useState("");

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && text.trim() !== "") {
      console.log("Gửi tin nhắn:", text);
      setText(""); // Xóa nội dung sau khi gửi
    }
  };

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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleSendMessage}
          className="w-full bg-transparent text-sm font-medium outline-none"
          placeholder="Nhập tin nhắn..."
        />
      </div>
      {/* Nút Like - Sẽ đổi thành nút Gửi nếu có chữ */}
      <button
        type="button"
        className="text-3xl text-blue-600 transition-transform hover:scale-110"
      >
        {text.trim() === "" ? (
          <img src="/nut-like.svg" className="h-6 w-6" alt="Biểu tượng thích" />
        ) : (
          /* Icon Gửi (Máy bay giấy) khi có nội dung nhập */
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 fill-[#0084FF]"
            onClick={() => {
              console.log("Gửi:", text);
              setText("");
            }}
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
