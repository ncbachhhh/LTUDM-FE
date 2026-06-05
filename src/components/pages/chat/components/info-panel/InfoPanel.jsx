import { useCallback, useEffect, useState } from "react";
import { Button, Spin, Tooltip, Typography, Modal } from "antd";
import { FaBell, FaBellSlash, FaSearch, FaUsers, FaUserPlus, FaEllipsisV } from "react-icons/fa";
import StatCard from "./StatCard.jsx";
import MuteNotificationModal from "./modals/MuteNotificationModal.jsx";
import SearchChat from "./modals/SearchChat.jsx";
import FileManager from "./modals/FileManager.jsx";
import EditNicknameModal from "./modals/EditNickname.jsx";
import ChangeEmojiModal from "./modals/ChangeEmoji.jsx";
import ConversationAPI from "../../../../../apis/conversation.api.jsx";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";
import { Image, ChevronRight, ArrowRight, UserPlus, Users, Search, Bell, BellOff } from 'lucide-react';
import { useSound } from "../../../../../contexts/sound.jsx";
import CreateGroupModule from "../chat-list/CreateGroupModule.jsx";
import AddMemberModule from "./AddMemberModule.jsx";

const { Title, Text } = Typography;

const normalizeSetting = (value = "") =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const isNicknameSetting = (setting) => normalizeSetting(setting).includes("biet danh");
const isEmojiSetting = (setting) => normalizeSetting(setting).includes("cam xuc");

