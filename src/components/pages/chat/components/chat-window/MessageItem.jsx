import React, { useState } from "react";
import { Image, Dropdown } from "antd";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";
import {
  FaReply,
  FaThumbtack,
  FaTrash,
  FaUndo,
  FaEllipsisH,
} from "react-icons/fa";
import { formatMessageTimeFull } from "../../../../../utils/date-format.util";

const getAttachmentUrl = (attachment, fallbackText = "") => {
  if (!attachment) return fallbackText || "";

  if (typeof attachment === "string") return attachment;

  return (
    attachment.url ||
    attachment.fileUrl ||
    attachment.file_url ||
    attachment.attachmentUrl ||
    attachment.attachment_url ||
    attachment.path ||
    attachment.filePath ||
    attachment.file_path ||
    fallbackText ||
    ""
  );
};

const getAttachmentName = (attachment) => {
  if (!attachment) return "Tệp đính kèm";

  if (typeof attachment === "string") {
    return attachment.split("/").pop() || "Tệp đính kèm";
  }

  return (
    attachment.name ||
    attachment.fileName ||
    attachment.file_name ||
    attachment.originalName ||
    attachment.original_name ||
    "Tệp đính kèm"
  );
};

const getAttachmentSize = (attachment) => {
  const size =
    attachment?.size ||
    attachment?.fileSize ||
    attachment?.file_size ||
    attachment?.contentLength;

  if (!size) return "";

  const sizeNumber = Number(size);

  if (Number.isNaN(sizeNumber)) return "";

  if (sizeNumber < 1024) return `${sizeNumber} B`;
  if (sizeNumber < 1024 * 1024) return `${(sizeNumber / 1024).toFixed(1)} KB`;

  return `${(sizeNumber / (1024 * 1024)).toFixed(1)} MB`;
};

const LINK_PATTERN =
  /(?<![\w@])((?:https?:\/\/|www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?:\/[^\s<]*)?)/gi;

const trimTrailingUrlPunctuation = (value) => {
  let result = value;
  while (result && ".,;:!?)\\]}\"'".includes(result.at(-1))) {
    result = result.slice(0, -1);
  }
  return result;
};

const normalizeUrl = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const getSeenDisplayName = (member) =>
  member?.nickname ||
  member?.display_name ||
  member?.displayName ||
  member?.username ||
  "Người dùng";

const getDeliveryStatusText = (seenBy = [], isGroup = false) => {
  const readers = Array.isArray(seenBy) ? seenBy : [];
  if (readers.length === 0) return "Đã gửi";
  if (!isGroup) return "Đã xem";
  return `${readers.map(getSeenDisplayName).join(", ")} đã xem`;
};

