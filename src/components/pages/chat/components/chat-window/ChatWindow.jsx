import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";
import MessageAPI from "../../../../../apis/message.api.jsx";
import WebSocketAPI from "../../../../../apis/websocket.api.jsx";
import { useAuth } from "../../../../../contexts/auth.context.jsx";
import { FaInfoCircle } from "react-icons/fa";

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

    const currentUserId =
        user?.id ||
        user?.user_id ||
        user?.userId ||
        localStorage.getItem("userId");

    const conversationId =
        data?.conversation_id ||
        data?.conversationId ||
        data?.id;

    const scrollToBottom = (behavior = "auto") => {
        const container = messageContainerRef.current;

        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    };

    const getMessageId = (message) => {
        return message.id || message.message_id || `${Date.now()}-${Math.random()}`;
    };

    const getSenderId = (message) => {
        return message.sender_id || message.senderId;
    };

    const getCreatedAt = (message) => {
        return message.created_at || message.createdAt;
    };

    const getMessageTimestamp = (message) => {
        const createdAt = message?.createdAt || message?.created_at || message?.raw?.created_at || message?.raw?.createdAt;
        const timestamp = createdAt ? new Date(createdAt).getTime() : 0;
        return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const sortMessagesByCreatedAt = (messageList) => {
        return [...messageList].sort((left, right) => {
            const diff = getMessageTimestamp(left) - getMessageTimestamp(right);
            if (diff !== 0) return diff;
            return String(left.id).localeCompare(String(right.id));
        });
    };

    const handleMessageContentLoad = () => {
        requestAnimationFrame(() => {
            scrollToBottom("auto");
        });
    };

    const mapMessageToUI = (message) => {
        const senderId = getSenderId(message);
        const createdAt = getCreatedAt(message);

        return {
            id: getMessageId(message),
            text: message.content,
            type: message.type || "TEXT",
            attachment: message.attachment || null,
            isOwn: String(senderId) === String(currentUserId),
            createdAt,
            time: createdAt
                ? new Date(createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "vừa xong",
            raw: message,
        };
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
                const mappedMessages = sortMessagesByCreatedAt(result.data.map(mapMessageToUI));
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

                subscription = await WebSocketAPI.subscribeConversation(
                    conversationId,
                    (newMessage) => {
                        if (!mounted) return;

                        setMessages((prevMessages) => {
                            const newMessageId = getMessageId(newMessage);

                            const existed = prevMessages.some(
                                (msg) => String(msg.id) === String(newMessageId)
                            );

                            if (existed) return prevMessages;

                            return sortMessagesByCreatedAt([
                                ...prevMessages,
                                mapMessageToUI(newMessage),
                            ]);
                        });
                    }
                );

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

        requestAnimationFrame(() => {
            scrollToBottom("auto");
        });
    }, [conversationId, loadingMessages]);

    useEffect(() => {
        if (loadingMessages) return;

        requestAnimationFrame(() => {
            scrollToBottom("smooth");
        });
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
                    <img
                        src={data.avatar}
                        className="h-11 w-11 rounded-full object-cover"
                        alt={data.name}
                    />

                    <div>
                        <span className="block text-base font-black">{data.name}</span>

                        <span
                            className={`text-xs font-semibold ${
                                socketStatus === "Đã kết nối"
                                    ? "text-green-500"
                                    : "text-red-400"
                            }`}
                        >
                            {socketStatus}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className={`p-2 rounded-lg transition-all ${
                        isInfoOpen ? "bg-blue-50" : "hover:bg-gray-100"
                    }`}
                >
                    <FaInfoCircle className="h-6 w-6 text-slate-700" />
                </button>
            </div>

            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto bg-[#f9fafb]"
            >
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

            <div className="p-4 pb-6 bg-white">
                <ChatInput
                    currentEmoji={currentEmoji}
                    onSendMessage={handleSendMessage}
                    onSendFileMessage={handleSendFileMessage}
                />
            </div>
        </div>
    );
}
