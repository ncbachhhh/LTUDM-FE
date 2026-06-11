import React from "react";
import ChatActionMenu from "./ChatActionMenu";
// formatRelativeTime removed

export default function ContactItem({
  id,
  name,
  message,
  time,
  avatar,
  isActive,
  isOnline = false,
  isUnread,
  unreadCount = 0,
  canBlock = false,
  onAction,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative group flex items-center gap-3 p-2 cursor-pointer transition-all duration-200 rounded-[10px]
        ${isActive ? "" : "bg-transparent hover:bg-[#f1f2f4] has-[button:hover]:bg-transparent"}`}
      style={
        isActive
          ? {
              background: "var(--app-active-bg, #e5f1ff)",
            }
          : {}
      }
    >
      <div className="relative h-[52px] w-[52px] shrink-0">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden leading-tight">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-[15px] font-bold text-black">{name}</h3>
          {/* Đưa thời gian lên đây để nó nằm bên phải tên */}
          <span className="text-[11px] font-medium text-gray-400 shrink-0">
            {time}
          </span>
        </div>

        <p
          className={`truncate text-[13px] ${isUnread ? "font-bold text-slate-700" : "text-gray-500"}`}
        >
          {message}
        </p>
      </div>

      <div className="absolute right-8 z-10">
        <ChatActionMenu
          canBlock={canBlock}
          onAction={(type) => onAction(type, id)}
        />
      </div>

      {isUnread && (
        <div className="ml-auto mr-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white shadow-[0_0_8px_rgba(37,99,235,0.5)] group-hover:hidden">
          {unreadCount > 99 ? "99+" : unreadCount || ""}
        </div>
      )}
    </div>
  );
}
