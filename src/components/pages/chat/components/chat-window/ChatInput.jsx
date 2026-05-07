import React, { useState } from "react";

export default function ChatInput({ currentEmoji = "👍", onSendMessage }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const hasText = text.trim() !== "";

    const handleSendMessage = async () => {
        const content = text.trim();

        if (!content || loading) return;

        setLoading(true);

        const result = await onSendMessage(content);

        setLoading(false);

        if (result?.isSuccess) {
            setText("");
        } else {
            alert(result?.message || "Gửi tin nhắn thất bại");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && hasText) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex items-center gap-5 border-t border-gray-50 px-6 py-0">
            <button
                type="button"
                className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
            >
                <img src="/icon-micro.svg" className="h-6 w-6" alt="Biểu tượng micro" />
            </button>

            <button
                type="button"
                className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
            >
                <img src="/icon-anh.svg" className="h-6 w-6" alt="Biểu tượng ảnh" />
            </button>

            <div className="flex-1 rounded-full bg-[#0033FF]/5 px-6 py-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder="Nhập tin nhắn..."
                />
            </div>

            <button
                type="button"
                disabled={loading}
                onClick={hasText ? handleSendMessage : undefined}
                className={`text-3xl text-blue-600 transition-transform ${
                    hasText ? "hover:scale-110 cursor-pointer" : "cursor-default"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
                {!hasText ? (
                    <span className="text-3xl leading-none">{currentEmoji}</span>
                ) : loading ? (
                    <span className="text-sm font-bold text-blue-600">...</span>
                ) : (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0084FF]">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
}