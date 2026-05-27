import { useMemo, useState } from "react";
import { Badge, Dropdown, Empty, Input, Spin } from "antd";
import { DownOutlined, MessageOutlined, SearchOutlined, SortAscendingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PROFILE_AVATAR } from "../../../../constants/asset.constants.js";

/* ── Helpers ──────────────────────────────────────── */

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || PROFILE_AVATAR;

const isOnline = (user) => Boolean(user?.is_online || user?.isOnline || user?.online);

/* ── Sort config ─────────────────────────────────── */

const SORT_OPTIONS = [
  { key: "AZ", label: "A tới Z" },
  { key: "ZA", label: "Z tới A" },
];

/* ── Component ───────────────────────────────────── */

const FriendList = ({ friends = [], loading = false, onOpenProfile }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("AZ");
  const [localSearch, setLocalSearch] = useState("");

  const query = localSearch.trim().toLowerCase();

  /* Lọc, sắp xếp, nhóm theo ký tự đầu */
  const groupedFriends = useMemo(() => {
    const filteredFriends = friends
      .filter((friend) => {
        if (!query) return true;
        const haystack = [getDisplayName(friend), friend?.username, friend?.email]
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

  /* Menu 3 chấm cho từng bạn bè */
  const getContextMenuItems = (friend) => [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Xem thông tin",
      onClick: () => onOpenProfile?.(friend),
    },
    {
      key: "message",
      icon: <MessageOutlined />,
      label: "Nhắn tin",
      onClick: () => navigate(`/chat?userId=${friend.id}`),
    },
  ];

  /* Sort dropdown menu */
  const sortMenuItems = SORT_OPTIONS.map((opt) => ({
    key: opt.key,
    label: (
      <span className="flex items-center justify-between w-full">
        <span>{opt.label}</span>
        {sortType === opt.key && <span className="text-[#0029FF] font-bold ml-3">✓</span>}
      </span>
    ),
    onClick: () => setSortType(opt.key),
  }));

  return (
    <div className="flex flex-col h-full text-left">
      <h2 className="font-bold text-[16px] text-gray-700 ml-1 mb-4">
        Bạn bè ({friends.length})
      </h2>

      <div className="bg-white rounded-[20px] shadow-sm p-8 border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar: Search + Sort */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Tìm bạn"
            allowClear
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            className="flex-1 !rounded-lg !bg-[#E8EEFB] !border-none !h-[38px] hover:!bg-[#d8e3f9] focus-within:!bg-[#d8e3f9] [&_.ant-input]:!bg-transparent focus-within:!shadow-none"
          />

          <Dropdown menu={{ items: sortMenuItems }} trigger={["click"]} placement="bottomRight">
            <button className="flex items-center gap-2 px-5 py-2 bg-[#BCCCFE] text-[#0029FF] rounded-lg font-bold text-[14px] whitespace-nowrap hover:bg-[#a8bcfe] transition-colors">
              <SortAscendingOutlined />
              {sortType === "AZ" ? "A tới Z" : "Z tới A"}
              <DownOutlined className="text-xs" />
            </button>
          </Dropdown>
        </div>

        {/* Danh sách bạn bè */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="py-12 flex justify-center">
              <Spin tip="Đang tải danh sách bạn bè..." />
            </div>
          )}

          {!loading && !hasFriends && (
            <div className="py-8 flex justify-center">
              <Empty description="Không có bạn bè phù hợp" />
            </div>
          )}

          {!loading &&
            Object.keys(groupedFriends)
              .sort()
              .map((char) => (
                <div key={char} className="mb-6">
                  <h3 className="font-bold text-[18px] mb-3">{char}</h3>
                  <div className="space-y-1 border-t border-gray-50 pt-3">
                    {groupedFriends[char].map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => onOpenProfile?.(friend)}
                        className="flex items-center justify-between hover:bg-[#F3F6FD] p-3 rounded-xl transition-all group cursor-pointer"
                      >
                        {/* Avatar + Info */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative h-[52px] w-[52px] shrink-0">
                            <img
                              src={getAvatarUrl(friend)}
                              className="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
                              alt=""
                            />
                            {isOnline(friend) && (
                              <Badge
                                status="success"
                                className="absolute bottom-0 right-0 [&_.ant-badge-status-dot]:!w-3.5 [&_.ant-badge-status-dot]:!h-3.5 [&_.ant-badge-status-dot]:!border-2 [&_.ant-badge-status-dot]:!border-white"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">
                              {getDisplayName(friend)}
                            </p>
                            {friend.email && (
                              <p className="text-xs text-gray-400 truncate">{friend.email}</p>
                            )}
                          </div>
                        </div>

                        {/* Context menu */}
                        <Dropdown
                          menu={{ items: getContextMenuItems(friend) }}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-white rounded-full transition-all text-gray-300 hover:text-gray-600"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </Dropdown>
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
