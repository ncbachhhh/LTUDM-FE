import { useEffect, useRef, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import MessageAPI from "../../../../../apis/message.api.jsx";
import WebSocketAPI from "../../../../../apis/websocket.api.jsx";
import { useAuth } from "../../../../../contexts/auth.context.jsx";
import { mapMessageToUI, sortMessagesByCreatedAt } from "../../../../../features/chat/message.mapper.js";
import { getCurrentUserId } from "../../../../../utils/identity.util.js";
import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatWindow({
  data,
  isInfoOpen,
  setIsInfoOpen,
  currentEmoji,
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Đang kết nối...");
  const [errorMessage, setErrorMessage] = useState("");
  const messageContainerRef = useRef(null);

  const currentUserId = getCurrentUserId(user);
  const conversationId = data?.conversation_id || data?.conversationId || data?.id;
  const canMessage =
    data?.canMessage !== false && !data?.blockedByCurrentUser && !data?.currentUserBlocked;
  const disabledMessage = "Hiện không thể liên lạc";
  const displayStatus = canMessage ? data?.status || socketStatus : disabledMessage;
  const isOnline = displayStatus === "Trực tuyến";

  const scrollToBottom = (behavior = "auto") => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  const handleMessageContentLoad = () => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  };

  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      if (!conversationId) return;

      setLoadingMessages(true);
      setErrorMessage("");
      setMessages([]);

      const result = await MessageAPI.getMessagesByConversation(conversationId);
      if (!mounted) return;

      if (result.isSuccess) {
        const mappedMessages = sortMessagesByCreatedAt(
          result.data.map((message) => mapMessageToUI(message, currentUserId))
        );

        setMessages(mappedMessages);
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

  useEffect(() => {
    let subscription = null;
    let mounted = true;

    const initSocket = async () => {
      if (!conversationId) return;

      try {
        setSocketStatus("Đang kết nối...");

        subscription = await WebSocketAPI.subscribeConversation(conversationId, (newMessage) => {
          if (!mounted) return;

          setMessages((prevMessages) => {
            const mappedMessage = mapMessageToUI(newMessage, currentUserId);
            const existed = prevMessages.some(
              (message) => String(message.id) === String(mappedMessage.id)
            );

            if (existed) return prevMessages;

            return sortMessagesByCreatedAt([...prevMessages, mappedMessage]);
          });
        });

        if (mounted) {
          setSocketStatus("Đã kết nối");
        }
      } catch (error) {
        console.error("CONNECT SOCKET ERROR:", error);

        if (mounted) {
          setSocketStatus("Mất kết nối");
        }
      }
    };

    initSocket();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (loadingMessages) return;
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [conversationId, loadingMessages]);

  useEffect(() => {
    if (loadingMessages) return;
    requestAnimationFrame(() => scrollToBottom("smooth"));
  }, [messages, loadingMessages]);

  const handleSendMessage = async (content) => {
    const result = await WebSocketAPI.sendTextMessage(conversationId, content);

    if (!result.isSuccess) {
      setSocketStatus("Mất kết nối");
    }

    return result;
  };

  const handleSendFileMessage = async (file, type) => {
    if (!conversationId) {
      return {
        isSuccess: false,
        message: "Chưa chọn hội thoại",
      };
    }

    return MessageAPI.sendFileMessage({
      conversationId,
      file,
      type,
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-4">
          <img src={data.avatar} className="h-11 w-11 rounded-full object-cover" alt={data.name} />

          <div>
            <span className="block text-base font-black">{data.name}</span>
            <span
              className={`text-xs font-semibold ${
                isOnline ? "text-green-500" : canMessage ? "text-gray-400" : "text-red-400"
              }`}
            >
              {displayStatus}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className={`p-2 rounded-lg transition-all ${
            isInfoOpen ? "bg-blue-50" : "hover:bg-gray-100"
          }`}
        >
          <FaInfoCircle className="h-6 w-6 text-slate-700" />
        </button>
      </div>

      <div ref={messageContainerRef} className="flex-1 overflow-y-auto bg-[#f9fafb]">
        {loadingMessages ? (
          <div className="mt-10 text-center text-sm font-semibold text-gray-400">
            Đang tải tin nhắn...
          </div>
        ) : errorMessage ? (
          <div className="mt-10 text-center text-sm font-semibold text-red-500">
            {errorMessage}
          </div>
        ) : (
          <MessageList
            messages={messages}
            avatar={data.avatar}
            onContentLoad={handleMessageContentLoad}
          />
        )}
      </div>

      {canMessage ? (
        <div className="p-4 pb-6 bg-white">
          <ChatInput
            currentEmoji={currentEmoji}
            onSendMessage={handleSendMessage}
            onSendFileMessage={handleSendFileMessage}
          />
        </div>
      ) : (
        <div className="border-t bg-white px-6 py-5 text-center text-sm font-bold text-gray-500">
          {disabledMessage}
        </div>
      )}
    </div>
  );
}
