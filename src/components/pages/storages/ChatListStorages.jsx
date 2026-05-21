import React, { useState } from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";

const ChatListStorages = ({
  people,
  filterType,
  setFilterType,
  onSelect,
  selectedId,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="bg-white rounded-[32px] flex-1 flex flex-col overflow-hidden shadow-sm">
      {/* Nút lọc SPAM / BLOCK */}
      <div className="p-4 border-b border-gray-50 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full py-3 bg-[#E3E9FF] text-[#0029FF] rounded-xl font-bold uppercase text-[14px] flex items-center justify-center gap-2"
        >
          {filterType} <ChevronDown size={18} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-[70px] left-4 right-4 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => {
                setFilterType("SPAM");
                setIsDropdownOpen(false);
              }}
              className="w-full p-4 text-left font-bold hover:bg-gray-50 border-b border-gray-50"
            >
              SPAM
            </button>
            <button
              onClick={() => {
                setFilterType("BLOCK");
                setIsDropdownOpen(false);
              }}
              className="w-full p-4 text-left font-bold hover:bg-gray-50"
            >
              BLOCK
            </button>
          </div>
        )}
      </div>

      {/* Danh sách người dùng */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {people.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`flex items-center gap-3 p-4 rounded-[20px] cursor-pointer transition-all mb-1 relative ${selectedId === item.id ? "bg-gradient-to-r from-[#E3E9FF] to-[#F5F7FF]" : "hover:bg-gray-50"}`}
          >
            <img
              src={item.avatar}
              className="w-[52px] h-[52px] rounded-full border-2 border-white shadow-sm"
              alt=""
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[15px] truncate">{item.name}</h4>
              <p className="text-[12px] text-gray-400 truncate">
                {item.message}
              </p>
            </div>

            {/* Menu 3 chấm */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === item.id ? null : item.id);
                }}
                className="p-1 text-gray-300 hover:text-gray-600"
              >
                <MoreHorizontal size={20} />
              </button>

              {activeMenu === item.id && (
                <div className="absolute right-0 top-8 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800">
                    Ghim lên đầu
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800">
                    Spam
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800">
                    Block
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800 border-t mt-1">
                    Xóa chat
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListStorages;
