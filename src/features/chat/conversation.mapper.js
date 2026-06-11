import { DEFAULT_AVATAR, GROUP_AVATAR } from "../../constants/asset.constants.js";
import {
  CONVERSATION_TYPE,
  DEFAULT_CONVERSATION_SETTINGS,
  DEFAULT_CONVERSATION_STATS,
  FRIENDSHIP_DIRECTION,
  FRIENDSHIP_STATUS,
  MESSAGE_TYPE,
} from "../../constants/chat.constants.js";
import { formatConversationTime, getTimestamp } from "../../utils/date-format.util.js";
import { getAvatarUrl, getDisplayName, getMemberId, getOnlineStatus } from "../../utils/identity.util.js";

export const getLatestMessage = (conversation) =>
  conversation?.latest_message || conversation?.latestMessage || null;

export const getConversationSortTime = (conversation) => {
  const latestMessage = getLatestMessage(conversation);

  return (
    latestMessage?.created_at ||
    latestMessage?.createdAt ||
    conversation?.created_at ||
    conversation?.createdAt ||
    ""
  );
};

export const sortConversations = (conversations) =>
  [...conversations].sort(
    (left, right) =>
      getTimestamp(getConversationSortTime(right)) -
      getTimestamp(getConversationSortTime(left))
  );

const getMessageSenderId = (message) => message?.sender_id || message?.senderId;

const getPreviewText = (conversation) => {
  const message = getLatestMessage(conversation);
  if (!message) return "Bấm để mở đoạn chat";

  if (message.type === MESSAGE_TYPE.image) return "Đã gửi một ảnh";
  if (message.type === MESSAGE_TYPE.file) {
    return message.attachment?.file_name || message.attachment?.fileName || "Đã gửi một file";
  }

  return message.content || "Bấm để mở đoạn chat";
};

const getPreviewSenderName = (conversation, currentUserId) => {
  const message = getLatestMessage(conversation);
  const senderId = getMessageSenderId(message);

  if (!senderId) return "";
  if (String(senderId) === String(currentUserId)) return "Bạn";

  const sender = (conversation.members || []).find(
    (member) => String(getMemberId(member)) === String(senderId)
  );

  return getDisplayName(sender);
};

const getConversationPreview = (conversation, currentUserId) => {
  const message = getLatestMessage(conversation);
  if (!message) return "Bấm để mở đoạn chat";

  const senderName = getPreviewSenderName(conversation, currentUserId);
  const previewText = getPreviewText(conversation);

  return senderName ? `${senderName}: ${previewText}` : previewText;
};

const getUnreadCount = (conversation) =>
  conversation?.unread_count || conversation?.unreadCount || 0;

export const mapConversationToContact = (conversation, currentUserId) => {
  const isGroup = conversation.type === CONVERSATION_TYPE.group;
  const blockedByCurrentUser = Boolean(
    conversation.blocked_by_current_user || conversation.blockedByCurrentUser
  );
  const currentUserBlocked = Boolean(
    conversation.current_user_blocked || conversation.currentUserBlocked
  );
  const friendshipStatus =
    conversation.friendship_status ||
    conversation.friendshipStatus ||
    FRIENDSHIP_STATUS.none;
  const friendshipDirection =
    conversation.friendship_direction ||
    conversation.friendshipDirection ||
    FRIENDSHIP_DIRECTION.none;
  const members = conversation.members || [];
  const otherMember = members.find(
    (member) => String(getMemberId(member)) !== String(currentUserId)
  );
  const displayName = isGroup
    ? conversation.display_name || conversation.displayName || conversation.title || "Nhóm chat"
    : getDisplayName(otherMember);
  const avatar = isGroup
    ? getAvatarUrl(conversation, GROUP_AVATAR)
    : getAvatarUrl(otherMember, DEFAULT_AVATAR);
  const isActive = !isGroup && getOnlineStatus(otherMember);
  const unreadCount = getUnreadCount(conversation);
  const mutedUntil = conversation.muted_until || conversation.mutedUntil || null;
  const emoji = conversation.emoji || "👍";

  return {
    id: conversation.id,
    conversation_id: conversation.id,
    conversationId: conversation.id,
    userId: isGroup ? null : getMemberId(otherMember),
    email: isGroup ? null : otherMember?.email,
    username: isGroup ? null : otherMember?.username,
    type: conversation.type,
    name: displayName,
    avatar,
    message: getConversationPreview(conversation, currentUserId),
    time: formatConversationTime(getConversationSortTime(conversation)),
    status: isGroup ? "Nhóm chat" : isActive ? "Trực tuyến" : "Ngoại tuyến",
    isActive,
    isGroup,
    friendshipStatus,
    friendshipDirection,
    blockedByCurrentUser,
    currentUserBlocked,
    canMessage:
      isGroup ||
      (!blockedByCurrentUser &&
        !currentUserBlocked &&
        friendshipStatus === FRIENDSHIP_STATUS.accepted),
    unreadCount,
    unread: unreadCount > 0,
    mutedUntil,
    isMuted: mutedUntil ? new Date(mutedUntil).getTime() > Date.now() : false,
    emoji,
    members,
    raw: conversation,
    stats: DEFAULT_CONVERSATION_STATS,
    settings: DEFAULT_CONVERSATION_SETTINGS,
  };
};

