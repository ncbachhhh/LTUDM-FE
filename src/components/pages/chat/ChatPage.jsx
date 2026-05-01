import React, { useState } from "react";
import ChatList from "./components/chat-list/ChatList.jsx";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import InfoPanel from "./components/info-panel/InfoPanel.jsx";
import ChatWelcomeScreen from "./components/chat-window/ChatWelcomeScreen.jsx";
import { contacts } from "../../../helpers/chatData.js";

const ChatPage = () => {
  // Mặc định là null để hiện màn hình chào
  const [currentConvo, setCurrentConvo] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(true);

  // Hàm xử lý khi click vào 1 người trong danh sách
  const handleSelectContact = (id) => {
    // Tìm trong people hoặc groups xem ai trùng ID
    const found =
      contacts.people.find((p) => p.id === id) ||
      contacts.groups.find((g) => g.id === id);

    if (found) setCurrentConvo(found); // Cập nhật người đang chat
  };

  const [currentEmoji, setCurrentEmoji] = useState('👍');

  return (
    <div className="flex h-full w-full bg-[#E8EEFB] p-6 gap-6 overflow-hidden">
      {/* DANH SÁCH CHAT (Luôn hiện) */}
      <div className="h-full w-[320px] shrink-0">
        <ChatList onSelect={handleSelectContact} />
      </div>

      {/* KHỐI CHÍNH (Chào mừng HOẶC Cửa sổ Chat) */}
      <div className="h-full flex-1    ">
        {!currentConvo ? (
          <div className="h-full rounded-2xl ">
            <ChatWelcomeScreen />
          </div>
        ) : (
          <div className="flex h-full gap-6">
            <div className="flex-1 h-full">
              {/*Truyền DỮ LIỆU ĐỘNG xuống ChatWindow */}
              <ChatWindow
                data={currentConvo}
                isInfoOpen={isInfoOpen}
                setIsInfoOpen={setIsInfoOpen}
                currentEmoji={currentEmoji} 
              />
            </div>

            {/* THÔNG TIN CHI TIẾT (Chỉ hiện khi ĐÃ CHỌN CHAT và isInfoOpen = true) */}
            {isInfoOpen && (
              <div className="h-full w-[340px] shrink-0 animate-fade-in">

                <InfoPanel data={currentConvo} 
                onEmojiChange={(newEmoji) => setCurrentEmoji(newEmoji)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
