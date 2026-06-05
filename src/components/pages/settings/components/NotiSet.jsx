import React, { useState, useEffect } from "react";
import { Bell, Volume2, Play, Pause, ChevronDown, Check } from "lucide-react";
import { Switch, Radio } from "antd";

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
    <div className={`w-[164px] h-[6px] border-[2px] border-t-0 rounded-b-md transition-all duration-300 ${selected ? "border-[#0029FF] bg-[#0029FF]" : "border-[#E5E7EB] bg-[#E5E7EB]"}`} />
  </div>
);

const NotiSet = () => {
  const [notificationStatus, setNotificationStatus] = useState("on");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSoundDropdown, setShowSoundDropdown] = useState(false);

  // Danh sách đủ đúng 8 âm thanh
  const soundList = [
    { id: "default", name: "sound1 (default)", url: "/sounds/default.mp3" },
    { id: "sound2", name: "sound2", url: "/sounds/sound2.mp3" },
    { id: "sound3", name: "sound3", url: "/sounds/sound3.mp3" },
    { id: "sound4", name: "sound4", url: "/sounds/sound4.mp3" },
    { id: "sound5", name: "sound5", url: "/sounds/sound5.mp3" },
    { id: "sound6", name: "sound6", url: "/sounds/sound6.mp3" },
    { id: "sound7", name: "sound7", url: "/sounds/sound7.mp3" },
    { id: "sound8", name: "sound8", url: "/sounds/sound8.mp3" },
  ];

  const [selectedSound, setSelectedSound] = useState(soundList[0]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Xử lý phát nghe thử âm thanh
  const handlePlayPreview = (e, sound) => {
    e.stopPropagation();
    
    if (currentAudio) {
      currentAudio.pause();
      if (playingId === sound.id) {
        setPlayingId(null);
        setCurrentAudio(null);
        return;
      }
    }

    const audio = new Audio(sound.url);
    audio.volume = 0.6;
    audio.play().catch(err => {
      console.error(`Không tìm thấy file tại public/sounds/${sound.id}.mp3:`, err);
    });
    
    setPlayingId(sound.id);
    setCurrentAudio(audio);

    audio.onended = () => {
      setPlayingId(null);
      setCurrentAudio(null);
    };
  };

  useEffect(() => {
    return () => {
      if (currentAudio) currentAudio.pause();
    };
  }, [currentAudio]);

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden pb-6 text-slate-800">
      
      {/* ── TIÊU ĐỀ CHÍNH ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-slate-700 px-1 flex items-center gap-2">
          <Bell size={18} className="text-slate-500" />
          Thông báo
        </h2>
      </div>

      {/* ── CỤM 1: CÀI ĐẶT THÔNG BÁO ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-slate-800 px-1">Cài đặt thông báo</h2>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex gap-12 items-center">
          <div className="flex flex-col items-center gap-4">
            <LaptopGraphic type="on" selected={notificationStatus === "on"} onClick={() => setNotificationStatus("on")} />
            <Radio checked={notificationStatus === "on"} onChange={() => setNotificationStatus("on")} className="text-[15px] font-semibold text-slate-700">
              Bật
            </Radio>
          </div>
          <div className="flex flex-col items-center gap-4">
            <LaptopGraphic type="off" selected={notificationStatus === "off"} onClick={() => setNotificationStatus("off")} />
            <Radio checked={notificationStatus === "off"} onChange={() => setNotificationStatus("off")} className="text-[15px] font-semibold text-slate-700">
              Tắt
            </Radio>
          </div>
        </div>
      </div>

      {/* ── CỤM 2: ÂM THANH THÔNG BÁO ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-slate-800 px-1">Âm thanh thông báo</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          
          {/* Dòng bật tắt */}
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium text-slate-500">Phát âm thanh khi có tin nhắn mới</p>
            <Switch checked={soundEnabled} onChange={(checked) => {
              setSoundEnabled(checked);
              if(!checked) setShowSoundDropdown(false);
            }} />
          </div>

          {/* Bộ chọn âm thanh phẳng */}
          {soundEnabled && (
            <div className="border-t border-gray-50 pt-4 flex flex-col gap-2 relative">
              <label className="text-[15px] font-medium text-slate-500">Nhạc chuông thông báo</label>
              
              {/* Vùng hiển thị hàng ngang phẳng */}
              <div 
                onClick={() => setShowSoundDropdown(!showSoundDropdown)}
                className="flex items-center justify-between py-1 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-[15px] font-semibold text-slate-700">{selectedSound.name}</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${showSoundDropdown ? "rotate-180" : ""}`} />
              </div>

              {/* Menu danh sách nổi - Có thanh kéo lướt mượt và lướt kịch được âm số 8 */}
              {showSoundDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSoundDropdown(false)} />
                  
                  {/* Giải pháp: max-h-[180px] bọc overflow-y-auto và ép padding-bottom pb-2 để lộ diện hoàn toàn sound8 khi cuộn */}
                  <div className="absolute top-full left-0 w-full mt-1 border border-gray-100 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-h-[185px] overflow-y-auto p-1.5 pb-2.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                    {soundList.map((sound) => {
                      const isSelected = selectedSound.id === sound.id;
                      const isSoundPlaying = playingId === sound.id;
                      return (
                        <div
                          key={sound.id}
                          onClick={() => {
                            setSelectedSound(sound);
                            setShowSoundDropdown(false);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-[#F4F7FF] text-[#0029FF]" : "hover:bg-slate-50 text-slate-700"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Nút Play/Pause */}
                            <button
                              onClick={(e) => handlePlayPreview(e, sound)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${isSoundPlaying ? "bg-[#0029FF] text-white" : "bg-white text-slate-400 hover:text-slate-800 border border-gray-200 shadow-sm"}`}
                            >
                              {isSoundPlaying ? <Pause size={11} fill="currentColor" /> : <Play size={11} className="ml-0.5" fill="currentColor" />}
                            </button>
                            <span className={`text-[15px] truncate ${isSelected ? "font-semibold" : "font-medium"}`}>{sound.name}</span>
                          </div>
                          
                          {isSelected && <Check size={15} className="text-[#0029FF] shrink-0 font-bold" />}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default NotiSet;