export default function InfoPanel({ data, onEmojiChange, onConversationUpdated, contacts, onCreateGroup }) {
  const [conversationInfo, setConversationInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("default");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  
  // State điều khiển menu 3 chấm
  const [activeMemberMenu, setActiveMemberMenu] = useState(null);
  // State đóng/mở danh sách thành viên inline
  const [isMembersExpanded, setIsMembersExpanded] = useState(false);
  
  const { isGlobalMuted, muteSound, unmuteSound } = useSound();

  const conversationId = data?.conversation_id || data?.conversationId || data?.id;
  
  // --- CHÚ Ý --- 
  // Bạn cần lấy ID của user đang đăng nhập hiện tại gán vào biến này để logic phân quyền chạy đúng
  const currentUserId = data?.currentUserId || data?.current_user_id || "ID_CUA_BAN_O_DAY"; 

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

  const info = conversationInfo || data || {};
  const displayName = info.display_name || info.displayName || info.title || info.name || "Hội thoại";
  const avatarUrl = info.avatar_url || info.avatarUrl || info.avatar || DEFAULT_AVATAR;
  const status = info.status || (info.type === "GROUP" ? "Nhóm chat" : "");
  const settings = info.settings || data?.settings || [];
  const members = info.members || data?.members || [];
  
  const isGroup = info.type === "GROUP";

  const handleNotificationClick = () => {
    if (isGlobalMuted) {
      unmuteSound(); 
    } 
    else {
      setIsMuteModalOpen(true); 
    }
  };

  if (currentView === "search") {
    return <SearchChat onClose={() => setCurrentView("default")} />;
  }

  if (currentView === "file-manager") {
    return <FileManager onClose={() => setCurrentView("default")} />;
  }

  return (
    <div className="flex h-full flex-col w-full">
      <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Khối 1: Ảnh đại diện và tên */}
        <div className="flex w-full flex-col items-center bg-white p-5 text-center rounded-t-2xl">
          <div className="relative mb-4">
            <img
              src={avatarUrl}
              className="h-22 w-22 rounded-full border-4 border-white object-cover shadow-sm"
              alt={displayName}
            />
            {info.type !== "GROUP" && (
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[4px] border-white bg-emerald-400" />
            )}
          </div>

          <Title level={5} className="!mb-0 !text-lg !font-black">{displayName}</Title>
          <Text type="secondary" className="text-[12px] font-bold">
            {loadingInfo ? <Spin size="small" /> : status}
          </Text>
        </div>

        {/* Khối 2: Các hành động nhanh */}
        <div className="flex w-full items-center justify-center bg-white px-5 py-4">
          <div className="grid w-full gap-3 grid-cols-3">
            <ActionBtn 
              label={isGroup ? "Thêm bạn" : "Lập nhóm"}
              onClick={() => {
                if (isGroup) {
                    setIsAddMemberModalOpen(true);
                } else {
                    setIsCreateGroupModalOpen(true); 
                }
              }}
            >
              {isGroup ? <UserPlus className="h-[18px] w-[18px] text-gray-700" /> : <Users className="h-[18px] w-[18px] text-gray-700" />}
            </ActionBtn>

            <Tooltip title={isGlobalMuted ? "Bật thông báo" : "Tắt thông báo"} placement="bottom">
              <ActionBtn
                label="Thông báo"
                onClick={handleNotificationClick}
              >
                {isGlobalMuted ? <BellOff className="h-[18px] w-[18px] text-gray-700" /> : <Bell className="h-[18px] w-[18px] text-gray-700" />}
              </ActionBtn>
            </Tooltip>

            <ActionBtn label="Tìm kiếm" onClick={() => setCurrentView("search")}>
              <Search className="h-[18px] w-[18px] text-gray-700" />
            </ActionBtn>
          </div>
        </div>

        {/* Khối 3: ẢNH, FILE, LINK */}
        <div className="w-full bg-white p-5">
          <div 
            className="flex items-center justify-between cursor-pointer group mb-3"
            onClick={() => setCurrentView("file-manager")}
          >
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-600" />
              <h4 className="text-[15px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Ảnh, file, link
              </h4>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <img 
                key={item}
                src={`https://picsum.photos/seed/${item}/100/100`} 
                alt="Ảnh preview" 
                className="w-[70px] h-[70px] rounded-xl object-cover border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
            <button 
              onClick={() => setCurrentView("file-manager")}
              className="w-[70px] h-[70px] rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowRight className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        </div>

        {/* Khối 4: Cài đặt hội thoại */}
        <div className="flex w-full flex-1 flex-col gap-2 bg-white p-5 rounded-b-2xl">
          <Title level={5} className="!mb-2 !text-[13px] !font-black uppercase tracking-wide text-gray-500">
            Cài đặt
          </Title>
          {settings.map((setting) => (
            <button
              key={setting}
              type="button"
              onClick={() => {
                if (isNicknameSetting(setting)) setIsNicknameModalOpen(true);
                else if (isEmojiSetting(setting)) setIsEmojiModalOpen(true);
              }}
              className="cursor-pointer rounded-xl bg-[#f1f2f4] py-3.5 px-4 text-left text-[14px] font-semibold text-slate-700 hover:bg-[#E5F1FF] transition-colors"
            >
              {setting}
            </button>
          ))}

          {/* Phần Thành viên dạng sổ xuống (Accordion) */}
          {isGroup && (
            <>
              <Title level={5} className="!mt-2 !mb-1 !text-[13px] !font-black uppercase tracking-wide text-gray-500">
                Thành viên nhóm
              </Title>
              <button
                type="button"
                onClick={() => setIsMembersExpanded(!isMembersExpanded)}
                className="flex items-center justify-between cursor-pointer rounded-xl bg-[#f1f2f4] py-3.5 px-4 text-left text-[14px] font-semibold text-slate-700 hover:bg-[#E5f1ff] transition-colors"
              >
                <span>Thành viên nhóm ({members?.length || 0})</span>
                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMembersExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Danh sách sổ ra - ĐÃ ĐƯỢC CHÈN LOGIC MỚI VÀO ĐÂY */}
              {isMembersExpanded && (
  <div className="flex flex-col gap-1 mt-2 px-1 py-1">
    {members.map((member, index) => {
      const memberId = member.id || member.user_id || index;
      const creatorId = info.creatorId || info.creator_id || data.creatorId;
      
      // --- LOGIC PHÂN QUYỀN CHUẨN ĐÉT ---
      const isCreator = creatorId === memberId;   // Người này có phải chủ nhóm không
      const isMe = currentUserId === memberId;     // Người này có phải là BẠN không
      const amIAdmin = creatorId === currentUserId; // BẠN có phải là chủ nhóm không

      // Nút 3 chấm chỉ hiện: Nếu bạn là Admin (thấy hết) HOẶC đây chính là bạn (chỉ thấy của mình)
      const showThreeDots = amIAdmin || isMe;

      return (
        <div 
          key={memberId} 
          className="group relative flex items-center justify-between p-2 hover:bg-[#f1f2f4] rounded-xl transition-colors cursor-pointer"
        >
          {/* --- CỘT TRÁI: AVATAR & TÊN --- */}
          <div className="flex items-center gap-3 select-none">
            <img 
              src={member.avatar_url || member.avatarUrl || member.avatar || DEFAULT_AVATAR} 
              alt="avatar" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-gray-800">
                {member.display_name || member.displayName || member.nickname || member.name || "Thành viên"} 
                {isMe && " (Bạn)"}
              </span>
              {isCreator && (
                <span className="text-[11px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded w-max mt-0.5">
                  Trưởng nhóm
                </span>
              )}
            </div>
          </div>

          {/* --- CỘT PHẢI: NÚT 3 CHẤM (REACT ICON) --- */}
          {showThreeDots && (
            <div className="relative">
              {/* Nút 3 chấm bằng FaEllipsisV */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMemberMenu(activeMemberMenu === memberId ? null : memberId);
                }}
                className={`p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-all
                  ${activeMemberMenu === memberId ? 'opacity-100 bg-gray-200' : 'opacity-0 group-hover:opacity-100'}
                `}
              >
                <FaEllipsisV className="h-4 w-4" /> {/* 👈 Nút 3 chấm của bạn đây rồi nhé! */}
              </button>

              {/* Menu Dropdown hiển thị theo logic phân quyền */}
              {activeMemberMenu === memberId && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 py-1 z-50 overflow-hidden">
                  
                  {/* RULE 1: Bạn là trưởng nhóm đi xử lý người khác -> Xóa khỏi nhóm */}
                  {amIAdmin && !isMe && (
                    <button
                      className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 font-bold transition-colors"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveMemberMenu(null);
                        console.log("Xóa thành viên khỏi nhóm:", memberId);
                      }}
                    >
                      Xóa khỏi nhóm
                    </button>
                  )}

                  {/* RULE 2: Thao tác trên chính mình -> Rời nhóm */}
                  {isMe && (
                    <button
                      className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 font-bold transition-colors"
                      onClick={(e) => { 
                        e.stopPropagation();
                        setActiveMemberMenu(null);
                        console.log("Rời nhóm");
                      }}
                    >
                      Rời nhóm
                    </button>
                  )}

                  {/* RULE 3: Bạn vừa là trưởng nhóm mà lại thao tác trên chính mình -> Có thêm nút Xóa nhóm */}
                  {amIAdmin && isMe && (
                    <button
                      className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 font-bold transition-colors border-t border-gray-100"
                      onClick={(e) => { 
                        e.stopPropagation();
                        setActiveMemberMenu(null);
                        console.log("Xóa toàn bộ nhóm");
                      }}
                    >
                      Xóa nhóm
                    </button>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      );
                  })}
                </div>
              )}

              {/* Nút Rời nhóm nằm ngoài danh sách sổ xuống */}
              <button
                type="button"
                onClick={() => {
                    // Logic rời nhóm tại đây
                    console.log("Đã chọn rời nhóm");
                }}
                className="flex items-center gap-2 mt-2 px-4 py-3 text-[14px] font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Rời nhóm
              </button>
            </>
          )}

        </div>
        
      </div>

      {/* Modals */}
      <MuteNotificationModal
        isOpen={isMuteModalOpen}
        onClose={() => setIsMuteModalOpen(false)}
        onConfirm={(optionId) => {
           muteSound(optionId);
        }}
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
      <Modal
        open={isCreateGroupModalOpen}
        onCancel={() => setIsCreateGroupModalOpen(false)}
        footer={null}
        centered
        destroyOnHidden
        width={500}
        styles={{ body: { padding: 0 }, content: { padding: 0, borderRadius: 24, overflow: "hidden" } }}
        closeIcon={null}
      >
        <CreateGroupModule
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
          onCreate={onCreateGroup}
          contacts={contacts}
          title="Lập nhóm"
          initialSelectedMembers={[{
            id: info?.target_user_id || info?.userId || conversationId,
            name: displayName,
            avatar: avatarUrl
          }]}
        />
      </Modal>
      <Modal
        open={isAddMemberModalOpen}
        onCancel={() => setIsAddMemberModalOpen(false)}
        footer={null}
        centered
        destroyOnHidden
        width={500}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, borderRadius: 24, overflow: "hidden" }
        }}
        closeIcon={null}
      >
        <AddMemberModule 
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          contacts={contacts}
          existingMembers={members}
          currentGroupName={displayName}
          currentGroupAvatar={avatarUrl}
          onConfirm={async (newMemberIds) => {
              return { isSuccess: true };
          }}
        />
      </Modal>
    </div>
  );
}

// Nút nhỏ gọn lại, thu hẹp padding dọc (py) và chỉnh text nhỏ hơn 1 chút
function ActionBtn({ label, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-[#f1f2f4] hover:bg-[#e5f1ff] py-2.5 px-1 text-gray-700 shadow-sm transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
      <span className="flex items-center justify-center text-center text-[11px] font-bold text-gray-600 w-full">
        {label}
      </span>
    </button>
  );
}