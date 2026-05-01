import React from 'react';

// Nhận onClose để khi bấm nút X quay về giao diện cũ
export default function SearchChat({ onClose }) {
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
          placeholder="Tìm kiếm trong cuộc trò chuyện"
          className="flex-1 bg-transparent border-none outline-none text-sm text-blue-800 placeholder-blue-400 py-1"
          autoFocus 
        />
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Nhập từ khóa để tìm kiếm...
      </div>
    </div>
  );
}