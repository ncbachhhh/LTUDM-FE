import { Spin, Tooltip, Typography } from "antd";
import { FaInfoCircle, FaThumbtack, FaChevronRight } from "react-icons/fa";
import MessageAPI from "../../../../../apis/message.api.jsx";
import WebSocketAPI from "../../../../../apis/websocket.api.jsx";
import { useAuth } from "../../../../../contexts/auth.context.jsx";
import {
  mapMessageToUI,
  sortMessagesByCreatedAt,
} from "../../../../../features/chat/message.mapper.js";
import { getCurrentUserId } from "../../../../../utils/identity.util.js";
import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";
import { useEffect, useRef, useState } from "react";

const { Text } = Typography;

export default function ChatWindow({
  data,
  isInfoOpen,
  setIsInfoOpen,
  currentEmoji,
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Đang kết nối...");
  const [errorMessage, setErrorMessage] = useState("");
  const messageContainerRef = useRef(null);

  // Trạng thái phân trang tin nhắn
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastMessageIdRef = useRef(null);
  const pendingReplyRef = useRef(null);

  const currentUserId = getCurrentUserId(user);
  const conversationId =
    data?.conversation_id || data?.conversationId || data?.id;

  const pinnedMessages = messages.filter((msg) => msg.isPinned);
  const latestPinnedMessage = pinnedMessages[pinnedMessages.length - 1];

  const getMessagePreview = (message) => {
    if (!message) return "";

    if (message.isRecalled || message.isDeletedForMe)
      return "Bạn đã xóa một tin nhắn";
    if (message.type === "IMAGE") return "Hình ảnh";
    if (message.type === "FILE") return "Tệp đính kèm";

    return message.text || message.content || "";
  };

  const handleJumpToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Kiểm tra xem người dùng có thể nhắn tin không
  const canMessage =
    data?.canMessage !== false &&
    !data?.blockedByCurrentUser &&
    !data?.currentUserBlocked;
  const disabledMessage = "Hiện không thể liên lạc";
  const displayStatus = canMessage
    ? data?.status || socketStatus
    : disabledMessage;
  const isOnline = displayStatus === "Trực tuyến";

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

  // Tải danh sách tin nhắn khi đổi hội thoại (Trang 0)
  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      if (!conversationId) return;

      setLoadingMessages(true);
      setErrorMessage("");
      setMessages([]);
      setPage(0);
      setHasMore(true);
      lastMessageIdRef.current = null;

      const result = await MessageAPI.getMessagesByConversation(
        conversationId,
        0,
        20,
      );
      if (!mounted) return;

      if (result.isSuccess) {
        const mapped = sortMessagesByCreatedAt(
          result.data.map((msg) => mapMessageToUI(msg, currentUserId)),
        );
        setMessages(mapped);
        if (result.data.length < 20) {
          setHasMore(false);
        }
        if (mapped.length > 0) {
          lastMessageIdRef.current = mapped[mapped.length - 1].id;
        }
        MessageAPI.markConversationRead(conversationId);
      } else {
        setErrorMessage(result.message || "Không lấy được tin nhắn");
      }

      setLoadingMessages(false);
    };

    fetchMessages();
    return () => {
      mounted = false;
    };
  }, [conversationId, currentUserId]);

  // Hàm tải thêm tin nhắn cũ
  const loadMoreMessages = async () => {
    if (loadingMessages || loadingMore || !hasMore || !conversationId) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const oldScrollHeight = messageContainerRef.current?.scrollHeight || 0;
    const oldScrollTop = messageContainerRef.current?.scrollTop || 0;

    const result = await MessageAPI.getMessagesByConversation(
      conversationId,
      nextPage,
      20,
    );

    if (result.isSuccess) {
      if (result.data.length < 20) {
        setHasMore(false);
      }
      setPage(nextPage);

      const newMapped = result.data.map((msg) =>
        mapMessageToUI(msg, currentUserId),
      );
      setMessages((prev) => {
        const existingIds = new Set(newMapped.map((m) => String(m.id)));
        const filteredPrev = prev.filter((m) => !existingIds.has(String(m.id)));
        return sortMessagesByCreatedAt([...newMapped, ...filteredPrev]);
      });

      // Giữ nguyên vị trí cuộn sau khi chèn tin nhắn cũ vào đầu danh sách
      requestAnimationFrame(() => {
        if (messageContainerRef.current) {
          const newScrollHeight = messageContainerRef.current.scrollHeight;
          messageContainerRef.current.scrollTop =
            newScrollHeight - oldScrollHeight + oldScrollTop;
        }
      });
    }

    setLoadingMore(false);
  };

  // Bắt sự kiện cuộn
  const handleScroll = () => {
    if (!messageContainerRef.current) return;
    const { scrollTop } = messageContainerRef.current;

    // Cuộn lên gần đỉnh (dưới 10px) và không trong trạng thái loading thì tải trang tiếp theo
    if (scrollTop < 10 && hasMore && !loadingMore && !loadingMessages) {
      loadMoreMessages();
    }
  };

  // Kết nối WebSocket để nhận tin nhắn realtime
  useEffect(() => {
    let subscription = null;
    let mounted = true;

    const initSocket = async () => {
      if (!conversationId) return;

      try {
        setSocketStatus("Đang kết nối...");

        subscription = await WebSocketAPI.subscribeConversation(
          conversationId,
          (newMessage) => {
            if (!mounted) return;

            setMessages((prev) => {
              let mapped = mapMessageToUI(newMessage, currentUserId);

              const pendingReply = pendingReplyRef.current;
              const mappedContent = mapped.text || mapped.content || "";
              const pendingContent = pendingReply?.content || "";

              const isPendingReplyMessage =
                pendingReply &&
                mapped.isOwn &&
                mappedContent.trim() === pendingContent.trim();

              if (isPendingReplyMessage) {
                const repliedMessage = pendingReply.message;

                mapped = {
                  ...mapped,
                  isReply: true,
                  replyText:
                    repliedMessage?.text ||
                    repliedMessage?.content ||
                    "Tin nhắn",
                  replySenderName: repliedMessage?.senderName || "Người dùng",
                };

                pendingReplyRef.current = null;
              }
              const existed = prev.some(
                (m) => String(m.id) === String(mapped.id),
              );
              if (existed) {
                return sortMessagesByCreatedAt(
                  prev.map((m) =>
                    String(m.id) === String(mapped.id)
                      ? {
                          ...m,
                          ...mapped,
                        }
                      : m,
                  ),
                );
              }

              return sortMessagesByCreatedAt([...prev, mapped]);
            });
          },
        );

        if (mounted) setSocketStatus("Đã kết nối");
      } catch (error) {
        console.error("CONNECT SOCKET ERROR:", error);
        if (mounted) setSocketStatus("Mất kết nối");
      }
    };

    initSocket();
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  // Cuộn xuống cuối khi cuộc hội thoại tải xong lần đầu
  useEffect(() => {
    if (!loadingMessages) requestAnimationFrame(() => scrollToBottom("auto"));
  }, [conversationId, loadingMessages]);

  // Chỉ tự động cuộn xuống dưới khi có tin nhắn MỚI (tin nhắn gửi đi hoặc tin nhắn mới nhận)
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

  const handleSendMessage = async (content, parentId) => {
    pendingReplyRef.current = parentId
      ? {
          content,
          message: replyingMessage,
        }
      : null;
    const result = await WebSocketAPI.sendTextMessage(
      conversationId,
      content,
      parentId,
    );
    if (!result.isSuccess) {
      pendingReplyRef.current = null;
      setSocketStatus("Mất kết nối");
    }

    return result;
  };

  const handleSendFileMessage = async (file, type) => {
    if (!conversationId)
      return { isSuccess: false, message: "Chưa chọn hội thoại" };
    return MessageAPI.sendFileMessage({ conversationId, file, type });
  };

  const handlePin = async (messageId) => {
    try {
      const currentMessage = messages.find(
        (item) => String(item.id) === String(messageId),
      );

      if (!currentMessage) return;

      const nextPinnedStatus = !currentMessage.isPinned;

      // Update tạm trên FE để UI phản hồi nhanh
      setMessages((prev) =>
        prev.map((item) =>
          String(item.id) === String(messageId)
            ? {
                ...item,
                isPinned: nextPinnedStatus,
              }
            : item,
        ),
      );

      // Gọi BE để lưu trạng thái ghim thật
      const result = await MessageAPI.pinMessage(messageId, nextPinnedStatus);

      if (result?.isSuccess && result.data) {
        const updatedMessage = mapMessageToUI(result.data, currentUserId);

        setMessages((prev) =>
          sortMessagesByCreatedAt(
            prev.map((item) =>
              String(item.id) === String(updatedMessage.id)
                ? {
                    ...item,
                    ...updatedMessage,
                  }
                : item,
            ),
          ),
        );
      }
    } catch (error) {
      console.error("PIN MESSAGE ERROR:", error);
    }
  };

  const handleRecall = async (messageId) => {
    try {
      if (!messageId) return;

      // Update tạm trên FE
      setMessages((prev) =>
        prev.map((item) =>
          String(item.id) === String(messageId)
            ? {
                ...item,
                text: "",
                content: "",
                isRecalled: true,
              }
            : item,
        ),
      );

      // Gọi BE để thu hồi thật
      const result = await MessageAPI.recallMessage(messageId);

      if (result?.isSuccess && result.data) {
        const updatedMessage = mapMessageToUI(result.data, currentUserId);

        setMessages((prev) =>
          sortMessagesByCreatedAt(
            prev.map((item) =>
              String(item.id) === String(updatedMessage.id)
                ? {
                    ...item,
                    ...updatedMessage,
                  }
                : item,
            ),
          ),
        );
      }
    } catch (error) {
      console.error("RECALL MESSAGE ERROR:", error);
    }
  };

  const handleDeleteForMe = async (messageId) => {
    try {
      setMessages((prev) =>
        prev.map((item) =>
          String(item.id) === String(messageId)
            ? {
                ...item,
                text: "",
                content: "",
                isDeletedForMe: true,
              }
            : item,
        ),
      );

      await MessageAPI.deleteMessageForMe(messageId);
    } catch (error) {
      console.error("DELETE MESSAGE FOR ME ERROR:", error);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
      {/* Header: Thông tin người/nhóm chat */}
      <div className="flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-4">
          <img
            src={data.avatar}
            className="h-11 w-11 rounded-full object-cover"
            alt={data.name}
          />
          <div>
            <Text strong className="block text-base">
              {data.name}
            </Text>
            <Text
              className={`text-xs font-semibold ${
                isOnline
                  ? "!text-green-500"
                  : canMessage
                    ? "!text-gray-400"
                    : "!text-red-400"
              }`}
            >
              {displayStatus}
            </Text>
          </div>
        </div>

        {/* Nút mở/đóng panel thông tin */}
        <Tooltip
          title={isInfoOpen ? "Ẩn thông tin" : "Xem thông tin"}
          placement="left"
        >
          <button
            type="button"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className={`p-2 rounded-lg transition-all ${
              isInfoOpen ? "bg-blue-50" : "hover:bg-gray-100"
            }`}
          >
            <FaInfoCircle className="h-6 w-6 text-slate-700" />
          </button>
        </Tooltip>
      </div>

      {latestPinnedMessage && (
        <button
          type="button"
          onClick={() => handleJumpToMessage(latestPinnedMessage.id)}
          className="flex items-center justify-between border-b bg-yellow-50 px-5 py-3 text-left hover:bg-yellow-100 transition-colors"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <FaThumbtack size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-yellow-700">
                Tin nhắn đã ghim
                {pinnedMessages.length > 1
                  ? ` · ${pinnedMessages.length} tin`
                  : ""}
              </p>

              <p className="truncate text-sm font-medium text-gray-700">
                {getMessagePreview(latestPinnedMessage)}
              </p>
            </div>
          </div>

          <FaChevronRight className="ml-3 shrink-0 text-yellow-600" size={14} />
        </button>
      )}

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
        ) : errorMessage ? (
          <Text
            type="danger"
            className="mt-10 block text-center text-sm font-semibold"
          >
            {errorMessage}
          </Text>
        ) : (
          <MessageList
            messages={messages}
            avatar={data.avatar}
            members={data.members}
            isGroup={data.isGroup}
            onContentLoad={handleMessageContentLoad}
            onReply={(msg) => {
              console.log("REPLY MESSAGE:", msg);
              setReplyingMessage(msg);
            }} // <--- TRUYỀN CALLBACK
            onPin={handlePin} // <--- TRUYỀN CALLBACK
            onRecall={handleRecall} // <--- TRUYỀN CALLBACK
            onDelete={handleDeleteForMe}
          />
        )}
      </div>

      {/* Input nhập tin nhắn hoặc thông báo bị chặn */}
      {canMessage ? (
        <div className="p-4 pb-6 bg-white">
          <ChatInput
            currentEmoji={currentEmoji}
            onSendMessage={handleSendMessage}
            onSendFileMessage={handleSendFileMessage}
            replyingMsg={replyingMessage} // <--- TRUYỀN PROP
            onCancelReply={() => setReplyingMessage(null)} // <--- TRUYỀN PROP
          />
        </div>
      ) : (
        <div className="border-t bg-white px-6 py-5 text-center">
          <Text type="secondary" className="text-sm font-bold">
            {disabledMessage}
          </Text>
        </div>
      )}
    </div>
  );
}