function LinkifiedText({ text, isOwn }) {
  if (typeof text !== "string" || !text) return text;

  const parts = [];
  let lastIndex = 0;
  let match;
  const linkPattern = new RegExp(LINK_PATTERN);

  while ((match = linkPattern.exec(text)) !== null) {
    const rawUrl = match[1];
    const url = trimTrailingUrlPunctuation(rawUrl);
    if (!url) continue;

    const start = match.index;
    const end = start + url.length;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <a
        key={`${url}-${start}`}
        href={normalizeUrl(url)}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
        className={`font-black underline underline-offset-2 transition-colors ${
          isOwn
            ? "text-white decoration-white/75 hover:text-white hover:decoration-white"
            : "text-slate-900 decoration-slate-400 hover:text-slate-700"
        }`}
      >
        {url}
      </a>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

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
          <span className="text-xs font-semibold text-gray-400">
            Đang tải ảnh...
          </span>
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

function ReplyPreview({ isOwn, senderName, text }) {
  return (
    <div
      className={`mb-1.5 flex max-w-[300px] items-start gap-2 rounded-2xl border bg-white px-3 py-2 text-left shadow-sm ${
        isOwn ? "mr-1 border-slate-200" : "ml-1 border-slate-200"
      }`}
    >
      <div className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-slate-300" />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700">
          <FaReply className="h-3 w-3 text-slate-400" />
          <span className="truncate">Trả lời {senderName || "Người dùng"}</span>
        </div>
        <div className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-slate-500">
          {text || "Tin nhắn"}
        </div>
      </div>
    </div>
  );
}

function getBubbleCornersClass(isOwn, isFirst, isLast) {
  if (isOwn) {
    if (isFirst && isLast) return "rounded-br-none";
    if (isFirst) return "rounded-br-none";
    if (isLast) return "rounded-tr-none";
    return "rounded-tr-none rounded-br-none";
  } else {
    if (isFirst && isLast) return "rounded-bl-none";
    if (isFirst) return "rounded-bl-none";
    if (isLast) return "rounded-tl-none";
    return "rounded-tl-none rounded-bl-none";
  }
}

export default function MessageItem({
  id,
  text,
  type = "TEXT",
  attachment,
  isOwn,
  avatar,
  showAvatar = true,
  senderName,
  showSenderName = false,
  isFirst = true,
  isLast = true,
  isFirstOfList = false,
  time,
  isReply,
  replyText,
  replySenderName,
  isPinned, // <--- THÊM prop ghim
  isRecalled, // <--- THÊM prop thu hồi
  isDeletedForMe,
  seenBy = [],
  showDeliveryStatus = false,
  isGroup = false,
  onContentLoad,
  onReply, // <--- THÊM các hàm callback xử lý sự kiện
  onPin,
  onRecall,
  onDelete,
  highlighted = false,
}) {
  const isImage = type === "IMAGE";
  const isFile = type === "FILE";
  const isDeletedMessage = isRecalled || isDeletedForMe;
  const attachmentUrl = getAttachmentUrl(attachment, text);
  const isStandaloneEmoji =
    type === "TEXT" &&
    typeof text === "string" &&
    text.trim().length > 0 &&
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(
      text.trim(),
    ) &&
    [...text.trim()].length <= 4;

  // <--- Trả lời tin nhắn, ghim tin nhắn, bỏ ghim, thu hồi
  const menuItems = isDeletedMessage
    ? []
    : [
        {
          key: "reply",
          label: "Trả lời",
          icon: <FaReply />,
          onClick: () =>
            onReply?.({
              id,
              text,
              type,
              attachment,
              senderName: isOwn ? "Bạn" : senderName || "Người dùng",
            }),
        },
        {
          key: "pin",
          label: isPinned ? "Bỏ ghim" : "Ghim tin nhắn",
          icon: <FaThumbtack />,
          onClick: () => onPin(id),
        },
        { type: "divider" },
        isOwn && {
          key: "recall",
          label: "Thu hồi",
          danger: true,
          icon: <FaUndo />,
          onClick: () => onRecall?.(id),
        },
        {
          key: "delete",
          label: "Xóa phía tôi",
          danger: true,
          icon: <FaTrash />,
          onClick: () => onDelete(id),
        },
      ].filter(Boolean);

  const spacingClass = isFirstOfList ? "mt-0" : isFirst ? "mt-5" : "mt-[5px]";
  const ownBubbleStyle = isOwn && !isStandaloneEmoji && !isImage && !isFile
    ? { background: "var(--chat-bubble-bg, #0033FF)" }
    : undefined;

  return (
    <div
      id={`message-${id}`}
      className={`group flex w-full rounded-2xl transition-colors duration-300 ${
        highlighted ? "bg-amber-100/70 px-2 py-1" : ""
      } ${spacingClass} ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isOwn && (
        <div className="mr-2 flex-shrink-0 self-end">
          {showAvatar ? (
            <img
              src={avatar || DEFAULT_AVATAR}
              className="h-9 w-9 rounded-full border border-gray-100 object-cover shadow-sm"
              alt=""
            />
          ) : (
            <div className="h-9 w-9" />
          )}
        </div>
      )}

      <div
        className={`flex max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}
      >
        {showSenderName && senderName && (
          <span className="mb-1 pl-2 text-[11px] font-bold text-gray-500">
            {senderName}
          </span>
        )}

        {/* <--- THÊM: Hàng chứa nút 3 chấm và bong bóng chat */}
        <div className="flex items-center gap-2">
          {/* <--- THÊM: Nút 3 chấm (Dropdown) */}
          {!isDeletedMessage && (
            <div
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isOwn ? "order-1" : "order-2"}`}
            >
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottom"
              >
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <FaEllipsisH size={14} />
                </button>
              </Dropdown>
            </div>
          )}

          <div className={`relative ${isOwn ? "order-2" : "order-1"}`}>
            {/* <--- SỬA: Thêm logic hiển thị khi bị THU HỒI */}
            {isDeletedMessage ? (
              <div className="rounded-[20px] px-4 py-2 border border-gray-200 text-gray-400 italic text-[14px] bg-white shadow-sm">
                {isRecalled ? "Tin nhắn đã thu hồi" : "Bạn đã xóa một tin nhắn"}
              </div>
            ) : (
              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                {isReply && (
                  <ReplyPreview
                    isOwn={isOwn}
                    senderName={replySenderName}
                    text={replyText}
                  />
                )}

                <div
                  style={ownBubbleStyle}
                  className={`relative break-words ${
                    isStandaloneEmoji
                      ? "px-1 py-1"
                      : isImage || isFile
                      ? ""
                      : `rounded-[20px] shadow-sm px-4 py-2 text-[15px] leading-snug ${
                          isOwn
                            ? `${getBubbleCornersClass(true, isFirst, isLast)} text-white`
                            : `${getBubbleCornersClass(false, isFirst, isLast)} bg-[#F0F2F5] text-[#050505]`
                        }`
                  }`}
                >
                  {isImage ? (
                    <ImageMessage
                      src={attachmentUrl}
                      alt="Ảnh tin nhắn"
                      onContentLoad={onContentLoad}
                    />
                  ) : isFile ? (
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-[230px] max-w-[300px] items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-3.5 py-3 text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
                      >
                        <span className="text-[10px] font-black">FILE</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-900">
                          {getAttachmentName(attachment)}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                          {getAttachmentSize(attachment) || "Tệp đính kèm"}
                        </p>
                      </div>
                    </a>
                  ) : isStandaloneEmoji ? (
                    <div className="px-1 py-1 text-[42px] leading-none drop-shadow-sm">
                      {text}
                    </div>
                  ) : (
                    <LinkifiedText text={text} isOwn={isOwn} />
                  )}

                  {/* <--- THÊM: Icon ghim nhỏ ở góc */}
                  {isPinned && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-blue-500 border border-blue-50">
                      <FaThumbtack size={10} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {time && (
          <span className="mt-1 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-tight">
            {formatMessageTimeFull(time)}
          </span>
        )}

        {showDeliveryStatus && !isDeletedMessage && (
          <span className="mt-1 max-w-[260px] truncate px-2 text-[11px] font-bold text-gray-400">
            {getDeliveryStatusText(seenBy, isGroup)}
          </span>
        )}
      </div>
    </div>
  );
}
