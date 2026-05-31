import { useCallback, useEffect, useState } from "react";
import { Button, Spin, Tooltip, Typography } from "antd";
import { FaBell, FaBellSlash, FaSearch, FaUsers } from "react-icons/fa";
import StatCard from "./StatCard.jsx";
import MuteNotificationModal from "./modals/MuteNotificationModal.jsx";
import SearchChat from "./modals/SearchChat.jsx";
import FileManager from "./modals/FileManager.jsx";
import EditNicknameModal from "./modals/EditNickname.jsx";
import ChangeEmojiModal from "./modals/ChangeEmoji.jsx";
import ConversationAPI from "../../../../../apis/conversation.api.jsx";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";
import { Image, ChevronRight, ArrowRight } from 'lucide-react';

const { Title, Text } = Typography;

// Normalize chuỗi có dấu về không dấu để so sánh
const normalizeSetting = (value = "") =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const isNicknameSetting = (setting) => normalizeSetting(setting).includes("biet danh");
const isEmojiSetting = (setting) => normalizeSetting(setting).includes("cam xuc");

export default function InfoPanel({ data, onEmojiChange, onConversationUpdated }) {
  const [conversationInfo, setConversationInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("default");

  const conversationId = data?.conversation_id || data?.conversationId || data?.id;

  const loadConversationInfo = useCallback(async () => {
    if (!conversationId) return;

    setLoadingInfo(true);
    const result = await ConversationAPI.getConversationInfo(conversationId);
    setLoadingInfo(false);

    if (result.isSuccess) setConversationInfo(result.data);
  }, [conversationId]);

  const handleNicknameUpdated = (updatedConversation) => {
    if (updatedConversation) onConversationUpdated?.(updatedConversation);
    loadConversationInfo();
  };

  useEffect(() => {
    const timerId = window.setTimeout(loadConversationInfo, 0);
    return () => window.clearTimeout(timerId);
  }, [loadConversationInfo]);

  // Gộp dữ liệu từ API và từ props (fallback)
  const info = conversationInfo || data || {};
  const displayName = info.display_name || info.displayName || info.title || info.name || "Hội thoại";
  const avatarUrl = info.avatar_url || info.avatarUrl || info.avatar || DEFAULT_AVATAR;
  const status = info.status || (info.type === "GROUP" ? "Nhóm chat" : "");
  const stats = info.stats || data?.stats || [];
  const settings = info.settings || data?.settings || [];
  const members = info.members || data?.members || [];

  const handleNotificationClick = () => {
    if (isMuted) setIsMuted(false);
    else setIsMuteModalOpen(true);
  };

  // Hiện trang tìm kiếm trong hội thoại
  if (currentView === "search") {
    return <SearchChat onClose={() => setCurrentView("default")} />;
  }

  // Hiện trang quản lý file/ảnh
  if (currentView === "file-manager") {
    return <FileManager onClose={() => setCurrentView("default")} />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto pr-2 ">
      {/* Ảnh đại diện và tên */}
      <div className="flex w-full flex-col items-center bg-white p-5 text-center rounded-t-2xl">
        <div className="relative mb-4">
          <img
            src={avatarUrl}
            className="h-22 w-22 rounded-full border-4 border-white object-cover"
            alt={displayName}
          />
          {/* Chấm online chỉ hiện với hội thoại cá nhân */}
          {info.type !== "GROUP" && (
            <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[4px] border-white bg-emerald-400" />
          )}
        </div>

        <Title level={5} className="!mb-0 !text-lg !font-black">{displayName}</Title>
        <Text type="secondary" className="text-[12px] font-bold">
          {loadingInfo ? <Spin size="small" /> : status}
        </Text>
      </div>

      {/* Các hành động nhanh */}
      <div className="flex w-full items-center justify-center bg-white p-6">
        <div className="grid w-full grid-cols-3 gap-2">
          <ActionBtn label="Tạo nhóm">
            <FaUsers className="h-6 w-6" />
          </ActionBtn>

          <Tooltip title={isMuted ? "Bật thông báo" : "Tắt thông báo"} placement="bottom">
            <ActionBtn
              label={isMuted ? "Bật thông báo" : "Tắt thông báo"}
              onClick={handleNotificationClick}
            >
              {isMuted ? <FaBellSlash className="h-6 w-6" /> : <FaBell className="h-4 w-4" />}
            </ActionBtn>
          </Tooltip>

          <ActionBtn label="Tìm kiếm" onClick={() => setCurrentView("search")}>
            <FaSearch className="h-6 w-6" />
          </ActionBtn>
        </div>
      </div>

{/*  ẢNH, FILE, LINK   */}
      <div className="w-full bg-white p-6">
        
        {/* Mở File Manager */}
        <div 
          className="flex items-center justify-between cursor-pointer group mb-3"
          onClick={() => setCurrentView("file-manager")}
        >
          <div className="flex items-center gap-2">
            
            {/* Icon Ảnh/Thư mục  */}
            <Image className="w-6 h-6 text-gray-600" />
            
            <h4 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              Ảnh, file, link
            </h4>
          </div>
          
          {/* Icon Xem thêm */}
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          
        </div>

        {/* Danh sách hiển thị trước */}
        <div className="flex items-center gap-2 overflow-hidden">
          
          {/* Ảnh ảo */}
          {[1, 2, 3].map((item) => (
            <img 
              key={item}
              src={`https://picsum.photos/seed/${item}/100/100`} 
              alt="Ảnh preview" 
              className="w-16 h-16 rounded-xl object-cover border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}

          {/* Xem thêm */}
          <button 
            onClick={() => setCurrentView("file-manager")}
            className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
          >
            {/*Icon Mũi tên phải */}
            <ArrowRight className="w-6 h-6 text-blue-500" />
          </button>

        </div>
      </div>

      {/* Cài đặt hội thoại */}
      <div className="flex w-full flex-col gap-2 bg-white p-5 rounded-b-2xl">
        <Title level={5} className="!mb-1 !text-sm !font-black uppercase tracking-wide">Cài đặt</Title>
        {settings.map((setting) => (
          <button
            key={setting}
            type="button"
            onClick={() => {
              if (isNicknameSetting(setting)) setIsNicknameModalOpen(true);
              else if (isEmojiSetting(setting)) setIsEmojiModalOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-[#F6F8FF] py-4 px-1 text-left text-[13px] font-bold text-slate-700 hover:bg-[#EEF2FF] transition-colors"
          >
            {setting}
          </button>
        ))}
      </div>

      {/* Modals */}
      <MuteNotificationModal
        isOpen={isMuteModalOpen}
        onClose={() => setIsMuteModalOpen(false)}
        onConfirm={() => setIsMuted(true)}
      />

      <EditNicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        conversationId={conversationId}
        members={members}
        onUpdated={handleNicknameUpdated}
      />

      <ChangeEmojiModal
        isOpen={isEmojiModalOpen}
        onClose={() => setIsEmojiModalOpen(false)}
        onSelectEmoji={(newEmoji) => onEmojiChange?.(newEmoji)}
      />
    </div>
  );
}

// Component nút hành động nhỏ dùng lại trong lưới 3 cột
function ActionBtn({ label, children, onClick }) {
  return (
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
