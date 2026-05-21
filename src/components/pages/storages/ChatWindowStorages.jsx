import React from "react";
import { Layout } from "lucide-react";

const ChatWindowStorages = ({ user }) => {
  return (
    <div className="h-full flex flex-col text-left">
      {/* Header */}
      <div className="p-4 px-8 border-b border-gray-100 flex items-center justify-between h-[72px]">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            className="w-10 h-10 rounded-full object-cover"
            alt=""
          />
          <h3 className="font-bold text-[17px]">{user.name}</h3>
        </div>
        <button className="p-2 border rounded-lg text-gray-500 hover:bg-gray-50">
          <Layout size={20} />
        </button>
      </div>

      {/* Vùng giữa (Trống hoặc hiện thông báo) */}
      <div className="flex-1 bg-white"></div>

      {/* Thanh hành động bên dưới */}
      <div className="p-10 border-t border-gray-100 bg-[#F9FAFB] flex flex-col items-center">
        <p className="text-[14px] text-gray-800 font-medium text-center max-w-[600px] mb-8 leading-relaxed">
          Nếu bạn chấp nhận, <span className="font-bold">{user.name}</span> sẽ
          có thể nhắn lại cho bạn, xem các thông tin như Trạng thái hoạt động
          của bạn và thời điểm bạn đọc tin nhắn.
        </p>

        <div className="flex gap-4 w-full max-w-[800px]">
          <button className="flex-1 py-4 bg-[#EFF2F8] text-black font-bold rounded-[16px] hover:bg-gray-200 transition-all">
            Chặn
          </button>
          <button className="flex-1 py-4 bg-[#EFF2F8] text-black font-bold rounded-[16px] hover:bg-gray-200 transition-all">
            Xóa bạn
          </button>
          <button className="flex-1 py-4 bg-[#E3E9FF] text-[#0029FF] font-bold rounded-[16px] hover:bg-blue-100 transition-all">
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowStorages;
