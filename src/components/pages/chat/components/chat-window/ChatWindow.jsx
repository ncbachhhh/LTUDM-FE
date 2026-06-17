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
import { useCallback, useEffect, useRef, useState } from "react";
import PinnedMessagesBar from "./PinnedMessagesBar.jsx";

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
  const [remotePinnedMessages, setRemotePinnedMessages] = useState([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [pendingJumpMessageId, setPendingJumpMessageId] = useState(null);
  const messageContainerRef = useRef(null);

  // Trạng thái phân trang tin nhắn
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastMessageIdRef = useRef(null);
  const autoReadTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastTypingStateRef = useRef(false);
  const messagesRef = useRef([]);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);

  const currentUserId = getCurrentUserId(user);
  const conversationId =
    data?.conversation_id || data?.conversationId || data?.id;

  const loadedPinnedMessages = messages.filter((msg) => msg.isPinned);
  const pinnedMessages =
    remotePinnedMessages.length > 0 ? remotePinnedMessages : loadedPinnedMessages;
  const latestPinnedMessage = pinnedMessages[pinnedMessages.length - 1];

  const getMessagePreview = (message) => {
    if (!message) return "";

    if (message.isRecalled) return "Tin nhắn đã thu hồi";
    if (message.isDeletedForMe) return "Bạn đã xóa một tin nhắn";
    if (message.type === "IMAGE") return "Hình ảnh";
    if (message.type === "FILE") return "Tệp đính kèm";

    return message.text || message.content || "";
  };

  const mergeMessages = useCallback((currentMessages, incomingMessages) => {
    const incomingIds = new Set(incomingMessages.map((message) => String(message.id)));
    const filteredCurrent = currentMessages.filter(
      (message) => !incomingIds.has(String(message.id)),
    );
    return sortMessagesByCreatedAt([...incomingMessages, ...filteredCurrent]);
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const handleJumpToMessage = useCallback((messageId) => {
    const element = document.getElementById(`message-${messageId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setHighlightedMessageId(messageId);
      window.setTimeout(() => {
        setHighlightedMessageId((currentId) =>
          String(currentId) === String(messageId) ? null : currentId,
        );
      }, 1800);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!pendingJumpMessageId) return undefined;

    const timerId = window.setTimeout(() => {
      if (handleJumpToMessage(pendingJumpMessageId)) {
        setPendingJumpMessageId(null);
      }
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [handleJumpToMessage, messages, pendingJumpMessageId]);

  const loadUntilMessageVisible = useCallback(
    async (messageId) => {
      if (!conversationId || !messageId) return;
      if (handleJumpToMessage(messageId)) return;

      let nextPage = pageRef.current + 1;
      let canLoadMore = hasMoreRef.current;
      let mergedMessages = messagesRef.current;

      setLoadingMore(true);

      while (canLoadMore) {
        const result = await MessageAPI.getMessagesByConversation(
          conversationId,
          nextPage,
          20,
        );

        if (!result.isSuccess) {
          break;
        }

        const mappedMessages = result.data.map((message) =>
          mapMessageToUI(message, currentUserId),
        );
        mergedMessages = mergeMessages(mergedMessages, mappedMessages);

        const reachedEnd = result.data.length < 20;
        setMessages(mergedMessages);
        setPage(nextPage);
        setHasMore(!reachedEnd);
        messagesRef.current = mergedMessages;
        pageRef.current = nextPage;
        hasMoreRef.current = !reachedEnd;

        const found = mergedMessages.some(
          (message) => String(message.id) === String(messageId),
        );

        if (found) {
          setPendingJumpMessageId(messageId);
          break;
        }

        if (reachedEnd) {
          canLoadMore = false;
        } else {
          nextPage += 1;
        }
      }

      setLoadingMore(false);
    },
    [conversationId, currentUserId, handleJumpToMessage, mergeMessages],
  );

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

  useEffect(() => {
    if (!conversationId) return undefined;

    const handleExternalJump = (event) => {
      const eventConversationId = event.detail?.conversationId || event.detail?.conversation_id;
      const messageId = event.detail?.messageId || event.detail?.message_id;
      if (String(eventConversationId) !== String(conversationId) || !messageId) return;
      loadUntilMessageVisible(messageId);
    };

    window.addEventListener("conversation:jump-to-message", handleExternalJump);
    return () => window.removeEventListener("conversation:jump-to-message", handleExternalJump);
  }, [conversationId, loadUntilMessageVisible]);

  const scheduleMarkConversationRead = useCallback(() => {
    if (!conversationId) return;

    window.clearTimeout(autoReadTimerRef.current);
    autoReadTimerRef.current = window.setTimeout(() => {
      WebSocketAPI.sendReadReceipt(conversationId).then((result) => {
        if (!result?.isSuccess) {
          MessageAPI.markConversationRead(conversationId);
        }
      });
    }, 150);
  }, [conversationId]);

  const publishTypingState = useCallback(
    (typing) => {
      if (!conversationId || lastTypingStateRef.current === typing) return;
      lastTypingStateRef.current = typing;
      WebSocketAPI.sendTyping(conversationId, typing);
    },
    [conversationId],
  );

  // Tải danh sách tin nhắn khi đổi hội thoại (Trang 0)
  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      if (!conversationId) return;

      setLoadingMessages(true);
      setErrorMessage("");
      setMessages([]);
      setRemotePinnedMessages([]);
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
        WebSocketAPI.sendReadReceipt(conversationId).then((readResult) => {
          if (!readResult?.isSuccess) {
            MessageAPI.markConversationRead(conversationId);
          }
        });
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
      setMessages((prev) => mergeMessages(prev, newMapped));

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
    let readSubscription = null;
    let mounted = true;

    const initSocket = async () => {
      if (!conversationId) return;

      try {
        setSocketStatus("Đang kết nối...");

        subscription = await WebSocketAPI.subscribeConversation(
          conversationId,
          (newMessage) => {
            if (!mounted) return;

            const senderId = newMessage?.sender_id || newMessage?.senderId;
            if (senderId && String(senderId) !== String(currentUserId)) {
              scheduleMarkConversationRead();
            }

            const mapped = mapMessageToUI(newMessage, currentUserId);
            setRemotePinnedMessages((previousPinned) => {
              const withoutCurrent = previousPinned.filter(
                (message) => String(message.id) !== String(mapped.id),
              );

              if (!mapped.isPinned) {
                return withoutCurrent;
              }

              return sortMessagesByCreatedAt([...withoutCurrent, mapped]);
            });

            setMessages((prev) => {
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

        readSubscription = await WebSocketAPI.subscribeConversationRead(
          conversationId,
          (readEvent) => {
            if (!mounted || readEvent?.event_type !== "MESSAGES_READ") return;

            const reader = readEvent.reader;
            const readerId = reader?.user_id || reader?.userId;
            const readMessageIds = new Set(
              (readEvent.message_ids || readEvent.messageIds || []).map(String),
            );

            if (!readerId || String(readerId) === String(currentUserId) || readMessageIds.size === 0) {
              return;
            }

            setMessages((previousMessages) =>
              previousMessages.map((message) => {
                if (!readMessageIds.has(String(message.id))) return message;

                const currentSeenBy = Array.isArray(message.seenBy) ? message.seenBy : [];
                const alreadySeen = currentSeenBy.some((seenUser) => {
                  const seenUserId = seenUser?.user_id || seenUser?.userId;
                  return String(seenUserId) === String(readerId);
                });

                if (alreadySeen) return message;

                return {
                  ...message,
                  seenBy: [...currentSeenBy, reader],
                  raw: {
                    ...message.raw,
                    seen_by: [...(message.raw?.seen_by || message.raw?.seenBy || []), reader],
                  },
                };
              }),
            );
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
      window.clearTimeout(autoReadTimerRef.current);
      window.clearTimeout(typingTimerRef.current);
      publishTypingState(false);
      subscription?.unsubscribe();
      readSubscription?.unsubscribe();
    };
  }, [conversationId, currentUserId, publishTypingState, scheduleMarkConversationRead]);

  useEffect(() => {
    let mounted = true;

    const fetchPinnedMessages = async () => {
      if (!conversationId) return;

      const result = await MessageAPI.getPinnedMessages(conversationId);
      if (!mounted) return;

      if (result.isSuccess) {
        setRemotePinnedMessages(
          sortMessagesByCreatedAt(
            result.data.map((msg) => mapMessageToUI(msg, currentUserId)),
          ),
        );
      } else {
        setRemotePinnedMessages([]);
      }
    };

    fetchPinnedMessages();

    return () => {
      mounted = false;
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
    publishTypingState(false);
    window.clearTimeout(typingTimerRef.current);
    const result = await WebSocketAPI.sendTextMessage(
      conversationId,
      content,
      parentId,
    );
    if (!result.isSuccess) {
      setSocketStatus("Mất kết nối");
    }

    return result;
  };

  const handleTypingChange = (typing) => {
    publishTypingState(typing);
    window.clearTimeout(typingTimerRef.current);

    if (typing) {
      typingTimerRef.current = window.setTimeout(() => publishTypingState(false), 2500);
    }
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

      // Backend đang giới hạn tối đa 5 tin nhắn ghim mỗi hội thoại.
      if (nextPinnedStatus && pinnedMessages.length >= 5) {
        alert("Bạn chỉ được ghim tối đa 5 tin nhắn.");
        return;
      }

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

        setRemotePinnedMessages((prev) => {
          const withoutCurrent = prev.filter(
            (item) => String(item.id) !== String(updatedMessage.id),
          );

          if (!updatedMessage.isPinned) {
            return withoutCurrent;
          }

          return sortMessagesByCreatedAt([...withoutCurrent, updatedMessage]);
        });
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

        setRemotePinnedMessages((prev) =>
          prev.map((item) =>
            String(item.id) === String(updatedMessage.id)
              ? { ...item, ...updatedMessage }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("RECALL MESSAGE ERROR:", error);
    }
  };

  const handleDeleteForMe = async (messageId) => {
    try {
      setMessages((prev) => prev.filter((item) => String(item.id) !== String(messageId)));
      setRemotePinnedMessages((prev) => prev.filter((item) => String(item.id) !== String(messageId)));

      await MessageAPI.deleteMessageForMe(messageId);
    } catch (error) {
      console.error("DELETE MESSAGE FOR ME ERROR:", error);
    }
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
      {/* Header: Thông tin người/nhóm chat - Đã thay border thành #9B9B9B */}
      <div className="flex items-center justify-between border-b border-[#9B9B9B] p-5">
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
              isInfoOpen ? "chat-info-button-active" : "hover:bg-gray-100"
            }`}
          >
            <FaInfoCircle className="h-6 w-6 text-slate-700" />
          </button>
        </Tooltip>
      </div>

<PinnedMessagesBar 
  pinnedMessages={pinnedMessages}
  latestPinnedMessage={latestPinnedMessage}
  onJumpTo={handleJumpToMessage}
  getMessagePreview={getMessagePreview}
/>
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
            }} 
            onPin={handlePin} 
            onRecall={handleRecall} 
            onDelete={handleDeleteForMe}
            highlightedMessageId={highlightedMessageId}
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
            onTypingChange={handleTypingChange}
            replyingMsg={replyingMessage} 
            onCancelReply={() => setReplyingMessage(null)} 
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
