import { useCallback, useEffect, useState } from "react";
import { Alert, Empty } from "antd";
import ChatListStorages from "./ChatListStorages";
import ChatWindowStorages from "./ChatWindowStorages";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import { PROFILE_AVATAR } from "../../../constants/asset.constants.js";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { getCurrentUserId } from "../../../utils/identity.util.js";

/* ── Helper Functions ─────────────────────────────── */

const getMemberId = (member) => member?.user_id || member?.userId || member?.id;

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || PROFILE_AVATAR;

const getBlockedUserFromResponse = (friendship) => {
  const user = friendship?.user || {};
  return {
    id: user.id,
    name: getDisplayName(user),
    email: user.email,
    username: user.username,
    avatar: getAvatarUrl(user),
    friendshipId: friendship.id,
    message: "Hiện không thể liên lạc",
    raw: friendship,
  };
};

/* ── Component ─────────────────────────────────────── */

const StoragesPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = getCurrentUserId(user);

  /* Tải danh sách người dùng bị chặn và các cuộc trò chuyện */
  const loadBlockedConversations = useCallback(async () => {
    setLoading(true);
    setError("");

    const [blockedRes, conversationsRes] = await Promise.all([
      FriendshipAPI.getBlockedUsers(),
      ConversationAPI.getMyConversations(),
    ]);

    if (!blockedRes.isSuccess || !conversationsRes.isSuccess) {
      setError(blockedRes.message || conversationsRes.message || "Không thể tải danh sách đã chặn");
      setBlockedUsers([]);
      setSelectedChat(null);
      setLoading(false);
      return;
    }

    const directConversations = (conversationsRes.data || []).filter(
      (conversation) => conversation.type === "DIRECT"
    );

    const mappedUsers = (blockedRes.data || [])
      .map(getBlockedUserFromResponse)
      .filter((item) => item.id)
      .map((item) => {
        const conversation = directConversations.find((candidate) =>
          (candidate.members || []).some(
            (member) => String(getMemberId(member)) === String(item.id)
          )
        );

        return {
          ...item,
          conversationId: conversation?.id,
          conversation,
          currentUserId,
        };
      });

    setBlockedUsers(mappedUsers);
    setSelectedChat((current) => {
      if (!current) return null;
      return mappedUsers.find((item) => item.id === current.id) || null;
    });
    setLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    const timerId = window.setTimeout(loadBlockedConversations, 0);
    return () => window.clearTimeout(timerId);
  }, [loadBlockedConversations]);

  return (
    <div className="flex h-full gap-4 overflow-hidden bg-[#Eef1f6] p-4">
      {/* Sidebar - Danh sách chặn */}
      <div className="flex h-full w-[340px] shrink-0 flex-col gap-4 text-left">
        <ChatListStorages
          users={blockedUsers}
          loading={loading}
          onSelect={setSelectedChat}
          selectedId={selectedChat?.id}
        />
      </div>

      {/* Cửa sổ chat chi tiết / Empty State */}
      <div className="h-full flex-1 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
        {error ? (
          <div className="flex h-full items-center justify-center p-6">
            <Alert
              type="error"
              message={error}
              showIcon
              className="!font-semibold"
            />
          </div>
        ) : selectedChat ? (
          <ChatWindowStorages user={selectedChat} onChanged={loadBlockedConversations} />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <Empty description="Chọn một người đã chặn để xem chi tiết" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoragesPage;
