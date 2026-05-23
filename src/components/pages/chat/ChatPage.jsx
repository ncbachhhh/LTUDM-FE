import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import { CONVERSATION_TYPE } from "../../../constants/chat.constants.js";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import {
  applyPresenceToContact,
  mapConversationToContact,
  mapConversationsToContacts,
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

const ChatPage = () => {
  const { user } = useAuth();
  const { api } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const directUserId = searchParams.get("userId");
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
        return mapConversationToContact(updatedConversation, currentUserId);
      });
    },
    [currentUserId]
  );

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
        subscription = await WebSocketAPI.subscribeConversationUpdates((updatedConversation) => {
          if (!mounted || !updatedConversation?.id) return;
          updateCurrentConversation(updatedConversation);
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
  }, [currentUserId, updateCurrentConversation]);

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

  return (
    <div className="flex h-full w-full bg-[#E8EEFB] p-4 gap-4 overflow-hidden">
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
          <div className="flex h-full gap-4">
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
                  onConversationUpdated={updateCurrentConversation}
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
