import React, { createContext, useContext, useCallback, useState } from 'react';
import { useAuth } from './auth.context.jsx';

const SoundContext = createContext(null);
const SOUND_URLS = {
  default: "/sounds/default.mp3",
  sound2: "/sounds/sound2.mp3",
  sound3: "/sounds/sound3.mp3",
  sound4: "/sounds/sound4.mp3",
  sound5: "/sounds/sound5.mp3",
  sound6: "/sounds/sound6.mp3",
  sound7: "/sounds/sound7.mp3",
  sound8: "/sounds/sound8.mp3",
};

// Export Sound để dùng
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
  const { user } = useAuth();
  // Trạng thái bật tắt thông báo lưu trong localStorage
  const [isGlobalMuted, setIsGlobalMuted] = useState(() => {
    const muteUntil = localStorage.getItem("mute_until");
    return muteUntil && Date.now() < parseInt(muteUntil);
  });

  // Hàm phát âm thanh tin nhắn
  const playMessageSound = useCallback(() => {
    const soundEnabled = user?.soundEnabled ?? user?.sound_enabled ?? true;

    if (!soundEnabled) {
      return;
    }

    //Kiểm tra xem có đang bị tắt âm thanh không
    const muteUntil = localStorage.getItem("mute_until");
    if (muteUntil && Date.now() < parseInt(muteUntil)) {
      console.log("Đang tắt thông báo");
      return; 
    }

    // Hết thời gian bật lại thông báo
    if (isGlobalMuted) setIsGlobalMuted(false);


    try {
      const soundId = user?.notificationSound || user?.notification_sound || "default";
      const currentSound = SOUND_URLS[soundId] || SOUND_URLS.default;
      
      const audio = new Audio(currentSound);
      audio.volume = 0.5; 
      
      audio.play().catch(e => console.warn("Trình duyệt chặn âm thanh:", e));
    } catch (error) {
      console.error("Lỗi hệ thống âm thanh:", error);
    }
  }, [isGlobalMuted, user]);

   // cài đặt thời gian tắt thông báo
    const muteSound = (optionId) => {
    let duration = 0;
    const now = Date.now();

    if (optionId === '30m') duration = 30 * 60 * 1000;
    else if (optionId === '1h') duration = 60 * 60 * 1000;
    else if (optionId === '24h') duration = 24 * 60 * 60 * 1000;
    else if (optionId === '8am') {
      const tomorrow8am = new Date();
      tomorrow8am.setDate(tomorrow8am.getDate() + 1);
      tomorrow8am.setHours(8, 0, 0, 0);
      duration = tomorrow8am.getTime() - now;
    } 
    else if (optionId === 'forever') duration = 100 * 365 * 24 * 60 * 60 * 1000; // 100 năm = Vĩnh viễn

    // Lưu mốc thời gian được phép kêu lại vào máy
    const unmuteTime = now + duration;
    localStorage.setItem("mute_until", unmuteTime);
    setIsGlobalMuted(true); 
  };

  // bật lại thông báo ngay lập tức
  const unmuteSound = () => {
    localStorage.removeItem("mute_until");
    setIsGlobalMuted(false);
  };


  return (
    // Cung cấp hàm playMessageSound cho toàn bộ App
    <SoundContext.Provider value={{ playMessageSound, isGlobalMuted, muteSound, unmuteSound }}>
      {children}
    </SoundContext.Provider>
  );
}
