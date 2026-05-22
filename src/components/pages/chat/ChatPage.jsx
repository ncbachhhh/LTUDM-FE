import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "./components/chat-list/ChatList.jsx";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import InfoPanel from "./components/info-panel/InfoPanel.jsx";
import ChatWelcomeScreen from "./components/chat-window/ChatWelcomeScreen.jsx";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import WebSocketAPI from "../../../apis/websocket.api.jsx";
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
    const [searchParams, setSearchParams] = useSearchParams();
    const directUserId = searchParams.get("userId");

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

    const getLatestMessage = (conversation) => {
        return conversation?.latest_message || conversation?.latestMessage || null;
    };

    const getPreviewText = (conversation) => {
        const message = getLatestMessage(conversation);
        if (!message) return "Bấm để mở đoạn chat";

        if (message.type === "IMAGE") return "Đã gửi một ảnh";
        if (message.type === "FILE") {
            return message.attachment?.file_name ||
                message.attachment?.fileName ||
                "Đã gửi một file";
        }

        return message.content || "Bấm để mở đoạn chat";
    };

    const getMessageSenderId = (message) => {
        return message?.sender_id || message?.senderId;
    };

    const getMemberName = (member) => {
        return member?.nickname ||
            member?.display_name ||
            member?.displayName ||
            member?.username ||
            "Người dùng";
    };

    const getPreviewSenderName = (conversation) => {
        const message = getLatestMessage(conversation);
        const senderId = getMessageSenderId(message);

        if (!senderId) return "";
        if (String(senderId) === String(currentUserId)) return "Bạn";

        const sender = (conversation.members || []).find(
            (member) => String(getMemberId(member)) === String(senderId)
        );

        return getMemberName(sender);
    };

    const getConversationPreview = (conversation) => {
        const message = getLatestMessage(conversation);
        if (!message) return "Bấm để mở đoạn chat";

        const senderName = getPreviewSenderName(conversation);
        const previewText = getPreviewText(conversation);

        return senderName ? `${senderName}: ${previewText}` : previewText;
    };

    const getUnreadCount = (conversation) => {
        return conversation?.unread_count || conversation?.unreadCount || 0;
    };

    const getConversationSortTime = (conversation) => {
        const latestMessage = getLatestMessage(conversation);
        return latestMessage?.created_at ||
            latestMessage?.createdAt ||
            conversation?.created_at ||
            conversation?.createdAt ||
            "";
    };

    const sortConversations = (conversations) => {
        return [...conversations].sort((left, right) => {
            const leftTime = new Date(getConversationSortTime(left)).getTime() || 0;
            const rightTime = new Date(getConversationSortTime(right)).getTime() || 0;
            return rightTime - leftTime;
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
        const blockedByCurrentUser =
            Boolean(conversation.blocked_by_current_user || conversation.blockedByCurrentUser);
        const currentUserBlocked =
            Boolean(conversation.current_user_blocked || conversation.currentUserBlocked);
        const friendshipStatus =
            conversation.friendship_status || conversation.friendshipStatus || "NONE";
        const friendshipDirection =
            conversation.friendship_direction || conversation.friendshipDirection || "NONE";

        const members = conversation.members || [];

        const otherMember = members.find(
            (member) => String(getMemberId(member)) !== String(currentUserId)
        );

        const name = isGroup
            ? conversation.display_name ||
            conversation.displayName ||
            conversation.title ||
            "Nhóm chat"
            : otherMember?.nickname ||
            otherMember?.display_name ||
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

            message: getConversationPreview(conversation),
            time: formatConversationTime(getConversationSortTime(conversation)),
            status: isGroup
                ? "Nhóm chat"
                : isActive
                    ? "Trực tuyến"
                    : "Ngoại tuyến",

            isActive,
            isGroup,
            friendshipStatus,
            friendshipDirection,
            blockedByCurrentUser,
            currentUserBlocked,
            canMessage: isGroup || (!blockedByCurrentUser && !currentUserBlocked && friendshipStatus === "ACCEPTED"),
            unreadCount: getUnreadCount(conversation),
            unread: getUnreadCount(conversation) > 0,

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

            const mappedConversations = sortConversations(conversations).map(mapConversationToContact);

            setContacts({
                people: mappedConversations.filter((item) => !item.isGroup && !item.blockedByCurrentUser),
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

    useEffect(() => {
        let subscription = null;
        let mounted = true;

        const subscribeConversationUpdates = async () => {
            if (!currentUserId) return;

            try {
                subscription = await WebSocketAPI.subscribeConversationUpdates((updatedConversation) => {
                    if (!mounted || !updatedConversation?.id) return;

                    setContacts((previousContacts) => {
                        const existingConversations = [
                            ...previousContacts.people.map((item) => item.raw || item),
                            ...previousContacts.groups.map((item) => item.raw || item),
                        ];

                        const nextConversations = existingConversations.some(
                            (conversation) => conversation.id === updatedConversation.id
                        )
                            ? existingConversations.map((conversation) =>
                                conversation.id === updatedConversation.id
                                    ? updatedConversation
                                    : conversation
                            )
                            : [updatedConversation, ...existingConversations];

                        const mappedConversations = sortConversations(nextConversations)
                            .map(mapConversationToContact);

                        return {
                            people: mappedConversations.filter((item) => !item.isGroup && !item.blockedByCurrentUser),
                            groups: mappedConversations.filter((item) => item.isGroup),
                        };
                    });

                    setCurrentConvo((current) => {
                        if (!current || current.conversation_id !== updatedConversation.id) {
                            return current;
                        }
                        return mapConversationToContact(updatedConversation);
                    });
                });
            } catch (error) {
                console.error("SUBSCRIBE CONVERSATION UPDATES ERROR:", error);
            }
        };

        subscribeConversationUpdates();

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, [currentUserId]);

    const handleSelectContact = (id) => {
        const found =
            contacts.people.find((p) => p.id === id) ||
            contacts.groups.find((g) => g.id === id);

        if (found) {
            setCurrentConvo(found);
        }
    };

    const handleConversationUpdated = (updatedConversation) => {
        if (!updatedConversation?.id) return;

        setContacts((previousContacts) => {
            const existingConversations = [
                ...previousContacts.people.map((item) => item.raw || item),
                ...previousContacts.groups.map((item) => item.raw || item),
            ];

            const nextConversations = existingConversations.some(
                (conversation) => conversation.id === updatedConversation.id
            )
                ? existingConversations.map((conversation) =>
                    conversation.id === updatedConversation.id
                        ? updatedConversation
                        : conversation
                )
                : [updatedConversation, ...existingConversations];

            const mappedConversations = sortConversations(nextConversations)
                .map(mapConversationToContact);

            return {
                people: mappedConversations.filter((item) => !item.isGroup && !item.blockedByCurrentUser),
                groups: mappedConversations.filter((item) => item.isGroup),
            };
        });

        setCurrentConvo((current) => {
            if (!current || current.conversation_id !== updatedConversation.id) {
                return current;
            }

            return mapConversationToContact(updatedConversation);
        });
    };

    const applyPresenceToContact = (contact, userId, online) => {
        if (contact.isGroup) return contact;

        const nextMembers = (contact.members || []).map((member) => {
            if (String(getMemberId(member)) !== String(userId)) return member;
            return {
                ...member,
                is_online: online,
                online,
                isActive: online,
                is_active: online,
            };
        });

        const otherMember = nextMembers.find(
            (member) => String(getMemberId(member)) !== String(currentUserId)
        );
        const isOtherOnline = getMemberOnlineStatus(otherMember);

        return {
            ...contact,
            members: nextMembers,
            raw: contact.raw
                ? {
                    ...contact.raw,
                    members: nextMembers,
                  }
                : contact.raw,
            isActive: isOtherOnline,
            status: isOtherOnline ? "Trực tuyến" : "Ngoại tuyến",
        };
    };

    useEffect(() => {
        const handlePresenceUpdate = (event) => {
            const userId = event.detail?.user_id || event.detail?.userId;
            const online = Boolean(event.detail?.is_online ?? event.detail?.online);
            if (!userId || String(userId) === String(currentUserId)) return;

            setContacts((previousContacts) => ({
                people: previousContacts.people.map((contact) =>
                    applyPresenceToContact(contact, userId, online)
                ),
                groups: previousContacts.groups.map((contact) =>
                    applyPresenceToContact(contact, userId, online)
                ),
            }));

            setCurrentConvo((current) => {
                if (!current) return current;
                return applyPresenceToContact(current, userId, online);
            });
        };

        window.addEventListener("presence:update", handlePresenceUpdate);
        return () => window.removeEventListener("presence:update", handlePresenceUpdate);
    }, [currentUserId]);

    const findDirectContactByUserId = (userId) => {
        return contacts.people.find((contact) => {
            const members = contact.raw?.members || contact.members || [];
            return members.some(
                (member) => String(getMemberId(member)) === String(userId)
            );
        });
    };

    const handleOpenDirectConversation = async (userId) => {
        if (!userId) return;

        const existingContact = findDirectContactByUserId(userId);
        if (existingContact) {
            setCurrentConvo(existingContact);
            return;
        }

        const result = await ConversationAPI.createConversation({
            type: "DIRECT",
            member_ids: [userId],
        });

        if (!result.isSuccess) {
            api.error({
                message: "Không mở được đoạn chat",
                description: result.message,
                placement: "topRight",
            });
            return;
        }

        const mappedConversation = mapConversationToContact(result.data);
        handleConversationUpdated(result.data);
        setCurrentConvo(mappedConversation);
    };

    useEffect(() => {
        if (!directUserId || !currentUserId) return undefined;

        let cancelled = false;

        const timerId = window.setTimeout(async () => {
            await handleOpenDirectConversation(directUserId);

            if (cancelled) return;

            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("userId");
            setSearchParams(nextParams, { replace: true });
        }, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(timerId);
        };
    }, [directUserId, currentUserId]);

    return (
        <div className="flex h-full w-full bg-[#E8EEFB] p-6 gap-6 overflow-hidden">
            <div className="chat-list-panel h-full w-[320px] shrink-0">
                <ChatList
                    contacts={contacts}
                    loading={loadingConversations}
                    currentConvoId={currentConvo?.id}
                    onSelect={handleSelectContact}
                    onOpenDirectConversation={handleOpenDirectConversation}
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
                                    onConversationUpdated={handleConversationUpdated}
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
