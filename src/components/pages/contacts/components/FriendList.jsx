import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/anh-avata.svg";

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || DEFAULT_AVATAR;

const FriendList = ({ friends = [], searchQuery = "", loading = false, onOpenProfile }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("AZ");
  const [localSearch, setLocalSearch] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const query = `${searchQuery} ${localSearch}`.trim().toLowerCase();

  const groupedFriends = useMemo(() => {
    const filteredFriends = friends
      .filter((friend) => {
        if (!query) return true;
        const haystack = [
          getDisplayName(friend),
          friend?.username,
          friend?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => {
        const left = getDisplayName(a);
        const right = getDisplayName(b);
        return sortType === "AZ"
          ? left.localeCompare(right, "vi")
          : right.localeCompare(left, "vi");
      });

    return filteredFriends.reduce((acc, friend) => {
      const char = getDisplayName(friend).charAt(0).toUpperCase() || "#";
      acc[char] = acc[char] || [];
      acc[char].push(friend);
      return acc;
    }, {});
  }, [friends, query, sortType]);

  const hasFriends = Object.keys(groupedFriends).length > 0;

  return (
    <div className="flex flex-col h-full text-left">
      <h2 className="font-bold text-[16px] text-gray-700 ml-1 mb-4">
        Bạn bè ({friends.length})
      </h2>

      <div className="bg-white rounded-[20px] shadow-sm p-8 border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              size={18}
            />
            <input
              type="text"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Tìm bạn"
              className="w-full pl-12 pr-4 py-2.5 bg-[#E8EEFB] rounded-[8px] outline-none text-[15px] text-blue-900 border-none"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen((isOpen) => !isOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#BCCCFE] text-[#0029FF] rounded-[8px] font-bold text-[14px]"
            >
              <ArrowUpDown size={16} />
              {sortType === "AZ" ? "A tới Z" : "Z tới A"}
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-20 py-2">
                {["AZ", "ZA"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortType(option);
                      setIsSortOpen(false);
                    }}
                    className="w-full flex justify-between px-5 py-2.5 hover:bg-gray-50 font-bold text-sm text-left"
                  >
                    <span>{option === "AZ" ? "A tới Z" : "Z tới A"}</span>
                    {sortType === option && <Check size={18} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="py-12 text-center text-sm font-semibold text-gray-400">
              Đang tải danh sách bạn bè...
            </div>
          )}

          {!loading && !hasFriends && (
            <div className="py-12 text-center text-sm font-semibold text-gray-400">
              Không có bạn bè phù hợp.
            </div>
          )}

          {!loading &&
            Object.keys(groupedFriends)
              .sort()
              .map((char) => (
                <div key={char} className="mb-8">
                  <h3 className="font-bold text-[18px] mb-3">{char}</h3>
                  <div className="space-y-1 border-t border-gray-50 pt-4">
                    {groupedFriends[char].map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => onOpenProfile?.(friend)}
                        className="flex items-center justify-between hover:bg-[#F3F6FD] p-3 rounded-xl transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={getAvatarUrl(friend)}
                            className="w-[52px] h-[52px] rounded-full object-cover border-2 border-white shadow-sm"
                            alt=""
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">
                              {getDisplayName(friend)}
                            </p>
                            {friend.email && (
                              <p className="text-xs text-gray-400 truncate">{friend.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveMenu(activeMenu === friend.id ? null : friend.id)
                            }}
                            className="p-2 hover:bg-white rounded-full transition-all text-gray-300 hover:text-gray-600"
                          >
                            <MoreHorizontal size={20} className="cursor-pointer" />
                          </button>

                          {activeMenu === friend.id && (
                            <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenProfile?.(friend);
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800"
                              >
                                Xem thông tin
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  navigate(`/chat?userId=${friend.id}`);
                                }}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50 text-[14px] font-bold text-gray-800"
                              >
                                <MessageCircle size={16} />
                                Nhắn tin
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
