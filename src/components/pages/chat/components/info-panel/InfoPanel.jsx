import { useCallback, useEffect, useState } from "react";
import { Button, Spin, Tooltip, Typography, Modal } from "antd";
import { FaEllipsisV } from "react-icons/fa";
import StatCard from "./StatCard.jsx";
import SearchChat from "./modals/SearchChat.jsx";
import FileManager from "./modals/FileManager.jsx";
import EditNicknameModal from "./modals/EditNickname.jsx";
import EditGroupNameModal from "./modals/EditGroupName.jsx";
import ChangeEmojiModal from "./modals/ChangeEmoji.jsx";
import MuteNotificationModal from "./modals/MuteNotificationModal.jsx";
import ConversationAPI from "../../../../../apis/conversation.api.jsx";
import MessageAPI from "../../../../../apis/message.api.jsx";
import { DEFAULT_AVATAR, DEFAULT_GROUP_AVATAR } from "../../../../../constants/asset.constants.js";
import { Image, ChevronRight, ArrowRight, UserPlus, Users, Search, Pencil, Bell, BellOff } from 'lucide-react';
import CreateGroupModule from "../chat-list/CreateGroupModule.jsx";
import AddMemberModule from "./AddMemberModule.jsx";
import { getAvatarUrl, getDisplayName, getMemberId } from "../../../../../utils/identity.util.js";
import { useNotification } from "../../../../../contexts/notification.context.jsx";

const { Title, Text } = Typography;

const normalizeSetting = (value = "") =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const isNicknameSetting = (setting) => normalizeSetting(setting).includes("biet danh");
const isEmojiSetting = (setting) => normalizeSetting(setting).includes("cam xuc");

