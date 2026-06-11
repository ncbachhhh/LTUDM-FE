import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import { CONVERSATION_TYPE } from "../../../constants/chat.constants.js";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import {
  applyPresenceToContact,
  mapConversationToContact,
  mapConversationsToContacts,
  mergeConversationForContact,
  mergeConversation,
} from "../../../features/chat/conversation.mapper.js";
import { getCurrentUserId, getMemberId } from "../../../utils/identity.util.js";
import WebSocketAPI from "../../../apis/websocket.api.jsx";
import ChatList from "./components/chat-list/ChatList.jsx";
import ChatWelcomeScreen from "./components/chat-window/ChatWelcomeScreen.jsx";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import InfoPanel from "./components/info-panel/InfoPanel.jsx";

const emptyContacts = {
  people: [],
  groups: [],
};

const getConversationRealtimeEventType = (payload) =>
  payload?.event_type || payload?.eventType || null;

const getConversationRealtimeId = (payload) =>
  payload?.conversation_id ||
  payload?.conversationId ||
  payload?.conversation?.id ||
  payload?.id;

const getConversationRealtimeData = (payload) => payload?.conversation || payload;

const ChatPage = () => {
  const { user } = useAuth();
  const { api } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const directUserId = searchParams.get("userId");
  const directGroupId = searchParams.get("groupId");
  const currentUserId = getCurrentUserId(user);

  const [contacts, setContacts] = useState(emptyContacts);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [currentEmoji, setCurrentEmoji] = useState("👍");
  const [loadingConversations, setLoadingConversations] = useState(false);

  const updateCurrentConversation = useCallback(
    (updatedConversation) => {
      if (!updatedConversation?.id) return;

      setContacts((previousContacts) =>
        mergeConversation(previousContacts, updatedConversation, currentUserId)
      );

      setCurrentConvo((current) => {
        if (!current || current.conversation_id !== updatedConversation.id) return current;
        return mergeConversationForContact(current, updatedConversation, currentUserId);
      });
    },
    [currentUserId]
  );

  const removeConversation = useCallback((conversationId) => {
    if (!conversationId) return;

    setContacts((previousContacts) => ({
      people: previousContacts.people.filter(
        (contact) => String(contact.conversation_id) !== String(conversationId)
      ),
      groups: previousContacts.groups.filter(
        (contact) => String(contact.conversation_id) !== String(conversationId)
      ),
    }));

    setCurrentConvo((current) =>
      current && String(current.conversation_id) === String(conversationId) ? null : current
    );
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    setLoadingConversations(true);
    const result = await ConversationAPI.getMyConversations();
    setLoadingConversations(false);

    if (!result.isSuccess) {
      api.error({
        message: "Không lấy được danh sách hội thoại",
        description: result.message,
        placement: "topRight",
      });
      return;
    }

    const conversations = Array.isArray(result.data) ? result.data : [];
    const mappedContacts = mapConversationsToContacts(conversations, currentUserId);

    setContacts(mappedContacts);
    setCurrentConvo((current) => {
      if (!current) return current;

      return (
        [...mappedContacts.people, ...mappedContacts.groups].find(
          (item) => item.conversation_id === current.conversation_id
        ) || null
      );
    });
  }, [api, currentUserId]);

  useEffect(() => {
    const timerId = window.setTimeout(fetchConversations, 0);
    return () => window.clearTimeout(timerId);
  }, [fetchConversations]);

  useEffect(() => {
    let subscription = null;
    let mounted = true;

    const subscribeConversationUpdates = async () => {
      if (!currentUserId) return;

      try {
        subscription = await WebSocketAPI.subscribeConversationUpdates((payload) => {
          if (!mounted) return;

          const eventType = getConversationRealtimeEventType(payload);
          const conversationId = getConversationRealtimeId(payload);

          if (eventType === "CONVERSATION_REMOVED") {
            removeConversation(conversationId);
            window.dispatchEvent(new CustomEvent("conversation:changed", { detail: payload }));
            return;
          }

          const updatedConversation = getConversationRealtimeData(payload);
          if (!updatedConversation?.id) return;

          updateCurrentConversation(updatedConversation);
          if (eventType) {
            window.dispatchEvent(new CustomEvent("conversation:changed", { detail: payload }));
          }
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
  }, [currentUserId, removeConversation, updateCurrentConversation]);

  useEffect(() => {
    const handlePresenceUpdate = (event) => {
      const userId = event.detail?.user_id || event.detail?.userId;
      const online = Boolean(event.detail?.is_online ?? event.detail?.online);
      if (!userId || String(userId) === String(currentUserId)) return;

      setContacts((previousContacts) => ({
        people: previousContacts.people.map((contact) =>
          applyPresenceToContact(contact, userId, online, currentUserId)
        ),
        groups: previousContacts.groups.map((contact) =>
          applyPresenceToContact(contact, userId, online, currentUserId)
        ),
      }));

      setCurrentConvo((current) =>
        current ? applyPresenceToContact(current, userId, online, currentUserId) : current
      );
    };

    window.addEventListener("presence:update", handlePresenceUpdate);
    return () => window.removeEventListener("presence:update", handlePresenceUpdate);
  }, [currentUserId]);

  const handleSelectContact = (id) => {
    const found =
      contacts.people.find((contact) => contact.id === id) ||
      contacts.groups.find((contact) => contact.id === id);

    if (found) {
      setCurrentConvo(found);
    }
  };

  const findDirectContactByUserId = useCallback(
    (userId) =>
      contacts.people.find((contact) => {
        const members = contact.raw?.members || contact.members || [];
        return members.some((member) => String(getMemberId(member)) === String(userId));
      }),
    [contacts.people]
  );

  const handleOpenDirectConversation = useCallback(
    async (userId) => {
      if (!userId) return;

      const existingContact = findDirectContactByUserId(userId);
      if (existingContact) {
        setCurrentConvo(existingContact);
        return;
      }

      const result = await ConversationAPI.createConversation({
        type: CONVERSATION_TYPE.direct,
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

      const mappedConversation = mapConversationToContact(result.data, currentUserId);
      updateCurrentConversation(result.data);
      setCurrentConvo(mappedConversation);
    },
    [api, currentUserId, findDirectContactByUserId, updateCurrentConversation]
  );

  const handleCreateGroupConversation = useCallback(
    async (title, memberIds, avatarFile) => {
      // 1. Call API to create group
      const result = await ConversationAPI.createConversation({
        type: CONVERSATION_TYPE.group,
        title: title,
        member_ids: memberIds,
      });

      if (!result.isSuccess) {
        api.error({
          message: "Tạo nhóm thất bại",
          description: result.message,
          placement: "topRight",
        });
        return { isSuccess: false };
      }

      let newConvoData = result.data;
      const conversationId = newConvoData.id;

      // 2. Upload avatar if selected
      if (avatarFile) {
        const avatarResult = await ConversationAPI.uploadGroupAvatar(conversationId, avatarFile);
        if (avatarResult.isSuccess) {
          // Update the avatar url on newConvoData
          newConvoData = {
            ...newConvoData,
            avatar_url: avatarResult.data?.avatar_url || avatarResult.data?.avatarUrl,
            avatarUrl: avatarResult.data?.avatarUrl || avatarResult.data?.avatar_url,
          };
        } else {
          api.warning({
            message: "Tải ảnh nhóm thất bại",
            description: avatarResult.message,
            placement: "topRight",
          });
        }
      }

      // 3. Update UI contacts list & focus
      const mappedConversation = mapConversationToContact(newConvoData, currentUserId);
      
      setContacts((previousContacts) =>
        mergeConversation(previousContacts, newConvoData, currentUserId)
      );

      setCurrentConvo(mappedConversation);

      api.success({
        message: "Tạo nhóm thành công",
        description: `Nhóm "${title}" đã được tạo!`,
        placement: "topRight",
      });

      return { isSuccess: true };
    },
    [api, currentUserId]
  );

  const handleDeleteConversationForMe = useCallback(
    async (conversationId) => {
      const result = await ConversationAPI.deleteConversationForMe(conversationId);

      if (!result.isSuccess) {
        api.error({
          message: "Xóa đoạn chat thất bại",
          description: result.message,
          placement: "topRight",
        });
        return false;
      }

      removeConversation(conversationId);
      api.success({
        message: "Đã xóa đoạn chat",
        description: "Lịch sử tin nhắn hiện tại đã được ẩn với bạn.",
        placement: "topRight",
      });
      return true;
    },
    [api, removeConversation]
  );

  const handleBlockUser = useCallback(
    async (userId, conversationId) => {
      const result = await FriendshipAPI.blockUser(userId);

      if (!result.isSuccess) {
        api.error({
          message: "Chặn người dùng thất bại",
          description: result.message,
          placement: "topRight",
        });
        return false;
      }

      removeConversation(conversationId);
      api.success({
        message: "Đã chặn người dùng",
        placement: "topRight",
      });
      return true;
    },
    [api, removeConversation]
  );

  const handleEmojiChange = useCallback(
    async (emoji) => {
      const conversationId = currentConvo?.conversation_id || currentConvo?.conversationId || currentConvo?.id;
      if (!conversationId) return;

      const result = await ConversationAPI.updateEmoji(conversationId, emoji);
      if (!result.isSuccess) {
        api.error({
          message: "Cập nhật biểu tượng thất bại",
          description: result.message,
          placement: "topRight",
        });
        return;
      }

      setCurrentEmoji(emoji);
      if (result.data) {
        updateCurrentConversation(result.data);
      }
    },
    [api, currentConvo, updateCurrentConversation],
  );

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
  }, [currentUserId, directUserId, handleOpenDirectConversation, searchParams, setSearchParams]);

  useEffect(() => {
    if (!directGroupId || contacts.groups.length === 0) return;

    const timerId = window.setTimeout(() => {
      const foundGroup = contacts.groups.find(
        (group) => String(group.id) === String(directGroupId)
      );

      if (foundGroup) {
        setCurrentConvo(foundGroup);
      }

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("groupId");
      setSearchParams(nextParams, { replace: true });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [directGroupId, contacts.groups, searchParams, setSearchParams]);

  return (
    <div className="flex h-full w-full bg-[#E9ECF6] p-4 gap-4 overflow-hidden">
      <div className="chat-list-panel h-full w-[320px] shrink-0">
        <ChatList
          contacts={contacts}
          loading={loadingConversations}
          currentConvoId={currentConvo?.id}
          onSelect={handleSelectContact}
          onOpenDirectConversation={handleOpenDirectConversation}
          onCreateGroup={handleCreateGroupConversation}
          onDeleteConversation={handleDeleteConversationForMe}
          onBlockUser={handleBlockUser}
        />
      </div>

      <div className="h-full flex-1">
        {!currentConvo ? (
          <div className="h-full rounded-2xl">
            <ChatWelcomeScreen />
          </div>
        ) : (
          <div className="flex h-full gap-4">
            <div className="flex-1 h-full">
              <ChatWindow
                data={currentConvo}
                isInfoOpen={isInfoOpen}
                setIsInfoOpen={setIsInfoOpen}
                currentEmoji={currentConvo?.emoji || currentEmoji}
              />
            </div>

            {isInfoOpen && (
              <div className="h-full w-[340px] shrink-0 animate-fade-in">
                <InfoPanel
                  data={currentConvo}
                  currentUserId={currentUserId}
                  onEmojiChange={handleEmojiChange}
                  onConversationUpdated={updateCurrentConversation}
                  onConversationRemoved={removeConversation}
                  contacts={contacts}                           
                  onCreateGroup={handleCreateGroupConversation} 
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
