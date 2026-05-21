import React, { useState, useMemo } from "react";
import {
  MoreHorizontal,
  Search,
  ArrowUpDown,
  Check,
  ChevronDown,
} from "lucide-react";

const FriendList = ({ people = [], onOpenProfile }) => {
  const [sortType, setSortType] = useState("AZ");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Quản lý nút 3 chấm của từng người

  const sortedData = useMemo(() => {
    return [...people].sort((a, b) =>
      sortType === "AZ"
        ? a.name.localeCompare(b.name, "vi")
        : b.name.localeCompare(a.name, "vi"),
    );
  }, [people, sortType]);

  const groups = sortedData.reduce((acc, p) => {
    const char = p.name.charAt(0).toUpperCase();
    if (!acc[char]) acc[char] = [];
    acc[char].push(p);
    return acc;
  }, {});

  return (
    // Thêm h-full để cả khối cao bằng sidebar bên trái
    <div className="flex flex-col h-full text-left">
      <h2 className="font-bold text-[16px] text-gray-700 ml-1 mb-4">
        Bạn bè ( {people.length} )
      </h2>

      {/* flex-1 giúp khối trắng tự giãn dài xuống đáy */}
      <div className="bg-white rounded-[20px] shadow-sm p-8 border border-gray-100 flex-1 flex flex-col">
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm bạn"
              className="w-full pl-12 pr-4 py-2.5 bg-[#E8EEFB] rounded-[8px] outline-none text-[15px] text-blue-900 border-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#BCCCFE] text-[#0029FF] rounded-[8px] font-bold text-[14px]"
            >
              <ArrowUpDown size={16} /> Từ{" "}
              {sortType === "AZ" ? "A tới Z" : "Z tới A"}{" "}
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20 py-2">
                <button
                  onClick={() => {
                    setSortType("AZ");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex justify-between px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-left"
                >
                  <span>Từ A tới Z</span>
                  {sortType === "AZ" && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortType("ZA");
                    setIsSortOpen(false);
                  }}
                  className="w-full flex justify-between px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-left"
                >
                  <span>Từ Z tới A</span>
                  {sortType === "ZA" && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          {Object.keys(groups)
            .sort()
            .map((char) => (
              <div key={char} className="mb-8">
                <h3 className="font-bold text-[18px] mb-3">{char}</h3>
                <div className="space-y-1 border-t border-gray-50 pt-4">
                  {groups[char].map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between hover:bg-[#F3F6FD] p-3 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.avatar}
                          className="w-[52px] h-[52px] rounded-full object-cover border-2 border-white shadow-sm"
                          alt=""
                        />
                        <span className="font-bold text-gray-800">
                          {p.name}
                        </span>
                      </div>

                      {/* NÚT 3 CHẤM VÀ MENU HÀNH ĐỘNG */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(activeMenu === p.id ? null : p.id)
                          }
                          className="p-2 hover:bg-white rounded-full transition-all text-gray-300 hover:text-gray-600"
                        >
                          <MoreHorizontal
                            size={20}
                            className="cursor-pointer"
                          />
                        </button>

                        {activeMenu === p.id && (
                          <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-150">
                            <button
                              onClick={() => {
                                onOpenProfile?.(p);
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800"
                            >
                              Xem thông tin
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800">
                              Chặn người này
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-red-500 border-t border-gray-50 mt-1">
                              Xóa bạn
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
