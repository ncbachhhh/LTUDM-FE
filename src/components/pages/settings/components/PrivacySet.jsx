import React, { useState } from "react";
import { AtSign, Eye, Shield } from "lucide-react"; // Thêm Icon Shield

const Switch = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? "bg-[#0033FF]" : "bg-gray-200"}`}>
    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${checked ? "translate-x-6" : "translate-x-0"}`} />
  </div>
);

const PrivacySet = () => {
  const [showBirthday, setShowBirthday] = useState("full");
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [showEmail, setShowEmail] = useState(true); 
  const [mentionSuggestions, setMentionSuggestions] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden">
      
      {/* ── TIÊU ĐỀ ĐỒNG BỘ ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-gray-700 px-1 flex items-center gap-2">
          <Shield size={18} className="text-gray-500" />
          Quyền riêng tư
        </h2>
      </div>
      
      {/* ── CỤM 1: CÁ NHÂN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Cá nhân</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-gray-700">Hiện ngày sinh</span>
            <select value={showBirthday} onChange={(e) => setShowBirthday(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
              <option value="full">Hiện đầy đủ ngày, tháng, năm</option>
              <option value="hide">Ẩn ngày sinh</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-medium text-gray-700">Hiển thị trạng thái truy cập</span>
            <Switch checked={onlineStatus} onChange={setOnlineStatus} />
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-50 mt-1">
            <span className="font-medium text-gray-700">Hiện Email</span>
            <Switch checked={showEmail} onChange={setShowEmail} />
          </div>
        </div>
      </div>

      {/* ── CỤM 2: TIN NHẮN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Tin nhắn</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AtSign size={18} /></div>
              <div>
                <div className="font-medium text-[15px]">Gợi ý nhắc tên</div>
                <div className="text-xs text-gray-400 mt-0.5">Gợi ý nhắc tên theo nội dung đang soạn</div>
              </div>
            </div>
            <Switch checked={mentionSuggestions} onChange={setMentionSuggestions} />
          </div>
          <div className="flex items-center justify-between py-2 mt-2 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Eye size={18} /></div>
              <span className="font-medium text-[15px]">Hiện trạng thái "Đã xem"</span>
            </div>
            <Switch checked={readReceipts} onChange={setReadReceipts} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrivacySet;