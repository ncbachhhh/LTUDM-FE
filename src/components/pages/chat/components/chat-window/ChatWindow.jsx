import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatWindow({ data, isInfoOpen, setIsInfoOpen }) {
  {
    /*3.Giao diện chính của khung chat khi có dữ liệu */
  }
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
      {/*thanh header: hiển tị avatar, tên người chat */}
      <div className="flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-4">
          <img
            src={data.avatar}
            className="h-11 w-11 rounded-full object-cover"
            alt={data.name}
          />
          <span className="text-base font-black">
            {data.name} {/* Lấy tên của người đang chọn */}
          </span>
        </div>
        {/* NÚT BẤM ĐỂ ẨN/HIỆN CỘT PHẢI */}
        <button
          onClick={() => setIsInfoOpen(!isInfoOpen)} // Đảo ngược trạng thái true/false khi bấm
          className={`p-2 rounded-lg transition-all ${isInfoOpen ? "bg-blue-50" : "hover:bg-gray-100"}`}
        >
          <img
            src="/thong-tin-hoi-thoai.svg"
            className="h-6 w-6"
            alt="Thông tin hội thoại"
          />
        </button>
      </div>
      {/*Hiển thị nd tin nhắn */}
      <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
        <MessageList messages={data.messages} avatar={data.avatar} />
      </div>
      {/*Chỗ nhập tin nhắn, icon, gửi ảnh */}
      <div className="p-4 pb-6 bg-white">
        <ChatInput />
      </div>
    </div>
  );
}
