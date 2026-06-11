import React, { useState } from 'react';
import { Spin } from 'antd';
import MessageAPI from '../../../../../../apis/message.api.jsx';
import { formatMessageTime } from '../../../../../../utils/date-format.util.js';

// Nhận onClose để khi bấm nút X quay về giao diện cũ
export default function SearchChat({ conversationId, onClose, onJumpToMessage }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Nhập từ khóa để tìm kiếm...");

  const handleSearch = async () => {
    const query = keyword.trim();
    if (query.length < 2 || loading) {
      setMessage("Nhập ít nhất 2 ký tự để tìm kiếm.");
      setResults([]);
      return;
    }

    setLoading(true);
    const response = await MessageAPI.searchMessages(conversationId, query, 0, 30);
    setLoading(false);

    if (!response.isSuccess) {
      setMessage(response.message);
      setResults([]);
      return;
    }

    setResults(response.data || []);
    setMessage((response.data || []).length ? "" : "Không tìm thấy tin nhắn phù hợp.");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-white p-4">
      
      {/* Header: Chứa nút Tắt (X) và Tiêu đề */}
      <header className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {/* Icon X (Đóng) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Tìm kiếm</h2>
      </header>

      {/* Khu vực Ô nhập liệu (Input) */}
      <div className="flex items-center gap-2 bg-blue-100/50 rounded-2xl px-4 py-2 mt-2">
        {/* Icon Kính lúp nhỏ */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        
        <input 
          type="text" 
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm trong cuộc trò chuyện"
          className="flex-1 bg-transparent border-none outline-none text-sm text-blue-800 placeholder-blue-400 py-1"
          autoFocus 
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin size="small" />
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-2">
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJumpToMessage?.(item.id)}
                className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-blue-50"
              >
                <div className="text-sm font-bold text-slate-700 line-clamp-2">
                  {item.content}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-400">
                  {formatMessageTime(item.created_at || item.createdAt)}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
