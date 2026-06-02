import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({
  messages,
  avatar,
  onContentLoad,
  onReply,
  onPin,
  onRecall,
  onDelete,
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

  return (
    <div className="flex flex-col gap-2 p-6">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          text={message.text || message.content}
          type={message.type}
          attachment={message.attachment}
          isOwn={message.isOwn}
          avatar={avatar}
          time={message.createdAt || message.created_at || message.time}
          isReply={message.isReply}
          replyText={message.replyText}
          replySenderName={message.replySenderName}
          isPinned={message.isPinned}
          isRecalled={message.isRecalled}
          isDeletedForMe={message.isDeletedForMe}
          message={message}
          onContentLoad={onContentLoad}
          onReply={onReply}
          onPin={onPin}
          onRecall={onRecall}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
