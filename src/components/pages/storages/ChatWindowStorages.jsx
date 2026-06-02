import { useEffect, useRef, useState } from "react";
import { Alert, Button, Spin } from "antd";
import { UndoOutlined, UserDeleteOutlined, AppstoreOutlined } from "@ant-design/icons";
import MessageAPI from "../../../apis/message.api.jsx";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import MessageList from "../chat/components/chat-window/MessageList.jsx";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { getCurrentUserId } from "../../../utils/identity.util.js";
import { mapMessageToUI, sortMessagesByCreatedAt } from "../../../features/chat/message.mapper.js";

/* ── Component ───────────────────────────────────── */

const ChatWindowStorages = ({ user, onChanged }) => {
  const { user: currentUser } = useAuth();
  const currentUserId = getCurrentUserId(currentUser);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [processingAction, setProcessingAction] = useState("");
  const [error, setError] = useState("");
  const messageContainerRef = useRef(null);

  /* Trạng thái phân trang */
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastMessageIdRef = useRef(null);

  /* ── Scroll Helpers ────────────────────────────── */

  const scrollToBottom = (behavior = "auto") => {
    messageContainerRef.current?.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior,
    });
  };

  const isNearBottom = (threshold = 150) => {
    const container = messageContainerRef.current;
    if (!container) return false;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const handleMessageContentLoad = () => {
    if (isNearBottom(150)) {
      requestAnimationFrame(() => scrollToBottom("auto"));
    }
  };

  /* ── Tải tin nhắn lần đầu (Trang 0) ─────────────── */

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      if (!user?.conversationId) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      setError("");
      setPage(0);
      setHasMore(true);
      lastMessageIdRef.current = null;

      const response = await MessageAPI.getMessagesByConversation(user.conversationId, 0, 20);

      if (!mounted) return;

      if (response.isSuccess) {
        const mappedMessages = sortMessagesByCreatedAt(
          response.data.map((msg) => mapMessageToUI(msg, currentUserId))
        );
        setMessages(mappedMessages);

        if (response.data.length < 20) {
          setHasMore(false);
        }
        if (mappedMessages.length > 0) {
          lastMessageIdRef.current = mappedMessages[mappedMessages.length - 1].id;
        }
      } else {
        setError(response.message);
      }

      setLoadingMessages(false);
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [user?.conversationId, currentUserId]);

  /* ── Tải thêm tin nhắn cũ ──────────────────────── */

  const loadMoreMessages = async () => {
    if (loadingMessages || loadingMore || !hasMore || !user?.conversationId) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const oldScrollHeight = messageContainerRef.current?.scrollHeight || 0;
    const oldScrollTop = messageContainerRef.current?.scrollTop || 0;

    const response = await MessageAPI.getMessagesByConversation(user.conversationId, nextPage, 20);

    if (response.isSuccess) {
      if (response.data.length < 20) {
        setHasMore(false);
      }
      setPage(nextPage);

      const newMapped = response.data.map((msg) => mapMessageToUI(msg, currentUserId));
      setMessages((prev) => {
        const existingIds = new Set(newMapped.map((m) => String(m.id)));
        const filteredPrev = prev.filter((m) => !existingIds.has(String(m.id)));
        return sortMessagesByCreatedAt([...newMapped, ...filteredPrev]);
      });

      // Giữ nguyên vị trí cuộn
      requestAnimationFrame(() => {
        if (messageContainerRef.current) {
          const newScrollHeight = messageContainerRef.current.scrollHeight;
          messageContainerRef.current.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
        }
      });
    }

    setLoadingMore(false);
  };

  /* ── Bắt sự kiện cuộn ───────────────────────────── */

  const handleScroll = () => {
    if (!messageContainerRef.current) return;
    const { scrollTop } = messageContainerRef.current;

    // Cuộn gần lên đỉnh đầu thì load tiếp trang tiếp theo
    if (scrollTop < 10 && hasMore && !loadingMore && !loadingMessages) {
      loadMoreMessages();
    }
  };

  /* ── Cuộn xuống cuối khi load xong trang đầu ────── */

  useEffect(() => {
    if (!loadingMessages) {
      requestAnimationFrame(() => scrollToBottom("auto"));
    }
  }, [user?.conversationId, loadingMessages]);

  /* ── Cuộn xuống khi có tin nhắn mới ─────────────── */

  useEffect(() => {
    if (loadingMessages || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMessageIdRef.current !== lastMsg.id) {
      const oldLastId = lastMessageIdRef.current;
      lastMessageIdRef.current = lastMsg.id;

      if (oldLastId) {
        requestAnimationFrame(() => scrollToBottom("smooth"));
      }
    }
  }, [messages, loadingMessages]);

  /* ── Xử lý bỏ chặn ────────────────────────────── */

  const handleUnblock = async () => {
    if (!user?.id || processingAction) return;

    setProcessingAction("UNBLOCK");
    setError("");
    const response = await FriendshipAPI.unblockUser(user.id);
    setProcessingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    onChanged?.();
  };

  /* ── Xử lý xóa bạn ────────────────────────────── */

  const handleDeleteFriend = async () => {
    if (!user?.friendshipId || processingAction) return;

    setProcessingAction("DELETE");
    setError("");
    const response = await FriendshipAPI.deleteFriend(user.friendshipId);
    setProcessingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    onChanged?.();
  };

  /* ── Render ────────────────────────────────────── */

  return (
    <div className="flex h-full flex-col text-left">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between border-b border-gray-100 px-8 py-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
          <div>
            <h3 className="text-[17px] font-bold">{user.name}</h3>
            <p className="text-xs font-semibold text-red-400">Hiện không thể liên lạc</p>
          </div>
        </div>
        <Button
          icon={<AppstoreOutlined />}
          className="!rounded-lg !border-gray-200 !text-gray-500 hover:!bg-gray-50"
        />
      </div>

      {/* Khu vực tin nhắn */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#f9fafb]"
      >
        {loadingMore && (
          <div className="py-3 flex justify-center items-center">
            <Spin size="small" tip="Đang tải thêm tin nhắn..." />
          </div>
        )}

        {loadingMessages ? (
          <div className="mt-10 flex justify-center">
            <Spin tip="Đang tải tin nhắn..." />
          </div>
        ) : error ? (
          <div className="m-4">
            <Alert
              type="error"
              message={error}
              showIcon
              closable
              onClose={() => setError("")}
              className="!rounded-xl !font-semibold"
            />
          </div>
        ) : user.conversationId ? (
          <MessageList
            messages={messages}
            avatar={user.avatar}
            members={[user]}
            onContentLoad={handleMessageContentLoad}
          />
        ) : (
          <div className="mt-10 text-center text-sm font-semibold text-gray-400">
            Chưa có đoạn chat với người dùng này.
          </div>
        )}
      </div>

      {/* Footer: Thông báo chặn + Action buttons */}
      <div className="border-t border-gray-100 bg-[#F9FAFB] p-8">
        <p className="mb-6 text-center text-[14px] font-medium text-gray-700">
          Bạn đã chặn <span className="font-bold">{user.name}</span>. Hai bên hiện không thể nhắn tin cho nhau.
        </p>

        <div className="mx-auto flex w-full max-w-[720px] gap-4">
          <Button
            block
            size="large"
            icon={<UndoOutlined />}
            loading={processingAction === "UNBLOCK"}
            disabled={Boolean(processingAction) && processingAction !== "UNBLOCK"}
            onClick={handleUnblock}
            className="!flex-1 !h-auto !py-3 !rounded-[16px] !bg-[#E3E9FF] !text-[#0029FF] !border-none !font-bold hover:!bg-[#d1dbfe] disabled:!opacity-50"
          >
            Bỏ chặn
          </Button>
          <Button
            block
            size="large"
            icon={<UserDeleteOutlined />}
            loading={processingAction === "DELETE"}
            disabled={Boolean(processingAction) && processingAction !== "DELETE"}
            onClick={handleDeleteFriend}
            className="!flex-1 !h-auto !py-3 !rounded-[16px] !bg-[#EFF2F8] !text-black !border-none !font-bold hover:!bg-gray-200 disabled:!opacity-50"
          >
            Xóa bạn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowStorages;
