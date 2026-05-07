import React from "react";

export default function MessageItem({
                                      text,
                                      isOwn,
                                      avatar,
                                      time,
                                      isReply,
                                      replyText,
                                    }) {
  return (
      <div
          className={`flex w-full mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
      >
        {!isOwn && (
            <div className="flex-shrink-0 mr-2 self-end">
              <img
                  src={avatar || "/avatar-mac-dinh.jpg"}
                  className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-sm"
                  alt="Avatar"
              />
            </div>
        )}

        <div
            className={`flex flex-col max-w-[75%] ${
                isOwn ? "items-end" : "items-start"
            }`}
        >
          {isReply && (
              <div className="flex flex-col mb-[-10px] opacity-60 scale-95 origin-bottom-right">
                <div className="bg-gray-100 px-3 py-2 pb-4 rounded-t-2xl text-[13px] text-gray-500 italic border-l-4 border-blue-400">
                  {replyText}
                </div>
              </div>
          )}

          <div
              className={`px-4 py-2 rounded-[20px] text-[15px] leading-snug shadow-sm break-words
            ${
                  isOwn
                      ? "bg-[#0084FF] text-white rounded-br-none"
                      : "bg-[#F0F2F5] text-[#050505] rounded-bl-none"
              }`}
          >
            {text}
          </div>

          {time && (
              <span className="mt-1 px-1 text-[11px] font-medium text-gray-400">
            {isOwn ? `Đã gửi ${time}` : time}
          </span>
          )}
        </div>
      </div>
  );
}