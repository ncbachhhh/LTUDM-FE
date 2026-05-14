import React from 'react';
import ChatActionMenu from './ChatActionMenu';
import { LuPin } from "react-icons/lu";

export default function ContactItem({ 
  id, name, message, time, avatar, isActive, isUnread, isPinned, onAction, onClick 
}) {
  return (
    <div 
      onClick={onClick}
      className={`relative group flex items-center gap-3 p-2 cursor-pointer transition-all duration-200 rounded-[10px]
        ${isActive ? '' : 'bg-transparent hover:bg-[#EEF2F9] has-[button:hover]:bg-transparent'}`}
      style={isActive ? { background: 'linear-gradient(0deg, rgba(242, 230, 238, 0.3) 0%, rgba(151, 125, 255, 0.3) 100%)' } : {}}
    >
      <div className="relative h-[52px] w-[52px] shrink-0">
        <img src={avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden leading-tight">
        <h3 className="truncate text-[15px] font-bold text-black">{name}</h3>
        <p className={`truncate text-[13px] ${isUnread ? 'font-bold text-slate-700' : 'text-gray-500'}`}>
          {message}
        </p>
        <span className="text-[12px] font-medium text-gray-400">{time}</span>
      </div>

      {isPinned && (
        <div className="absolute bottom-2 right-2 transform rotate-[30deg]">
          {/* Đổ màu #0033FF và làm đậm viền */}
          <LuPin size={14} fill="#0033FF" color="#0033FF" strokeWidth={3} />
        </div>
      )}

      <div className="absolute right-8 z-10">
        <ChatActionMenu 
          isPinned={isPinned} 
          onAction={(type) => onAction(type, id)} 
        />
      </div>

      {isUnread && (
        <div className="ml-auto mr-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)] group-hover:hidden"></div>
      )}
    </div>
  );
}
