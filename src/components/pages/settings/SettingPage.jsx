import React, { useState } from "react";
import { Palette, ShieldCheck, Bell, KeyRound } from "lucide-react";

import InterfaceSet from "./components/InterfaceSet";
import NotiSet from "./components/NotiSet";
import PrivacySet from "./components/PrivacySet";
import SecuritySet from "./components/SecuritySet";

const SETTING_TABS = [
  { key: "THEME", label: "Giao diện", icon: <Palette size={19} /> },
  { key: "PRIVACY", label: "Quyền riêng tư", icon: <ShieldCheck size={19} /> },
  { key: "NOTIFICATION", label: "Thông báo", icon: <Bell size={19} /> },
  { key: "ACCOUNT", label: "Tài khoản và bảo mật", icon: <KeyRound size={19} /> },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("THEME");

  return (
    <div className="flex h-full bg-[#EEF1F6] p-4 gap-4 overflow-hidden">
      
      {/* ── SIDEBAR TRÁI: Chuẩn đét dải xanh tách biệt hộp trắng ── */}
      <div className="w-[320px] flex flex-col gap-3 shrink-0 h-full">
        <div className="w-full bg-[#D1DCFE] text-[#0029FF] border border-[#0029FF]/20 text-center font-black text-[14px] py-3 rounded-xl tracking-wider uppercase select-none shrink-0">
          Setting
        </div>

        <div className="bg-white rounded-[24px] flex-1 p-5 shadow-sm flex flex-col overflow-hidden">
          <nav className="space-y-3 flex-1 overflow-y-auto">
            {SETTING_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-4 p-3 cursor-pointer transition-all duration-200 rounded-[10px] border-none outline-none
                    ${isActive ? "text-[#0033FF] font-bold" : "text-black bg-transparent hover:bg-[#EEF2F9]"}`}
                  style={isActive ? { background: "linear-gradient(0deg, rgba(242, 230, 238, 0.3) 0%, rgba(151, 125, 255, 0.3) 100%)" } : {}}
                >
                  <span className={`flex items-center shrink-0 transition-colors ${isActive ? "text-[#0033FF]" : "text-gray-500"}`}>
                    {tab.icon}
                  </span>
                  <span className="text-[15px] flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── KHỐI NỘI DUNG PHẢI: Phẳng hoàn toàn, để các hộp trắng của sub-component tự nổi lên ── */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="w-full h-full overflow-y-auto pr-1">
          {activeTab === "THEME" && <InterfaceSet />}
          {activeTab === "PRIVACY" && <PrivacySet />}
          {activeTab === "NOTIFICATION" && <NotiSet />}
          {activeTab === "ACCOUNT" && <SecuritySet />}
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;