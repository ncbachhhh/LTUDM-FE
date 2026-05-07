import React, { useEffect, useState } from "react";
import ChatList from "./components/chat-list/ChatList.jsx";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import InfoPanel from "./components/info-panel/InfoPanel.jsx";
import ChatWelcomeScreen from "./components/chat-window/ChatWelcomeScreen.jsx";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";

const DEFAULT_AVATAR = "/avatar-mac-dinh.jpg";
const GROUP_AVATAR = "/Icon-group.svg";

const defaultStats = [
    { id: "streak", label: "Chuỗi chat", value: "0", subValue: "0" },
    { id: "links", label: "Link", value: "0" },
    { id: "files", label: "File", value: "0" },
    { id: "images", label: "Hình ảnh", value: "0" },
];

const defaultSettings = [
    "Chỉnh sửa biệt danh",
    "Thay đổi biểu tượng cảm xúc",
];

const ChatPage = () => {
    const { user } = useAuth();
    const { api } = useNotification();

    const [contacts, setContacts] = useState({
        people: [],
        groups: [],
    });

    const [currentConvo, setCurrentConvo] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [currentEmoji, setCurrentEmoji] = useState("👍");
    const [loadingConversations, setLoadingConversations] = useState(false);

    const currentUserId =
        user?.id ||
        user?.user_id ||
        user?.userId ||
        localStorage.getItem("userId");

    const formatConversationTime = (createdAt) => {
        if (!createdAt) return "";

        return new Date(createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        });
    };

    const getMemberId = (member) => {
        return member?.user_id || member?.userId || member?.id;
    };

    const getMemberOnlineStatus = (member) => {
        return Boolean(
            member?.is_online ||
            member?.online ||
            member?.isActive ||
            member?.is_active
        );
    };

    const mapConversationToContact = (conversation) => {
        const isGroup = conversation.type === "GROUP";

        const members = conversation.members || [];

        const otherMember = members.find(
            (member) => String(getMemberId(member)) !== String(currentUserId)
        );

        const name = isGroup
            ? conversation.title || "Nhóm chat"
            : otherMember?.display_name ||
            otherMember?.displayName ||
            otherMember?.username ||
            "Người dùng";

        const avatar = isGroup
            ? conversation.avatar_url || conversation.avatarUrl || GROUP_AVATAR
            : otherMember?.avatar_url || otherMember?.avatarUrl || DEFAULT_AVATAR;

        const isActive = isGroup ? false : getMemberOnlineStatus(otherMember);

        return {
            id: conversation.id,
            conversation_id: conversation.id,
            conversationId: conversation.id,

            type: conversation.type,
            name,
            avatar,

            message: "Bấm để mở đoạn chat",
            time: formatConversationTime(conversation.created_at),
            status: isGroup
                ? "Nhóm chat"
                : isActive
                    ? "Trực tuyến"
                    : "Ngoại tuyến",

            isActive,
            isGroup,

            members,
            raw: conversation,

            stats: defaultStats,
            settings: defaultSettings,
        };
    };

    const fetchConversations = async () => {
        if (!currentUserId) return;

        setLoadingConversations(true);

        const result = await ConversationAPI.getMyConversations();

        setLoadingConversations(false);

        if (result.isSuccess) {
            const conversations = Array.isArray(result.data) ? result.data : [];

            const mappedConversations = conversations.map(mapConversationToContact);

            setContacts({
                people: mappedConversations.filter((item) => !item.isGroup),
                groups: mappedConversations.filter((item) => item.isGroup),
            });

            if (currentConvo) {
                const updatedCurrentConvo = mappedConversations.find(
                    (item) => item.conversation_id === currentConvo.conversation_id
                );

                setCurrentConvo(updatedCurrentConvo || null);
            }

            return;
        }

        api.error({
            message: "Không lấy được danh sách hội thoại",
            description: result.message,
            placement: "topRight",
        });
    };

    useEffect(() => {
        fetchConversations();
    }, [currentUserId]);

    const handleSelectContact = (id) => {
        const found =
            contacts.people.find((p) => p.id === id) ||
            contacts.groups.find((g) => g.id === id);

        if (found) {
            setCurrentConvo(found);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#E8EEFB] p-6 gap-6 overflow-hidden">
            <div className="chat-list-panel h-full w-[320px] shrink-0">
                <ChatList
                    contacts={contacts}
                    loading={loadingConversations}
                    currentConvoId={currentConvo?.id}
                    onSelect={handleSelectContact}
                />
            </div>

            <div className="h-full flex-1">
                {!currentConvo ? (
                    <div className="h-full rounded-2xl">
                        <ChatWelcomeScreen />
                    </div>
                ) : (
                    <div className="flex h-full gap-6">
                        <div className="flex-1 h-full">
                            <ChatWindow
                                data={currentConvo}
                                isInfoOpen={isInfoOpen}
                                setIsInfoOpen={setIsInfoOpen}
                                currentEmoji={currentEmoji}
                            />
                        </div>

                        {isInfoOpen && (
                            <div className="h-full w-[340px] shrink-0 animate-fade-in">
                                <InfoPanel
                                    data={currentConvo}
                                    onEmojiChange={(newEmoji) => setCurrentEmoji(newEmoji)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;