import React from "react";
import { Image } from "antd";

const getAttachmentUrl = (attachment, text) =>
  attachment?.file_url || attachment?.fileUrl || text;

const getAttachmentName = (attachment) =>
  attachment?.file_name || attachment?.fileName || "Tệp đính kèm";

const getAttachmentSize = (attachment) => {
  const bytes = attachment?.file_size || attachment?.fileSize || 0;
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function MessageItem({
  text,
  type = "TEXT",
  attachment,
  isOwn,
  avatar,
  time,
  isReply,
  replyText,
  onContentLoad,
}) {
  const isImage = type === "IMAGE";
  const isFile = type === "FILE";
  const attachmentUrl = getAttachmentUrl(attachment, text);
  const isStandaloneEmoji =
    type === "TEXT" &&
    typeof text === "string" &&
    text.trim().length > 0 &&
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(text.trim()) &&
    [...text.trim()].length <= 4;

  return (
    <div className={`flex w-full mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="flex-shrink-0 mr-2 self-end">
          <img
            src={avatar || "/avatar-mac-dinh.jpg"}
            className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-sm"
            alt=""
          />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {isReply && (
          <div className="flex flex-col mb-[-10px] opacity-60 scale-95 origin-bottom-right">
            <div className="bg-gray-100 px-3 py-2 pb-4 rounded-t-2xl text-[13px] text-gray-500 italic border-l-4 border-blue-400">
              {replyText}
            </div>
          </div>
        )}

        {isImage ? (
          <Image
            src={attachmentUrl}
            alt="Ảnh tin nhắn"
            onLoad={onContentLoad}
            preview={{
              mask: "Xem ảnh",
            }}
            className="max-w-[260px] rounded-[20px] object-cover shadow-sm"
          />
        ) : isFile ? (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className={`flex min-w-[220px] max-w-[320px] items-center gap-3 rounded-[16px] px-4 py-3 text-left shadow-sm ${
              isOwn ? "bg-[#0084FF] text-white" : "bg-[#F0F2F5] text-[#050505]"
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isOwn ? "bg-white/20" : "bg-white"
            }`}>
              <span className="text-xs font-black">FILE</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{getAttachmentName(attachment)}</p>
              <p className={`text-xs ${isOwn ? "text-white/75" : "text-gray-500"}`}>
                {attachment?.mime_type || attachment?.mimeType || "File"} · {getAttachmentSize(attachment)}
              </p>
            </div>
          </a>
        ) : isStandaloneEmoji ? (
          <div className="px-1 py-1 text-[42px] leading-none drop-shadow-sm">
            {text}
          </div>
        ) : (
          <div
            className={`px-4 py-2 rounded-[20px] text-[15px] leading-snug shadow-sm break-words ${
              isOwn
                ? "bg-[#0084FF] text-white rounded-br-none"
                : "bg-[#F0F2F5] text-[#050505] rounded-bl-none"
            }`}
          >
            {text}
          </div>
        )}

        {time && (
          <span className="mt-1 px-1 text-[11px] font-medium text-gray-400">
            {isOwn ? `Đã gửi ${time}` : time}
          </span>
        )}
      </div>
    </div>
  );
}
