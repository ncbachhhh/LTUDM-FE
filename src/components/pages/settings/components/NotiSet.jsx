import { useEffect, useState } from "react";
import { Volume2, Play, Pause, ChevronDown, Check } from "lucide-react";
import { Switch, message } from "antd";
import UserAPI from "../../../../apis/user.api.jsx";
import { useAuth } from "../../../../contexts/auth.context.jsx";

const SOUND_LIST = [
  { id: "default", name: "sound1 (default)", url: "/sounds/default.mp3" },
  { id: "sound2", name: "sound2", url: "/sounds/sound2.mp3" },
  { id: "sound3", name: "sound3", url: "/sounds/sound3.mp3" },
  { id: "sound4", name: "sound4", url: "/sounds/sound4.mp3" },
  { id: "sound5", name: "sound5", url: "/sounds/sound5.mp3" },
  { id: "sound6", name: "sound6", url: "/sounds/sound6.mp3" },
  { id: "sound7", name: "sound7", url: "/sounds/sound7.mp3" },
  { id: "sound8", name: "sound8", url: "/sounds/sound8.mp3" },
];

const getInitialSound = () => {
  return SOUND_LIST[0];
};

const getUserSoundId = (user) =>
  user?.notificationSound || user?.notification_sound || getInitialSound().id;

const NotiSet = () => {
  const { user, setUser } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(
    () => user?.soundEnabled ?? user?.sound_enabled ?? true,
  );
  const [showSoundDropdown, setShowSoundDropdown] = useState(false);
  const [savingKey, setSavingKey] = useState("");
  const [selectedSoundId, setSelectedSoundId] = useState(() => getUserSoundId(user));
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const effectiveSelectedSound =
    SOUND_LIST.find((sound) => sound.id === selectedSoundId) || getInitialSound();

  const updateSetting = async (key, value, applyLocalValue) => {
    const rollback = applyLocalValue();
    setSavingKey(key);

    const response = await UserAPI.updateSettings({ [key]: value });
    setSavingKey("");

    if (!response.isSuccess) {
      rollback();
      message.error(response.message);
      return;
    }

    setUser(response.data);
  };

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

    audio.addEventListener("ended", () => {
      setPlayingId(null);
      setCurrentAudio(null);
    });
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
          <Volume2 size={18} className="text-slate-500" />
          Âm thanh thông báo
        </h2>
      </div>

      {/* ── ÂM THANH THÔNG BÁO ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-slate-800 px-1">Âm thanh thông báo</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          
          {/* Dòng bật tắt */}
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium text-slate-500">Phát âm thanh khi có tin nhắn mới</p>
            <Switch
              checked={soundEnabled}
              loading={savingKey === "sound_enabled"}
              onChange={(checked) =>
                updateSetting("sound_enabled", checked, () => {
                  const previous = soundEnabled;
                  setSoundEnabled(checked);
                  if (!checked) setShowSoundDropdown(false);
                  return () => setSoundEnabled(previous);
                })
              }
            />
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
                  <span className="text-[15px] font-semibold text-slate-700">{effectiveSelectedSound.name}</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${showSoundDropdown ? "rotate-180" : ""}`} />
              </div>

              {/* Menu danh sách nổi - Có thanh kéo lướt mượt và lướt kịch được âm số 8 */}
              {showSoundDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSoundDropdown(false)} />
                  
                  {/* Giải pháp: max-h-[180px] bọc overflow-y-auto và ép padding-bottom pb-2 để lộ diện hoàn toàn sound8 khi cuộn */}
                  <div className="absolute top-full left-0 w-full mt-1 border border-gray-100 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-h-[185px] overflow-y-auto p-1.5 pb-2.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                    {SOUND_LIST.map((sound) => {
                      const isSelected = effectiveSelectedSound.id === sound.id;
                      const isSoundPlaying = playingId === sound.id;
                      return (
                        <div
                          key={sound.id}
                          onClick={() => {
                            setShowSoundDropdown(false);
                            updateSetting("notification_sound", sound.id, () => {
                              const previous = selectedSoundId;
                              setSelectedSoundId(sound.id);
                              return () => setSelectedSoundId(previous);
                            });
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