export const mapConversationsToContacts = (conversations, currentUserId) => {
  const mappedConversations = sortConversations(conversations).map((conversation) =>
    mapConversationToContact(conversation, currentUserId)
  );

  return {
    people: mappedConversations.filter((item) => !item.isGroup && !item.blockedByCurrentUser),
    groups: mappedConversations.filter((item) => item.isGroup),
  };
};

export const getRawConversations = (contacts) => [
  ...(contacts.people || []).map((item) => item.raw || item),
  ...(contacts.groups || []).map((item) => item.raw || item),
];

const mergeConversationPayload = (existingConversation, updatedConversation) => {
  const baseConversation = existingConversation?.raw || existingConversation || {};
  const mergedConversation = {
    ...baseConversation,
    ...updatedConversation,
  };

  const hasRelationshipState =
    updatedConversation.friendship_status != null ||
    updatedConversation.friendshipStatus != null;

  if (!hasRelationshipState) {
    mergedConversation.friendship_status =
      baseConversation.friendship_status ?? baseConversation.friendshipStatus;
    mergedConversation.friendshipStatus =
      baseConversation.friendshipStatus ?? baseConversation.friendship_status;
    mergedConversation.friendship_direction =
      baseConversation.friendship_direction ?? baseConversation.friendshipDirection;
    mergedConversation.friendshipDirection =
      baseConversation.friendshipDirection ?? baseConversation.friendship_direction;
    mergedConversation.blocked_by_current_user =
      baseConversation.blocked_by_current_user ?? baseConversation.blockedByCurrentUser;
    mergedConversation.blockedByCurrentUser =
      baseConversation.blockedByCurrentUser ?? baseConversation.blocked_by_current_user;
    mergedConversation.current_user_blocked =
      baseConversation.current_user_blocked ?? baseConversation.currentUserBlocked;
    mergedConversation.currentUserBlocked =
      baseConversation.currentUserBlocked ?? baseConversation.current_user_blocked;
  }

  return mergedConversation;
};

export const mergeConversation = (contacts, updatedConversation, currentUserId) => {
  const existingConversations = getRawConversations(contacts);
  const nextConversations = existingConversations.some(
    (conversation) => conversation.id === updatedConversation.id
  )
    ? existingConversations.map((conversation) =>
        conversation.id === updatedConversation.id
          ? mergeConversationPayload(conversation, updatedConversation)
          : conversation
      )
    : [updatedConversation, ...existingConversations];

  return mapConversationsToContacts(nextConversations, currentUserId);
};

export const mergeConversationForContact = (currentContact, updatedConversation, currentUserId) =>
  mapConversationToContact(
    mergeConversationPayload(currentContact, updatedConversation),
    currentUserId
  );

export const applyPresenceToContact = (contact, userId, online, currentUserId) => {
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
  const isOtherOnline = getOnlineStatus(otherMember);

  return {
    ...contact,
    members: nextMembers,
    raw: contact.raw ? { ...contact.raw, members: nextMembers } : contact.raw,
    isActive: isOtherOnline,
    status: isOtherOnline ? "Trực tuyến" : "Ngoại tuyến",
  };
};

