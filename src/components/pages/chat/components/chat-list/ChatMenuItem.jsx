import React from 'react';

export default function ChatMenuItem({ label, icon, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-[#D8DEEE] transition-all cursor-pointer border-none outline-none group text-left`}
    >
      <div className={`shrink-0 ${color ? color : 'text-slate-600'}`}>
        {icon}
      </div>
      
      <span className={`text-[13.5px] font-bold ${color || 'text-[#1A1C1E]'} whitespace-nowrap`}>
        {label}
      </span>
    </button>
  );
}