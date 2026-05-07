import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, avatar }) {
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
        {messages.map((msg) => (
            <MessageItem
                key={msg.id}
                text={msg.text}
                type={msg.type}
                isOwn={msg.isOwn}
                avatar={avatar}
                time={msg.time}
                isReply={msg.isReply}
                replyText={msg.replyText}
            />
        ))}
      </div>
  );
}