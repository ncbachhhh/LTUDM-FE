import StatCard from "./StatCard.jsx";
import { activeConversation } from "../../../../../helpers/chatData.js";
import { useState } from 'react';
import MuteNotificationModal from "./modals/MuteNotificationModal.jsx";
import SearchChat from "./modals/SearchChat.jsx";
import FileManager from "./modals/FileManager.jsx";
import EditNicknameModal from "./modals/EditNickname.jsx";
import ChangeEmojiModal from "./modals/ChangeEmoji.jsx";

export default function InfoPanel({ onEmojiChange }) {
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState('default');

  //Set trạng thái bật/tắt khi click thông báo
  const handleNotificationClick = () => {
    if (isMuted) {
      // Nếu ĐANG TẮT  
      setIsMuted(false);
    } else {
      // Nếu ĐANG BẬT 
      setIsMuteModalOpen(true);
    }
  }; 

  if (currentView === 'search') {
    return (
        <SearchChat onClose={() => setCurrentView('default')} />
    );
  }

   if (currentView === 'file-manager') {
    return (
        <FileManager onClose={() => setCurrentView('default')} />
    );
  }

  return (
    //Avt+ Tên+ Trạng thái hoạt động
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto pr-2">
      <div className="flex w-full flex-col items-center bg-white p-3 text-center">
        <div className="relative mb-4">
          <img
            src={activeConversation.avatar}
            className="h-22 w-22 rounded-full border-4 border-white object-cover"
            alt={activeConversation.name}
          />
          <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[4px] border-white bg-emerald-400" />
        </div>

        <h3 className="text-lg font-black">{activeConversation.name}</h3>
        <p className="text-[12px] font-bold text-gray-400">{activeConversation.status}</p>
      </div>

      {/*Tạo nhóm+ Tắt thông báo+ Tìm kiếm*/}
      <div className="flex w-full items-center justify-center bg-white p-3 ">
        <div className="grid w-full grid-cols-3 gap-2">
          {/*Nút tạo nhóm*/}
          <ActionBtn label="Tạo nhóm" >
            <img
              src="/icon-tao-nhom.svg"
              alt="Nút tạo nhóm"
              className="h-4 w-4"
            />
          </ActionBtn>

          {/* Nút thông báo */}
          <ActionBtn 
            label={isMuted ? "Bật thông báo" : "Tắt Thông báo"} 
            onClick={handleNotificationClick}
          >
            <img
              src={isMuted ? "/icon-chuong-gach.svg" : "/icon-chuong.svg"} 
              alt={isMuted ? "Đã tắt thông báo" : "Thông báo"}
              className="h-4 w-4"
            />
          </ActionBtn>

          {/* Nút tìm kiếm */}
          <ActionBtn label="Tìm kiếm"
          onClick={() => setCurrentView('search')}>
            <img
              src="/kinh-lup.svg"
              alt="Tìm kiếm"
              className="h-4 w-4"
            />
          </ActionBtn>
        </div>
      </div>

      <div className="w-full bg-white p-4">
        <h4 className="mb-3 text-sm font-black uppercase tracking-wide">Thống kê</h4>
        <div className="grid grid-cols-2 gap-1">
          {activeConversation.stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              subValue={stat.subValue}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('file-manager')}
          className="mt-2 w-full rounded-2xl bg-[#0033FF]/5 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500"
        >
          Xem tất cả
        </button>
      </div>

          {/*Cài đặt*/}
      <div className="flex w-full flex-col gap-2 bg-white p-4">
        <h4 className="mb-1 text-sm font-black uppercase tracking-wide">Cài đặt</h4>
        {activeConversation.settings.map((setting) => (
          <button
            key={setting}
            type="button"
            onClick={() => {
              if (setting.includes('biệt danh')) {
                setIsNicknameModalOpen(true); 
              }
              else if (setting.includes('cảm xúc')) {
                setIsEmojiModalOpen(true);
              }
            }}
            className="cursor-pointer rounded-xl bg-[#F6F8FF] py-2 px-1 text-left text-[11px] font-bold text-slate-700"
          >
            {setting}
          </button>
        ))}
      </div>
      <MuteNotificationModal 
        isOpen={isMuteModalOpen} 
        onClose={() => setIsMuteModalOpen(false)} 
        onConfirm={(duration) => {
          console.log("Đã chọn thời gian tắt:", duration);
          setIsMuted(true);
        }}
      />
      <EditNicknameModal 
        isOpen={isNicknameModalOpen} 
        onClose={() => setIsNicknameModalOpen(false)} 
      />

      <ChangeEmojiModal 
        isOpen={isEmojiModalOpen}
        onClose={() => setIsEmojiModalOpen(false)}
        onSelectEmoji={(newEmoji) => {
        console.log("Đã chọn Emoji mới:", newEmoji);
        if (onEmojiChange) {
            onEmojiChange(newEmoji); 
          }
        }}
      />
    </div>
  );
}

function ActionBtn({ label, children, onClick }) {
  return (
    //Các button tạo nhóm + tắt thông báo+ tìm kiếm
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#003EFF]/40 to-[#FFCCF2]/40 py-2 px-1 transition-all duration-300 hover:opacity-80"
    >
      <div className="mb-1">{children}</div>
      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-800">
        {label}
      </span>
    </button>
  );
}
