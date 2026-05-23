import { MESSAGE_TYPE } from "../../constants/chat.constants.js";
import { formatMessageTime, getTimestamp } from "../../utils/date-format.util.js";

const getMessageId = (message) =>
  message.id || message.message_id || `${Date.now()}-${Math.random()}`;

const getSenderId = (message) => message.sender_id || message.senderId;

const getCreatedAt = (message) => message.created_at || message.createdAt;

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

  return {
    id: getMessageId(message),
    text: message.content,
    type: message.type || MESSAGE_TYPE.text,
    attachment: message.attachment || null,
    isOwn: String(senderId) === String(currentUserId),
    createdAt,
    time: formatMessageTime(createdAt),
    raw: message,
  };
};