const toLocalDateTimeString = (date) => {
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const getMutedUntilFromOption = (option) => {
  const now = new Date();
  const mutedUntil = new Date(now);

  if (option === "30m") mutedUntil.setMinutes(mutedUntil.getMinutes() + 30);
  else if (option === "1h") mutedUntil.setHours(mutedUntil.getHours() + 1);
  else if (option === "24h") mutedUntil.setHours(mutedUntil.getHours() + 24);
  else if (option === "8am") {
    mutedUntil.setDate(mutedUntil.getDate() + 1);
    mutedUntil.setHours(8, 0, 0, 0);
  } else if (option === "forever") mutedUntil.setFullYear(mutedUntil.getFullYear() + 100);

  return toLocalDateTimeString(mutedUntil);
};

export default function InfoPanel({
  data,
  currentUserId,
  onEmojiChange,
  onConversationUpdated,
  onConversationRemoved,
  contacts,
  onCreateGroup,
}) {
  const [conversationInfo, setConversationInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isGroupNameModalOpen, setIsGroupNameModalOpen] = useState(false);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
  const [updatingMute, setUpdatingMute] = useState(false);
  const [currentView, setCurrentView] = useState("default");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [imagePreviewMessages, setImagePreviewMessages] = useState([]);
  
  // State điều khiển menu 3 chấm
  const [activeMemberMenu, setActiveMemberMenu] = useState(null);
  // State đóng/mở danh sách thành viên inline
  const [isMembersExpanded, setIsMembersExpanded] = useState(false);
  
  const { api } = useNotification();

  const conversationId = data?.conversation_id || data?.conversationId || data?.id;
  
  const resolvedCurrentUserId = currentUserId || data?.currentUserId || data?.current_user_id;

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

  const handleGroupNameUpdated = (updatedConversation) => {
    if (updatedConversation) onConversationUpdated?.(updatedConversation);
    loadConversationInfo();
    api.success({
      message: "Đã đổi tên nhóm",
      placement: "topRight",
    });
  };

  const handleAddMembers = async (newMemberIds) => {
    if (!conversationId || !newMemberIds?.length) {
      return { isSuccess: false };
    }

    const result = await ConversationAPI.addMembers(conversationId, newMemberIds);
    if (!result.isSuccess) {
      api.error({
        message: "Thêm thành viên thất bại",
        description: result.message,
        placement: "topRight",
      });
      return result;
    }

    if (result.data) onConversationUpdated?.(result.data);
    await loadConversationInfo();
    api.success({
      message: "Đã thêm thành viên",
      description: "Danh sách thành viên nhóm đã được cập nhật.",
      placement: "topRight",
    });

    return result;
  };

  const applyGroupUpdate = async (result, successMessage) => {
    if (!result.isSuccess) {
      api.error({
        message: "Thao tác thất bại",
        description: result.message,
        placement: "topRight",
      });
      return result;
    }

    if (result.data) onConversationUpdated?.(result.data);
    await loadConversationInfo();
    api.success({
      message: successMessage,
      placement: "topRight",
    });

    return result;
  };

  const handleMuteConversation = async (option) => {
    if (!conversationId || updatingMute) return;

    setUpdatingMute(true);
    const result = await ConversationAPI.muteConversation(
      conversationId,
      getMutedUntilFromOption(option)
    );
    setUpdatingMute(false);

    if (!result.isSuccess) {
      api.error({
        message: "Tắt thông báo thất bại",
        description: result.message,
        placement: "topRight",
      });
      return;
    }

    if (result.data) onConversationUpdated?.(result.data);
    await loadConversationInfo();
    api.success({
      message: "Đã tắt thông báo",
      placement: "topRight",
    });
  };

  const handleUnmuteConversation = async () => {
    if (!conversationId || updatingMute) return;

    setUpdatingMute(true);
    const result = await ConversationAPI.unmuteConversation(conversationId);
    setUpdatingMute(false);

    if (!result.isSuccess) {
      api.error({
        message: "Bật thông báo thất bại",
        description: result.message,
        placement: "topRight",
      });
      return;
    }

    if (result.data) onConversationUpdated?.(result.data);
    await loadConversationInfo();
    api.success({
      message: "Đã bật thông báo",
      placement: "topRight",
    });
  };

  const handleRemoveMember = (memberId, memberName) => {
    Modal.confirm({
      title: "Xóa thành viên khỏi nhóm?",
      content: `Bạn có chắc muốn xóa ${memberName || "thành viên này"} khỏi nhóm?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        setActiveMemberMenu(null);
        const result = await ConversationAPI.removeMember(conversationId, memberId);
        await applyGroupUpdate(result, "Đã xóa thành viên khỏi nhóm");
      },
    });
  };

  const handleTransferOwner = (memberId, memberName) => {
    Modal.confirm({
      title: "Chuyển trưởng nhóm?",
      content: `${memberName || "Thành viên này"} sẽ trở thành trưởng nhóm mới. Bạn sẽ không còn quyền quản lý nhóm.`,
      okText: "Chuyển",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        setActiveMemberMenu(null);
        const result = await ConversationAPI.transferOwner(conversationId, memberId);
        await applyGroupUpdate(result, "Đã chuyển trưởng nhóm");
      },
    });
  };

  const handleLeaveGroup = () => {
    Modal.confirm({
      title: "Rời nhóm?",
      content: amIGroupOwner
        ? "Bạn đang là trưởng nhóm. Khi rời nhóm, hệ thống sẽ tự chuyển trưởng nhóm cho một thành viên khác."
        : "Bạn sẽ không còn thấy nhóm này trong danh sách chat.",
      okText: "Rời nhóm",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        const result = await ConversationAPI.leaveGroup(conversationId);
        if (!result.isSuccess) {
          api.error({
            message: "Rời nhóm thất bại",
            description: result.message,
            placement: "topRight",
          });
          return;
        }
        onConversationRemoved?.(conversationId);
        api.success({
          message: "Đã rời nhóm",
          placement: "topRight",
        });
      },
    });
  };

  const handleDeleteGroup = () => {
    Modal.confirm({
      title: "Giải tán nhóm?",
      content: "Toàn bộ nhóm và dữ liệu hội thoại nhóm sẽ bị xóa. Thao tác này không thể hoàn tác.",
      okText: "Giải tán",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        const result = await ConversationAPI.deleteConversation(conversationId);
        if (!result.isSuccess) {
          api.error({
            message: "Giải tán nhóm thất bại",
            description: result.message,
            placement: "topRight",
          });
          return;
        }
        onConversationRemoved?.(conversationId);
        api.success({
          message: "Đã giải tán nhóm",
          placement: "topRight",
        });
      },
    });
  };

  useEffect(() => {
    const timerId = window.setTimeout(loadConversationInfo, 0);
    return () => window.clearTimeout(timerId);
  }, [loadConversationInfo]);

  useEffect(() => {
    if (!conversationId) return undefined;

    const handleConversationChanged = (event) => {
      const changedConversationId =
        event.detail?.conversation_id ||
        event.detail?.conversationId ||
        event.detail?.conversation?.id ||
        event.detail?.id;

      if (String(changedConversationId) === String(conversationId)) {
        loadConversationInfo();
      }
    };

    window.addEventListener("conversation:changed", handleConversationChanged);
    return () => window.removeEventListener("conversation:changed", handleConversationChanged);
  }, [conversationId, loadConversationInfo]);

  useEffect(() => {
    if (!conversationId) return undefined;

    let cancelled = false;
    const timerId = window.setTimeout(async () => {
      const result = await MessageAPI.getConversationImagePreview(conversationId, 3);
      if (!cancelled && result.isSuccess) {
        setImagePreviewMessages(result.data || []);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [conversationId]);

  const info = conversationInfo || data || {};
  const displayName = info.display_name || info.displayName || info.title || info.name || "Hội thoại";
  const isGroup = info.type === "GROUP";
  const avatarUrl = info.avatar_url || info.avatarUrl || info.avatar || (isGroup ? DEFAULT_GROUP_AVATAR : DEFAULT_AVATAR);
  const status = info.status || (info.type === "GROUP" ? "Nhóm chat" : "");
  const settings = info.settings || data?.settings || [];
  const members = info.members || data?.members || [];
  const mutedUntil = info.muted_until || info.mutedUntil || data?.muted_until || data?.mutedUntil || null;
  const isMuted = mutedUntil ? new Date(mutedUntil).getTime() > Date.now() : false;
  
  const ownerMember = members.find((member) => member.role === "OWNER");
  const ownerId = getMemberId(ownerMember) || info.createdBy || info.created_by || data?.createdBy || data?.created_by;
  const amIGroupOwner = Boolean(ownerId && String(ownerId) === String(resolvedCurrentUserId));

  const resolveDirectChatMember = () => {
    if (isGroup) return null;

    const explicitUserId =
      data?.userId ||
      data?.user_id ||
      info?.targetUserId ||
      info?.target_user_id ||
      info?.userId ||
      info?.user_id;

    if (
      explicitUserId &&
      String(explicitUserId) !== String(conversationId) &&
      String(explicitUserId) !== String(resolvedCurrentUserId)
    ) {
      return {
        id: explicitUserId,
        userId: explicitUserId,
        user_id: explicitUserId,
        name: displayName,
        avatar: avatarUrl,
      };
    }

    const memberSources = [...(info.members || []), ...(data?.members || [])];
    const otherMember = memberSources.find((member) => {
      const memberId = getMemberId(member);
      return memberId && String(memberId) !== String(resolvedCurrentUserId);
    });
    const otherMemberId = getMemberId(otherMember);

    if (!otherMemberId) return null;

    return {
      ...otherMember,
      id: otherMemberId,
      userId: otherMemberId,
      user_id: otherMemberId,
      name: getDisplayName(otherMember, displayName),
      avatar: getAvatarUrl(otherMember, avatarUrl),
    };
  };

  const directChatMember = resolveDirectChatMember();

  const handleJumpToMessage = (messageId) => {
    window.dispatchEvent(
      new CustomEvent("conversation:jump-to-message", {
        detail: { conversationId, messageId },
      }),
    );
    setCurrentView("default");
  };

  if (currentView === "search") {
    return (
      <SearchChat
        conversationId={conversationId}
        onClose={() => setCurrentView("default")}
        onJumpToMessage={handleJumpToMessage}
      />
    );
  }

  if (currentView === "file-manager") {
    return (
      <FileManager
        onClose={() => setCurrentView("default")}
        conversationId={conversationId}
        members={members}
      />
    );
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
            {loadingInfo ? <Spin size="small" /> : isMuted ? `${status} • Đang tắt thông báo` : status}
          </Text>
        </div>

        {/* Khối 2: Các hành động nhanh */}
        <div className="flex w-full items-center justify-center bg-white px-5 py-4">
          <div className={`grid w-full gap-3 ${isGroup && amIGroupOwner ? "grid-cols-4" : "grid-cols-3"}`}>
            <ActionBtn 
              label={isGroup ? "Thêm bạn" : "Lập nhóm"}
              onClick={() => {
                if (isGroup) {
                    setIsAddMemberModalOpen(true);
                } else {
                    if (!directChatMember?.userId) {
                      Modal.error({
                        title: "Không thể lập nhóm",
                        content: "Không xác định được user id của người đang chat.",
                      });
                      return;
                    }
                    setIsCreateGroupModalOpen(true); 
                }
              }}
            >
              {isGroup ? <UserPlus className="h-[18px] w-[18px] text-gray-700" /> : <Users className="h-[18px] w-[18px] text-gray-700" />}
            </ActionBtn>

            {isGroup && amIGroupOwner && (
              <ActionBtn label="Đổi tên" onClick={() => setIsGroupNameModalOpen(true)}>
                <Pencil className="h-[18px] w-[18px] text-gray-700" />
              </ActionBtn>
            )}

            <ActionBtn
              label={isMuted ? "Bật thông báo" : "Tắt thông báo"}
              disabled={updatingMute}
              onClick={() => {
                if (isMuted) handleUnmuteConversation();
                else setIsMuteModalOpen(true);
              }}
            >
              {isMuted ? (
                <Bell className="h-[18px] w-[18px] text-gray-700" />
              ) : (
                <BellOff className="h-[18px] w-[18px] text-gray-700" />
              )}
            </ActionBtn>

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
            {imagePreviewMessages.length > 0 ? (
              imagePreviewMessages.map((message) => {
                const url = message.attachment?.file_url || message.attachment?.fileUrl || message.content;
                return (
                  <img
                    key={message.id}
                    src={url}
                    alt="Ảnh preview"
                    className="w-[70px] h-[70px] rounded-xl object-cover border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                );
              })
            ) : (
              <div className="flex h-[70px] flex-1 items-center rounded-xl bg-gray-50 px-3 text-xs font-semibold text-gray-400">
                Chưa có ảnh nào
              </div>
            )}
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

              {isMembersExpanded && (
  <div className="flex flex-col gap-1 mt-2 px-1 py-1">
    {members.map((member, index) => {
      const memberId = getMemberId(member) || index;
      const isOwner = member.role === "OWNER" || String(ownerId) === String(memberId);
      const isMe = String(resolvedCurrentUserId) === String(memberId);
      const memberName = getDisplayName(member, "Thành viên");
      const showThreeDots = amIGroupOwner && !isMe && !isOwner;

      return (
        <div 
          key={memberId} 
          className="group relative flex items-center justify-between p-2 hover:bg-[#f1f2f4] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 select-none">
            <img 
              src={getAvatarUrl(member, DEFAULT_AVATAR)} 
              alt="avatar" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-gray-800">
                {memberName} 
                {isMe && " (Bạn)"}
              </span>
              {isOwner && (
                <span className="text-[11px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded w-max mt-0.5">
                  Trưởng nhóm
                </span>
              )}
            </div>
          </div>

          {showThreeDots && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMemberMenu(activeMemberMenu === memberId ? null : memberId);
                }}
                className={`p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-all
                  ${activeMemberMenu === memberId ? 'opacity-100 bg-gray-200' : 'opacity-0 group-hover:opacity-100'}
                `}
              >
                <FaEllipsisV className="h-4 w-4" />
              </button>

              {activeMemberMenu === memberId && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 py-1 z-50 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-blue-50 font-bold transition-colors"
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleTransferOwner(memberId, memberName);
                    }}
                  >
                    Chuyển trưởng nhóm
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 font-bold transition-colors"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleRemoveMember(memberId, memberName);
                    }}
                  >
                    Xóa khỏi nhóm
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handleLeaveGroup}
                className="flex items-center gap-2 mt-2 px-4 py-3 text-[14px] font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Rời nhóm
              </button>
              {amIGroupOwner && (
                <button
                  type="button"
                  onClick={handleDeleteGroup}
                  className="flex items-center gap-2 px-4 py-3 text-[14px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                  </svg>
                  Giải tán nhóm
                </button>
              )}
            </>
          )}

        </div>
        
      </div>

      {/* Modals */}
      <EditNicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        conversationId={conversationId}
        members={members}
        onUpdated={handleNicknameUpdated}
      />
      <EditGroupNameModal
        isOpen={isGroupNameModalOpen}
        onClose={() => setIsGroupNameModalOpen(false)}
        conversationId={conversationId}
        currentName={displayName}
        onUpdated={handleGroupNameUpdated}
      />
      <ChangeEmojiModal
        isOpen={isEmojiModalOpen}
        onClose={() => setIsEmojiModalOpen(false)}
        onSelectEmoji={(newEmoji) => onEmojiChange?.(newEmoji)}
      />
      <MuteNotificationModal
        isOpen={isMuteModalOpen}
        onClose={() => setIsMuteModalOpen(false)}
        onConfirm={handleMuteConversation}
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
          initialSelectedMembers={directChatMember ? [directChatMember] : []}
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
          groupName={displayName}
          groupAvatar={avatarUrl}
          onAddMembers={handleAddMembers}
        />
      </Modal>
    </div>
  );
}

// Nút nhỏ gọn lại, thu hẹp padding dọc (py) và chỉnh text nhỏ hơn 1 chút
function ActionBtn({ label, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-[#f1f2f4] hover:bg-[#e5f1ff] py-2.5 px-1 text-gray-700 shadow-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
      <span className="flex min-h-[28px] w-full items-center justify-center text-center text-[10px] font-bold leading-tight text-gray-600">
        {label}
      </span>
    </button>
  );
}
