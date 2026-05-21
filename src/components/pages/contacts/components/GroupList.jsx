import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Check, MoreHorizontal } from "lucide-react";

const GroupList = ({ groups = [] }) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' hoặc 'oldest'
  const [activeMenu, setActiveMenu] = useState(null); // Quản lý menu 3 chấm

  // Logic sắp xếp nhóm
  const sortedGroups = useMemo(() => {
    const data = [...groups];
    if (sortOrder === "newest") {
      return data.reverse(); // Giả sử thứ tự trong file chatData là cũ trước mới sau
    }
    return data;
  }, [groups, sortOrder]);

  return (
    // h-full để cột bên phải dài bằng cột bên trái
    <div className="flex flex-col h-full text-left">
      <h2 className="font-bold text-[16px] text-gray-700 ml-1 mb-4">
        Nhóm ( {groups.length} )
      </h2>

      {/* flex-1 giúp khối trắng giãn hết cỡ xuống đáy */}
      <div className="bg-white rounded-[20px] shadow-sm p-8 border border-gray-100 flex-1 flex flex-col">
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full pl-12 py-2.5 bg-[#E8EEFB] rounded-[8px] outline-none text-[15px]"
            />
          </div>

          {/* BỘ LỌC HOẠT ĐỘNG */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#BCCCFE] text-[#0029FF] rounded-[8px] font-bold text-[14px] min-w-[190px] justify-between"
            >
              <span>
                Hoạt động ( {sortOrder === "newest" ? "mới nhất" : "cũ nhất"} )
              </span>
              <ChevronDown size={16} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 py-2">
                <button
                  onClick={() => {
                    setSortOrder("newest");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex justify-between px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-left"
                >
                  <span>Mới nhất</span>
                  {sortOrder === "newest" && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortOrder("oldest");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex justify-between px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-left"
                >
                  <span>Cũ nhất</span>
                  {sortOrder === "oldest" && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {sortedGroups.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between hover:bg-[#F3F6FD] p-3 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={g.avatar}
                  className="w-[56px] h-[56px] rounded-[16px] object-cover shadow-sm"
                  alt=""
                />
                <span className="font-bold text-gray-800">{g.name}</span>
              </div>

              {/* NÚT 3 CHẤM VÀ MENU NHÓM */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click vào nhóm
                    setActiveMenu(activeMenu === g.id ? null : g.id);
                  }}
                  className="p-2 hover:bg-white rounded-full text-gray-300 hover:text-gray-600 transition-all"
                >
                  <MoreHorizontal size={20} />
                </button>

                {activeMenu === g.id && (
                  <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800">
                      Nhắn tin
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-red-500">
                      Rời nhóm
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
