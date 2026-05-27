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
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto pr-2">
      {/* Ảnh đại diện và tên */}
      <div className="flex w-full flex-col items-center bg-white p-3 text-center">
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
      <div className="flex w-full items-center justify-center bg-white p-3">
        <div className="grid w-full grid-cols-3 gap-2">
          <ActionBtn label="Tạo nhóm">
            <FaUsers className="h-4 w-4" />
          </ActionBtn>

          <Tooltip title={isMuted ? "Bật thông báo" : "Tắt thông báo"} placement="bottom">
            <ActionBtn
              label={isMuted ? "Bật thông báo" : "Tắt thông báo"}
              onClick={handleNotificationClick}
            >
              {isMuted ? <FaBellSlash className="h-4 w-4" /> : <FaBell className="h-4 w-4" />}
            </ActionBtn>
          </Tooltip>

          <ActionBtn label="Tìm kiếm" onClick={() => setCurrentView("search")}>
            <FaSearch className="h-4 w-4" />
          </ActionBtn>
        </div>
      </div>

      {/* Thống kê hội thoại */}
      <div className="w-full bg-white p-4">
        <Title level={5} className="!mb-3 !text-sm !font-black uppercase tracking-wide">Thống kê</Title>
        <div className="grid grid-cols-2 gap-1">
          {stats.map((stat) => (
            <StatCard
              key={stat.id || stat.label}
              label={stat.label}
              value={stat.value}
              subValue={stat.subValue}
            />
          ))}
        </div>

        <Button
          type="text"
          onClick={() => setCurrentView("file-manager")}
          className="mt-2 w-full !rounded-2xl !bg-[#0033FF]/5 !text-[11px] !font-black uppercase tracking-widest !text-slate-500"
        >
          Xem tất cả
        </Button>
      </div>

      {/* Cài đặt hội thoại */}
      <div className="flex w-full flex-col gap-2 bg-white p-4">
        <Title level={5} className="!mb-1 !text-sm !font-black uppercase tracking-wide">Cài đặt</Title>
        {settings.map((setting) => (
          <button
            key={setting}
            type="button"
            onClick={() => {
              if (isNicknameSetting(setting)) setIsNicknameModalOpen(true);
              else if (isEmojiSetting(setting)) setIsEmojiModalOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-[#F6F8FF] py-2 px-1 text-left text-[11px] font-bold text-slate-700 hover:bg-[#EEF2FF] transition-colors"
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
