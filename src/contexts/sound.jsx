import React, { createContext, useContext, useCallback, useState } from 'react';

const SoundContext = createContext(null);

// Export Sound để dùng
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
  // Trạng thái bật tắt thông báo lưu trong localStorage
  const [isGlobalMuted, setIsGlobalMuted] = useState(() => {
    const muteUntil = localStorage.getItem("mute_until");
    return muteUntil && Date.now() < parseInt(muteUntil);
  });

  // Hàm phát âm thanh tin nhắn
  const playMessageSound = useCallback(() => {
    //Kiểm tra xem có đang bị tắt âm thanh không
    const muteUntil = localStorage.getItem("mute_until");
    if (muteUntil && Date.now() < parseInt(muteUntil)) {
      console.log("Đang tắt thông báo");
      return; 
    }

    // Hết thời gian bật lại thông báo
    if (isGlobalMuted) setIsGlobalMuted(false);


    try {
      // Đọc link nhạc từ LocalStorage, nếu không có thì dùng mặc định Messenger - QuickSounds.com.mp3
      const currentSound = localStorage.getItem("app_notification_sound") || '/sounds/Messenger - QuickSounds.com.mp3';
      
      const audio = new Audio(currentSound);
      audio.volume = 0.5; 
      
      audio.play().catch(e => console.warn("Trình duyệt chặn âm thanh:", e));
    } catch (error) {
      console.error("Lỗi hệ thống âm thanh:", error);
    }
  }, [isGlobalMuted]);

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