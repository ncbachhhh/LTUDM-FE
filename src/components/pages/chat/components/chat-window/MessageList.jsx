import React from "react";
import MessageItem from "./MessageItem";
import { getMemberId, getAvatarUrl, getDisplayName } from "../../../../../utils/identity.util.js";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";
import { parseApiDate } from "../../../../../utils/date-format.util.js";

export default function MessageList({
  messages,
  avatar,
  members = [],
  isGroup = false,
  onContentLoad,
  onReply,
  onPin,
  onRecall,
  onDelete,
  highlightedMessageId,
}) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="mt-10 text-center text-sm text-gray-300">
          Bắt đầu cuộc trò chuyện...
        </div>
      </div>
    );
  }

  const getMsgTimestamp = (msg) => {
    if (!msg) return 0;
    const dateObj = parseApiDate(msg.createdAt || msg.created_at || msg.time);
    return dateObj ? dateObj.getTime() : 0;
  };

  return (
    <div className="flex flex-col p-6">
      {messages.map((message, index) => {
        const currentSenderId = message.senderId || message.sender_id || message.raw?.senderId || message.raw?.sender_id || (message.isOwn ? 'me' : 'other');
        
        const nextMessage = messages[index + 1];
        const nextSenderId = nextMessage ? (nextMessage.senderId || nextMessage.sender_id || nextMessage.raw?.senderId || nextMessage.raw?.sender_id || (nextMessage.isOwn ? 'me' : 'other')) : null;
        
        const isSameSender = nextMessage && String(currentSenderId) === String(nextSenderId);
        
        let showTime = true;
        if (isSameSender) {
          const currentTime = getMsgTimestamp(message);
          const nextTime = getMsgTimestamp(nextMessage);
          const timeDiff = nextTime - currentTime;
          // Hide timestamp if consecutive messages from same sender are within 10 minutes
          if (timeDiff > 0 && timeDiff < 10 * 60 * 1000) {
            showTime = false;
          }
        }

        // Logic for showAvatar: only show avatar on the first message of consecutive messages within 10 minutes
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const prevSenderId = prevMessage ? (prevMessage.senderId || prevMessage.sender_id || prevMessage.raw?.senderId || prevMessage.raw?.sender_id || (prevMessage.isOwn ? 'me' : 'other')) : null;
        const isPrevSameSender = prevMessage && String(currentSenderId) === String(prevSenderId);

        let showAvatar = true;
        if (isPrevSameSender) {
          const currentTime = getMsgTimestamp(message);
          const prevTime = getMsgTimestamp(prevMessage);
          const timeDiff = currentTime - prevTime;
          if (timeDiff > 0 && timeDiff < 10 * 60 * 1000) {
            showAvatar = false;
          }
        }

        // Find specific sender's avatar and name from members
        const sender = (members || []).find(m => String(getMemberId(m)) === String(currentSenderId));
        const senderAvatar = sender ? getAvatarUrl(sender, DEFAULT_AVATAR) : avatar;
        const senderName = sender ? getDisplayName(sender) : "Người dùng";
        const replySender = (members || []).find(m => String(getMemberId(m)) === String(message.replySenderId));
        const replySenderName = replySender ? getDisplayName(replySender) : message.replySenderName || "Người dùng";
        const showSenderName = !message.isOwn && isGroup && showAvatar;
        const isLastMessage = index === messages.length - 1;

        return (
          <MessageItem
            key={message.id}
            id={message.id}
            text={message.text || message.content}
            type={message.type}
            attachment={message.attachment}
            isOwn={message.isOwn}
            avatar={senderAvatar}
            showAvatar={showAvatar}
            senderName={senderName}
            showSenderName={showSenderName}
            isFirst={showAvatar}
            isLast={showTime}
            isFirstOfList={index === 0}
            time={showTime ? (message.createdAt || message.created_at || message.time) : null}
            isReply={message.isReply}
            replyText={message.replyText}
            replySenderName={replySenderName}
            isPinned={message.isPinned}
            isRecalled={message.isRecalled}
            isDeletedForMe={message.isDeletedForMe}
            seenBy={message.seenBy}
            showDeliveryStatus={isLastMessage && message.isOwn}
            isGroup={isGroup}
            message={message}
            onContentLoad={onContentLoad}
            onReply={onReply}
            onPin={onPin}
            onRecall={onRecall}
            onDelete={onDelete}
            highlighted={String(highlightedMessageId) === String(message.id)}
          />
        );
      })}
    </div>
  );
}
