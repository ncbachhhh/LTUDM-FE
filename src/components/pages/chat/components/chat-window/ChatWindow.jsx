import { useEffect, useState } from "react";
import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";
import WebSocketAPI from "../../../../../apis/websocket.api.jsx";
import { useAuth } from "../../../../../contexts/AuthContext.jsx";

const DEFAULT_CONVERSATION_ID = "2b7deef1-c0d1-4348-aaf1-5cb7a8bab2f6";

export default function ChatWindow({
                                       data,
                                       isInfoOpen,
                                       setIsInfoOpen,
                                       currentEmoji,
                                   }) {
    const { user } = useAuth();

    const [messages, setMessages] = useState(data.messages || []);
    const [socketStatus, setSocketStatus] = useState("Đang kết nối...");

    const conversationId = DEFAULT_CONVERSATION_ID;
    const currentUserId =
        user?.id || user?.user_id || localStorage.getItem("userId");

    const mapMessageToUI = (message) => {
        return {
            id: message.id || Date.now(),
            text: message.content,
            isOwn: String(message.sender_id) === String(currentUserId),
            time: message.created_at
                ? new Date(message.created_at).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "vừa xong",
            type: message.type,
            raw: message,
        };
    };

    useEffect(() => {
        let subscription = null;
        let mounted = true;

        const initSocket = async () => {
            try {
                setSocketStatus("Đang kết nối...");

                subscription = await WebSocketAPI.subscribeConversation(
                    conversationId,
                    (newMessage) => {
                        if (!mounted) return;

                        setMessages((prevMessages) => {
                            const existed = prevMessages.some(
                                (msg) => msg.id === newMessage.id
                            );

                            if (existed) return prevMessages;

                            return [...prevMessages, mapMessageToUI(newMessage)];
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

    const handleSendMessage = async (content) => {
        const result = await WebSocketAPI.sendTextMessage(conversationId, content);

        if (!result.isSuccess) {
            setSocketStatus("Mất kết nối");
        }

        return result;
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
                    <img
                        src="/thong-tin-hoi-thoai.svg"
                        className="h-6 w-6"
                        alt="Thông tin hội thoại"
                    />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
                <MessageList messages={messages} avatar={data.avatar} />
            </div>

            <div className="p-4 pb-6 bg-white">
                <ChatInput
                    currentEmoji={currentEmoji}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}