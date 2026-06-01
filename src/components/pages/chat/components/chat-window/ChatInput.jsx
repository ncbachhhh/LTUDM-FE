import React, { useRef, useState } from "react";
import { Tooltip } from "antd";
import { FaPaperPlane, FaPaperclip, FaImage } from "react-icons/fa";
import { useNotification } from "../../../../../contexts/notification.context.jsx";

export default function ChatInput({
  currentEmoji = "👍",
  onSendMessage,
  onSendFileMessage,
  replyingMsg,
  onCancelReply,
}) {
  const { api } = useNotification();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasText = text.trim() !== "";

  const handleSendMessage = async () => {
    const content = text.trim();
    if (!content || loading) return;

    setLoading(true);
    try {
      const result = await onSendMessage(content, replyingMsg?.id);

      if (result?.isSuccess) {
        setText("");
        onCancelReply?.(); // thêm dòng này để bỏ thanh "Trả lời"
      } else {
        api.error({
          message: "Gửi tin nhắn thất bại",
          description: result?.message || "Có lỗi xảy ra khi gửi tin nhắn",
          placement: "topRight",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmoji = async () => {
    if (hasText || loading || !currentEmoji) return;

    setLoading(true);
    const result = await onSendMessage(currentEmoji);
    setLoading(false);

    if (!result?.isSuccess) {
      api.error({
        message: "Gửi biểu tượng thất bại",
        description: result?.message || "Có lỗi xảy ra khi gửi tin nhắn",
        placement: "topRight",
      });
    }
  };

  const handleFileChange = async (event, type) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Reset input để có thể chọn lại cùng file

    if (!file || loading) return;

    setLoading(true);
    const result = await onSendFileMessage?.(file, type);
    setLoading(false);

    if (!result?.isSuccess) {
      api.error({
        message: type === "IMAGE" ? "Gửi ảnh thất bại" : "Gửi file thất bại",
        description: result?.message || "Có lỗi xảy ra khi gửi tệp",
        placement: "topRight",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && hasText) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getReplyPreview = (message) => {
    if (!message) return "";

    if (message.type === "IMAGE") return "Hình ảnh";
    if (message.type === "FILE") return "Tệp đính kèm";

    return message.text || message.content || "";
  };

  return (
    <div className="border-t border-gray-50 px-6 py-3">
      {/* Reply tin nhắn */}
      {replyingMsg && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-[#eef1f6] px-4 py-3">
          <div className="min-w-0 border-l-4 border-blue-500 pl-3">
            <div className="text-sm font-semibold text-slate-700">
              Trả lời {replyingMsg.senderName || "Người dùng"}
            </div>

            <div className="truncate text-sm text-slate-500">
              {getReplyPreview(replyingMsg)}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancelReply}
            className="ml-3 shrink-0 rounded-full px-2 text-xl text-slate-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Hàng nhập tin nhắn */}
      <div className="flex items-center gap-5 border-t border-gray-50 px-6 py-0">
        {/* Nút đính kèm file */}
        <Tooltip title="Gửi file" placement="top">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <FaPaperclip className="h-[22px] w-[22px]" />
          </button>
        </Tooltip>

        {/* Nút đính kèm ảnh */}
        <Tooltip title="Gửi ảnh" placement="top">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <FaImage className="h-[22px] w-[22px]" />
          </button>
        </Tooltip>

        {/* Input ẩn cho file và ảnh */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e, "FILE")}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e, "IMAGE")}
        />

        {/* Ô nhập tin nhắn */}
        <div className="flex-1 flex rounded-full bg-[#0033FF]/5 items-center overflow-hidden">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full px-6 py-4 bg-transparent text-sm font-medium outline-none"
            placeholder="Nhập tin nhắn..."
            disabled={loading}
          />
        </div>

        {/* Nút gửi: emoji hoặc mũi tên gửi */}
        <button
          type="button"
          disabled={loading}
          onClick={hasText ? handleSendMessage : handleSendEmoji}
          className={`text-3xl text-blue-600 transition-transform ${
            hasText || currentEmoji
              ? "hover:scale-110 cursor-pointer"
              : "cursor-default"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {!hasText ? (
            <span className="text-3xl leading-none">{currentEmoji}</span>
          ) : loading ? (
            <span className="text-sm font-bold text-blue-600">...</span>
          ) : (
            <FaPaperPlane className="h-7 w-7 text-[#0084FF]" />
          )}
        </button>
      </div>
    </div>
  );
}
