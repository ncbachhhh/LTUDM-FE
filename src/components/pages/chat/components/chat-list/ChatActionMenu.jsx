import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ChatMenuItem from './ChatMenuItem';
import { LuUserRoundX, LuTrash2 } from "react-icons/lu";

export default function ChatActionMenu({ canBlock = false, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  // Hỗ trợ cả tọa độ top (xổ xuống) và bottom (bật lên trên)
  const [coords, setCoords] = useState({ top: null, bottom: null, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    const handleScrollOrResize = () => {
      setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [showMenu]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!showMenu) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // TỰ ĐỘNG PHÂN TÍCH VỊ TRÍ: 
      // Nếu nút bấm nằm ở nửa dưới màn hình (như vùng Group), bật menu LÊN TRÊN.
      if (rect.bottom > window.innerHeight / 2) {
        setCoords({
          top: null,
          bottom: window.innerHeight - rect.top + 8, // Đẩy ngược lên trên nút bấm
          left: rect.left + (rect.width / 2)
        });
      } else {
        // Ngược lại nếu ở trên (như vùng People) thì vẫn xổ xuống dưới như cũ
        setCoords({
          top: rect.bottom + 8,
          bottom: null,
          left: rect.left + (rect.width / 2)
        });
      }
    }
    setShowMenu(!showMenu);
  };

  const menuOptions = [
    ...(canBlock ? [{ id: 'BLOCK', label: 'Chặn', icon: <LuUserRoundX size={18} /> }] : []),
    { id: 'DELETE', label: 'Xóa đoạn chat', color: 'text-red-500', icon: <LuTrash2 size={18} /> },
  ];

  return (
    <>
      <button 
        ref={buttonRef} 
        onClick={handleToggle} 
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all 
          ${showMenu ? 'bg-[#EEF2F9] opacity-100' : 'bg-white shadow-sm border border-gray-100 hover:bg-[#EEF2F9] opacity-0 group-hover:opacity-100'}`}
      >
        <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {showMenu && createPortal(
        <div 
          ref={menuRef} 
          style={{ 
            position: 'fixed', 
            // Áp dụng linh hoạt top hoặc bottom tùy thuộc vị trí click
            ...(coords.top !== null ? { top: coords.top } : { bottom: coords.bottom }),
            left: coords.left, 
            transform: 'translateX(-50%)' 
          }} 
          className="z-[9999] w-[220px] rounded-[14px] bg-[#E9ECF6] py-1 shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          {menuOptions.map((opt) => (
            <ChatMenuItem 
              key={opt.id} 
              label={opt.label} 
              color={opt.color} 
              icon={opt.icon} 
              onClick={(e) => { 
                e.stopPropagation(); 
                onAction(opt.id); 
                setShowMenu(false); 
              }} 
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
