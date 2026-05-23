import React, { useState } from "react";
import { Image } from "antd";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";

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

function ImageMessage({ src, alt, onContentLoad }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const finishLoading = () => {
    setLoading(false);
    onContentLoad?.();
  };

  if (failed) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="flex h-[180px] w-[260px] items-center justify-center rounded-[20px] bg-gray-100 px-4 text-center text-sm font-semibold text-gray-500 shadow-sm"
      >
        Không tải được ảnh. Bấm để mở.
      </a>
    );
  }

  return (
    <div className="relative h-[180px] w-[260px] overflow-hidden rounded-[20px] bg-gray-100 shadow-sm">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-[#0084FF]" />
          <span className="text-xs font-semibold text-gray-400">Đang tải ảnh...</span>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        onLoad={finishLoading}
        onError={() => {
          setFailed(true);
          finishLoading();
        }}
        preview={{
          mask: "Xem ảnh",
        }}
        wrapperClassName="h-full w-full"
        className={`h-full w-full object-cover transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}

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
        <div className="mr-2 flex-shrink-0 self-end">
          <img
            src={avatar || DEFAULT_AVATAR}
            className="h-9 w-9 rounded-full border border-gray-100 object-cover shadow-sm"
            alt=""
          />
        </div>
      )}

      <div className={`flex max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {isReply && (
          <div className="mb-[-10px] flex origin-bottom-right scale-95 flex-col opacity-60">
            <div className="rounded-t-2xl border-l-4 border-blue-400 bg-gray-100 px-3 py-2 pb-4 text-[13px] italic text-gray-500">
              {replyText}
            </div>
          </div>
        )}

        {isImage ? (
          <ImageMessage src={attachmentUrl} alt="Ảnh tin nhắn" onContentLoad={onContentLoad} />
        ) : isFile ? (
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className={`flex min-w-[220px] max-w-[320px] items-center gap-3 rounded-[16px] px-4 py-3 text-left shadow-sm ${
              isOwn ? "bg-[#0084FF] text-white" : "bg-[#F0F2F5] text-[#050505]"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isOwn ? "bg-white/20" : "bg-white"
              }`}
            >
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
          <div className="px-1 py-1 text-[42px] leading-none drop-shadow-sm">{text}</div>
        ) : (
          <div
            className={`break-words rounded-[20px] px-4 py-2 text-[15px] leading-snug shadow-sm ${
              isOwn
                ? "rounded-br-none bg-[#0084FF] text-white"
                : "rounded-bl-none bg-[#F0F2F5] text-[#050505]"
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

