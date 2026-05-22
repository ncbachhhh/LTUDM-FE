import { useEffect, useRef, useState } from "react";
import { Layout, RotateCcw, UserX } from "lucide-react";
import MessageAPI from "../../../apis/message.api.jsx";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import MessageList from "../chat/components/chat-window/MessageList.jsx";

const ChatWindowStorages = ({ user, onChanged }) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [processingAction, setProcessingAction] = useState("");
  const [error, setError] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      if (!user?.conversationId) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      setError("");
      const response = await MessageAPI.getMessagesByConversation(user.conversationId);

      if (!mounted) return;

      if (response.isSuccess) {
        const mappedMessages = response.data.map((message) => ({
          id: message.id,
          text: message.content,
          type: message.type || "TEXT",
          attachment: message.attachment || null,
          isOwn: String(message.sender_id || message.senderId) !== String(user.id),
          createdAt: message.created_at || message.createdAt,
          time: message.created_at || message.createdAt
            ? new Date(message.created_at || message.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          raw: message,
        }));
        setMessages(mappedMessages);
      } else {
        setError(response.message);
      }

      setLoadingMessages(false);
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [user?.conversationId, user?.id]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container || loadingMessages) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
  }, [messages, loadingMessages]);

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

  return (
    <div className="flex h-full flex-col text-left">
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
        <button className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50">
          <Layout size={20} />
        </button>
      </div>

      <div ref={messageContainerRef} className="flex-1 overflow-y-auto bg-[#f9fafb]">
        {loadingMessages ? (
          <div className="mt-10 text-center text-sm font-semibold text-gray-400">
            Đang tải tin nhắn...
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-sm font-semibold text-red-500">
            {error}
          </div>
        ) : user.conversationId ? (
          <MessageList messages={messages} avatar={user.avatar} />
        ) : (
          <div className="mt-10 text-center text-sm font-semibold text-gray-400">
            Chưa có đoạn chat với người dùng này.
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-[#F9FAFB] p-8">
        <p className="mb-6 text-center text-[14px] font-medium text-gray-700">
          Bạn đã chặn <span className="font-bold">{user.name}</span>. Hai bên hiện không thể nhắn tin cho nhau.
        </p>

        <div className="mx-auto flex w-full max-w-[720px] gap-4">
          <button
            disabled={Boolean(processingAction)}
            onClick={handleUnblock}
            className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#E3E9FF] py-4 font-bold text-[#0029FF] transition-all hover:bg-blue-100 disabled:opacity-50"
          >
            <RotateCcw size={18} />
            {processingAction === "UNBLOCK" ? "Đang bỏ chặn..." : "Bỏ chặn"}
          </button>
          <button
            disabled={Boolean(processingAction)}
            onClick={handleDeleteFriend}
            className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#EFF2F8] py-4 font-bold text-black transition-all hover:bg-gray-200 disabled:opacity-50"
          >
            <UserX size={18} />
            {processingAction === "DELETE" ? "Đang xóa..." : "Xóa bạn"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowStorages;
