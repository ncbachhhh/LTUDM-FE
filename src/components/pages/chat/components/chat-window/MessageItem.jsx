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
import { formatRelativeTime } from "../../../../../utils/date-format.util";

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

export default function MessageItem({
  id,
  text,
  type = "TEXT",
  attachment,
  isOwn,
  avatar,
  time,
  isReply,
  replyText,
  isPinned, // <--- THÊM prop ghim
  isRecalled, // <--- THÊM prop thu hồi
  isDeletedForMe,
  onContentLoad,
  onReply, // <--- THÊM các hàm callback xử lý sự kiện
  onPin,
  onRecall,
  onDelete,
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
              senderName: isOwn ? "Bạn" : "Người dùng",
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
          onClick: () =>
            onRecall?.({
              id,
              text,
              type,
              attachment,
              isOwn,
            }),
        },
        {
          key: "delete",
          label: "Xóa phía tôi",
          danger: true,
          icon: <FaTrash />,
          onClick: () => onDelete(id),
        },
      ].filter(Boolean);

  return (
    <div
      id={`message-${id}`}
      className={`group flex w-full mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isOwn && (
        <div className="mr-2 flex-shrink-0 self-end">
          <img
            src={avatar || DEFAULT_AVATAR}
            className="h-9 w-9 rounded-full border border-gray-100 object-cover shadow-sm"
            alt=""
          />
        </div>
      )}

      <div
        className={`flex max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}
      >
        {isReply && (
          <div className="mb-[-10px] flex origin-bottom-right scale-95 flex-col opacity-60">
            <div className="rounded-t-2xl border-l-4 border-blue-400 bg-gray-100 px-3 py-2 pb-4 text-[13px] italic text-gray-500">
              {replyText}
            </div>
          </div>
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
                {isOwn ? "Bạn đã xóa một tin nhắn" : "Tin nhắn đã bị xóa"}
              </div>
            ) : (
              // <--- SỬA: Đóng gói toàn bộ nội dung tin nhắn vào 1 khối logic chuẩn
              <div
                className={`relative break-words rounded-[20px] shadow-sm ${
                  isImage || isStandaloneEmoji
                    ? ""
                    : "px-4 py-2 text-[15px] leading-snug"
                } ${isOwn ? "rounded-br-none bg-[#0084FF] text-white" : "rounded-bl-none bg-[#F0F2F5] text-[#050505]"}`}
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
                    className="flex items-center gap-3 p-1"
                  >
                    <div
                      className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl ${isOwn ? "bg-white/20" : "bg-white"}`}
                    >
                      <span className="text-[10px] font-black">FILE</span>
                    </div>
                    <div className="truncate">
                      <p className="truncate text-sm font-bold">
                        {getAttachmentName(attachment)}
                      </p>
                      <p
                        className={`text-[10px] ${isOwn ? "text-white/70" : "text-gray-500"}`}
                      >
                        {getAttachmentSize(attachment)}
                      </p>
                    </div>
                  </a>
                ) : isStandaloneEmoji ? (
                  <div className="px-1 py-1 text-[42px] leading-none drop-shadow-sm">
                    {text}
                  </div>
                ) : (
                  text
                )}

                {/* <--- THÊM: Icon ghim nhỏ ở góc */}
                {isPinned && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-blue-500 border border-blue-50">
                    <FaThumbtack size={10} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {time && (
          <span className="mt-1 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-tight">
            {formatRelativeTime(time)}
          </span>
        )}
      </div>
    </div>
  );
}
