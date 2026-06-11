import { MESSAGE_TYPE } from "../../constants/chat.constants.js";
import { formatMessageTime, getTimestamp } from "../../utils/date-format.util.js";

const getMessageId = (message) =>
  message.id || message.message_id || `${Date.now()}-${Math.random()}`;

const getSenderId = (message) => message.sender_id || message.senderId;

const getCreatedAt = (message) => message.created_at || message.createdAt;

const getReplyToMessage = (message) =>
  message.reply_to_message || message.replyToMessage || null;

const getReplyToMessageId = (message) =>
  message.reply_to_message_id || message.replyToMessageId || null;

const getSeenBy = (message) => message.seen_by || message.seenBy || [];

const getMessageTimestamp = (message) =>
  getTimestamp(
    message?.createdAt ||
      message?.created_at ||
      message?.raw?.created_at ||
      message?.raw?.createdAt
  );

export const sortMessagesByCreatedAt = (messageList) =>
  [...messageList].sort((left, right) => {
    const diff = getMessageTimestamp(left) - getMessageTimestamp(right);
    if (diff !== 0) return diff;
    return String(left.id).localeCompare(String(right.id));
  });

export const mapMessageToUI = (message, currentUserId) => {
  const senderId = getSenderId(message);
  const createdAt = getCreatedAt(message);
  const replyToMessage = getReplyToMessage(message);
  const replyToMessageId = getReplyToMessageId(message);
  const isRecalled = Boolean(message.is_recalled || message.isRecalled);
  const isPinned = Boolean(message.is_pinned || message.isPinned);

  const getReplyPreview = () => {
    if (!replyToMessage) return "";
    if (replyToMessage.is_recalled || replyToMessage.isRecalled) {
      return "Tin nhắn đã thu hồi";
    }
    if (replyToMessage.type === MESSAGE_TYPE.image || replyToMessage.type === "IMAGE") {
      return "Hình ảnh";
    }
    if (replyToMessage.type === MESSAGE_TYPE.file || replyToMessage.type === "FILE") {
      return "Tệp đính kèm";
    }
    return replyToMessage.content || "";
  };

  return {
    id: getMessageId(message),
    text: isRecalled ? "" : message.content,
    type: message.type || MESSAGE_TYPE.text,
    attachment: message.attachment || null,
    isOwn: String(senderId) === String(currentUserId),
    senderId,
    createdAt,
    time: formatMessageTime(createdAt),
    isPinned,
    pinnedBy: message.pinned_by || message.pinnedBy || null,
    pinnedAt: message.pinned_at || message.pinnedAt || null,
    isRecalled,
    recalledAt: message.recalled_at || message.recalledAt || null,
    recalledBy: message.recalled_by || message.recalledBy || null,
    seenBy: getSeenBy(message),
    isReply: Boolean(replyToMessageId),
    replyToMessageId,
    replyToMessage,
    replySenderId: replyToMessage?.sender_id || replyToMessage?.senderId || null,
    replyText: getReplyPreview(),
    raw: message,
  };
};

