import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ChatMenuItem from './ChatMenuItem';
import { LuPin, LuUserRoundX, LuEyeOff, LuBookmark, LuTrash2 } from "react-icons/lu";

export default function ChatActionMenu({ isPinned, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!showMenu) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Chỉnh left lấy trung tâm của nút bấm
      setCoords({ 
        top: rect.bottom + window.scrollY + 8, 
        left: rect.left + window.scrollX + (rect.width / 2) 
      });
    }
    setShowMenu(!showMenu);
  };

  const menuOptions = [
    { id: 'PIN', label: isPinned ? 'Bỏ ghim' : 'Ghim tin nhắn lên đầu', icon: <LuPin size={18} /> },
    { id: 'BLOCK', label: 'Chặn', icon: <LuUserRoundX size={18} /> },
    { id: 'HIDE', label: 'Ẩn đoạn chat', icon: <LuEyeOff size={18} /> },
    { id: 'MARK_UNREAD', label: 'Đánh dấu là chưa đọc', icon: <LuBookmark size={18} /> },
    { id: 'DELETE', label: 'Xóa đoạn chát', color: 'text-red-500', icon: <LuTrash2 size={18} /> },
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
          // Dùng translateX(-50%) để menu nằm chính giữa tọa độ left
          style={{ 
            position: 'absolute', 
            top: coords.top, 
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