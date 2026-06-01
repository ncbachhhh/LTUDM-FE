import React, { useState } from "react";
import { Bell } from "lucide-react";

// ── COMPONENT: MÔ PHỎNG LAPTOP ──
const LaptopGraphic = ({ type, selected, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none">
    <div className={`relative w-36 h-[92px] border-[2px] rounded-t-2xl transition-all duration-300 flex items-center justify-center overflow-hidden ${selected ? "border-[#0029FF] bg-[#F4F7FF]" : "border-[#E5E7EB] bg-[#F9FAFB]"}`}>
      {type === "on" && (
        <div className={`absolute bottom-3 right-4 w-12 h-6 rounded-[3px] p-1 flex flex-col justify-center gap-0.5 shadow-sm transition-colors duration-300 ${selected ? "bg-[#0029FF]" : "bg-[#D1D5DB]"}`}>
          <div className="w-2.5 h-1 bg-white rounded-[1px]" />
          <div className="w-6 h-[1.5px] bg-white/60 rounded-[1px]" />
        </div>
      )}
    </div>
    <div className={`w-[164px] h-[6px] border-[2px] border-t-0 rounded-b-md transition-all duration-300 ${selected ? "border-[#0029FF] bg-[#E0E7FF]" : "border-[#E5E7EB] bg-[#E5E7EB]"}`} />
  </div>
);

// ── COMPONENT: NÚT GẠT SWITCH ÂM THANH ──
const Switch = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${checked ? "bg-[#0029FF]" : "bg-[#D1D5DB]"}`}>
    <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${checked ? "translate-x-6" : "translate-x-0"}`} />
  </div>
);

// ── MAIN COMPONENT ──
const NotiSet = () => {
  // Đã sửa: Mặc định bật hết thông báo và âm thanh ngay từ ban đầu
  const [notificationStatus, setNotificationStatus] = useState("on"); 
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden">
      
      {/* ── TIÊU ĐỀ ĐỒNG BỘ ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-gray-700 px-1 flex items-center gap-2">
          <Bell size={18} className="text-gray-500" />
          Thông báo
        </h2>
      </div>
      
      {/* ── CỤM 1: CÀI ĐẶT THÔNG BÁO ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div>
          <h2 className="text-[16px] font-bold text-black px-1">Cài đặt thông báo</h2>
          <p className="text-sm text-gray-400 mt-0.5 px-1">Nhận được thông báo mỗi khi có tin nhắn mới</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex gap-12 items-center">
          <div className="flex flex-col items-center gap-4">
            <LaptopGraphic type="on" selected={notificationStatus === "on"} onClick={() => setNotificationStatus("on")} />
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={notificationStatus === "on"} onChange={() => setNotificationStatus("on")} className="accent-[#0029FF] w-4 h-4 cursor-pointer" />
              Bật
            </label>
          </div>
          <div className="flex flex-col items-center gap-4">
            <LaptopGraphic type="off" selected={notificationStatus === "off"} onClick={() => setNotificationStatus("off")} />
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={notificationStatus === "off"} onChange={() => setNotificationStatus("off")} className="accent-[#0029FF] w-4 h-4 cursor-pointer" />
              Tắt
            </label>
          </div>
        </div>
      </div>

      {/* ── CỤM 2: ÂM THANH THÔNG BÁO ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Âm thanh thông báo</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-400">Phát âm thanh khi có tin nhắn & thông báo mới</p>
          <Switch checked={soundEnabled} onChange={setSoundEnabled} />
        </div>
      </div>

    </div>
  );
};

export default NotiSet;