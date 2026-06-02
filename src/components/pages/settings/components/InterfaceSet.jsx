import React, { useState } from "react";
import { Palette } from "lucide-react"; // Thêm Icon

const InterfaceSet = () => {
  const [theme, setTheme] = useState("light");
  const [showModal, setShowModal] = useState(false);

  const themeOptions = [
    { id: "light", label: "LightMode" },
    { id: "dark", label: "DarkMode" },
    { id: "system", label: "Smart" },
  ];

  const allColors = [
    { id: "c1", bg: "#0033FF", border: "#0033FF" },
    { id: "c2", bg: "#E91E63", border: "#E91E63" },
    { id: "c3", bg: "#9C27B0", border: "#9C27B0" },
    { id: "c4", bg: "#4CAF50", border: "#4CAF50" },
    { id: "c5", bg: "#FF9800", border: "#FF9800" },
    { id: "c6", bg: "#F44336", border: "#F44336" },
    { id: "c7", bg: "linear-gradient(135deg, #FF3E3E 0%, #FF9900 100%)", border: "#FF9900" },
    { id: "c8", bg: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)", border: "#0072FF" },
    { id: "c9", bg: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", border: "#4A00E0" },
    { id: "c10", bg: "linear-gradient(135deg, #00FF87 0%, #60EFFF 100%)", border: "#00FF87" },
    { id: "c11", bg: "linear-gradient(135deg, #FFD200 0%, #F7971E 100%)", border: "#F7971E" },
    { id: "c12", bg: "linear-gradient(135deg, #FF00CC 0%, #333399 100%)", border: "#FF00CC" },
  ];

  const [displayedColors, setDisplayedColors] = useState(allColors.slice(0, 4));
  const [activeColor, setActiveColor] = useState(allColors[0]);

  const handleSelectColor = (color) => {
    setActiveColor(color);
    setShowModal(false);
    setDisplayedColors((prev) => {
      const filtered = prev.filter(c => c.id !== color.id);
      return [color, ...filtered].slice(0, 4);
    });
  };

  const getRingStyle = (color, isActive) => ({
    background: color.bg,
    boxShadow: isActive ? `0 0 0 2px #FFFFFF, 0 0 0 5px ${color.border}` : "none",
  });

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden">
      
      {/* ── TIÊU ĐỀ ĐỒNG BỘ ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-gray-700 px-1 flex items-center gap-2">
          <Palette size={18} className="text-gray-500" />
          Giao diện
        </h2>
      </div>
      
      {/* ── CỤM 1: CÀI ĐẶT GIAO DIỆN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Cài đặt giao diện</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 w-full gap-2">
            {themeOptions.map((option) => {
              const isSelected = theme === option.id;
              return (
                <div key={option.id} onClick={() => setTheme(option.id)} className="flex flex-col items-center gap-2 cursor-pointer group mx-auto w-full max-w-[210px]">
                  <div className={`relative w-full aspect-[14/10] rounded-[16px] border-[3px] overflow-hidden flex transition-all duration-200 ${isSelected ? "border-[#0033FF] shadow-[0_4px_12px_rgba(0,51,255,0.08)] scale-[1.01]" : "border-gray-200 hover:border-gray-300"}`}>
                    {option.id === "light" && <div className="w-full h-full bg-[#EBF1FA] relative p-3 flex items-center justify-center"><div className="absolute top-3.5 left-3.5 w-6 h-6 rounded-full bg-[#A3C3FF]" /><div className="w-[62%] h-7 bg-white rounded-xl absolute top-3.5 left-12.5 shadow-sm border border-gray-100" /><div className="w-[48%] h-7 bg-[#A3C3FF] rounded-xl absolute bottom-3.5 right-3.5" /></div>}
                    {option.id === "dark" && <div className="w-full h-full bg-[#1E1E1E] relative p-3 flex items-center justify-center"><div className="absolute top-3.5 left-3.5 w-6 h-6 rounded-full bg-[#3E424B]" /><div className="w-[62%] h-7 bg-[#2A2B30] rounded-xl absolute top-3.5 left-12.5" /><div className="w-[48%] h-7 bg-[#0033FF] rounded-xl absolute bottom-3.5 right-3.5" /></div>}
                    {option.id === "system" && <div className="w-full h-full flex"><div className="w-1/2 h-full bg-[#EBF1FA] relative overflow-hidden"><div className="absolute top-3.5 left-3.5 w-6 h-6 rounded-full bg-[#A3C3FF]" /><div className="w-[124%] h-7 bg-white rounded-xl absolute top-3.5 left-12.5 shadow-sm border border-gray-100" /></div><div className="w-1/2 h-full bg-[#1E1E1E] relative border-l border-zinc-800 overflow-hidden"><div className="w-[96%] h-7 bg-[#0033FF] rounded-xl absolute bottom-3.5 right-3.5" /></div></div>}
                  </div>
                  <span className={`text-[14px] font-extrabold tracking-wide transition-colors mt-1 ${isSelected ? "text-[#0033FF]" : "text-black group-hover:text-gray-700"}`}>{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CỤM 2: MÀU BONG BÓNG CHAT ── */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        <h2 className="text-[16px] font-bold text-black px-1">Màu bong bóng chat</h2>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between flex-1">
          
          <div className="flex flex-col justify-center gap-4 flex-1">
            <div className="flex justify-start"><div className="bg-[#F1F2F6] h-[40px] w-[280px] rounded-2xl rounded-tl-sm"></div></div>
            <div className="flex justify-end"><div className="h-[40px] w-[340px] rounded-2xl rounded-tr-sm transition-all duration-300 shadow-sm" style={{ background: activeColor.bg }}></div></div>
            <div className="flex justify-start"><div className="bg-[#F1F2F6] h-[40px] w-[310px] rounded-2xl rounded-tl-sm"></div></div>
          </div>

          <div className="flex items-center justify-between mt-4 flex-shrink-0 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3.5 relative">
              {displayedColors.map((color) => (
                <div 
                  key={color.id}
                  onClick={() => setActiveColor(color)}
                  className="w-9 h-9 rounded-full cursor-pointer transition-all hover:scale-110"
                  style={getRingStyle(color, activeColor.id === color.id)}
                />
              ))}
              <div onClick={() => setShowModal(!showModal)} className="w-9 h-9 rounded-full bg-[#F1F2F6] text-[#A0A5B1] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              </div>

              {showModal && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModal(false)} />
                  <div className="absolute bottom-12 left-0 z-50 bg-white p-5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 w-[280px] animate-in fade-in zoom-in duration-200">
                    <div className="grid grid-cols-4 gap-4">
                      {allColors.map((color) => (
                        <div key={color.id} onClick={() => handleSelectColor(color)} className="w-12 h-12 rounded-full cursor-pointer transition-all duration-200 hover:scale-110" style={getRingStyle(color, activeColor.id === color.id)} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button className="bg-[#0033FF] hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl transition-colors text-[14px]">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSet;