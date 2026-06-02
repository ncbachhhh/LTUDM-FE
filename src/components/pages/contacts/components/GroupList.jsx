import { useMemo, useState } from "react";
import { Dropdown, Empty, Input } from "antd";
import { DownOutlined, MessageOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

/* ── Sort config ─────────────────────────────────── */

const SORT_OPTIONS = [
  { key: "newest", label: "Mới nhất" },
  { key: "oldest", label: "Cũ nhất" },
];

/* ── Component ───────────────────────────────────── */

const GroupList = ({ groups = [] }) => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchText, setSearchText] = useState("");

  const sortedGroups = useMemo(() => {
    let data = [...groups];

    // Lọc theo tên nhóm
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      data = data.filter((g) => g.name?.toLowerCase().includes(q));
    }

    return sortOrder === "newest" ? data.reverse() : data;
  }, [groups, sortOrder, searchText]);

  /* Sort dropdown menu */
  const sortMenuItems = SORT_OPTIONS.map((opt) => ({
    key: opt.key,
    label: (
      <span className="flex items-center justify-between w-full">
        <span>{opt.label}</span>
        {sortOrder === opt.key && <span className="text-[#0029FF] font-bold ml-3">✓</span>}
      </span>
    ),
    onClick: () => setSortOrder(opt.key),
  }));

  /* Context menu cho từng nhóm */
  const getContextMenuItems = (group) => [
    {
      key: "message",
      icon: <MessageOutlined />,
      label: "Nhắn tin",
      onClick: () => navigate(`/chat?groupId=${group.id}`),
    },
    { type: "divider" },
    {
      key: "leave",
      icon: <LogoutOutlined />,
      label: "Rời nhóm",
      danger: true,
    },
  ];

  return (
    <div className="flex flex-col h-full text-left">
      <h2 className="font-bold text-[16px] text-gray-700 ml-1 mb-4">
        Nhóm ({groups.length})
      </h2>

      <div className="bg-white rounded-[20px] shadow-sm p-8 border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar: Search + Sort */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Tìm kiếm nhóm"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            className="flex-1 !rounded-lg !bg-[#E8EEFB] !border-none !h-[38px] hover:!bg-[#d8e3f9] focus-within:!bg-[#d8e3f9] [&_.ant-input]:!bg-transparent focus-within:!shadow-none"
          />

          <Dropdown menu={{ items: sortMenuItems }} trigger={["click"]} placement="bottomRight">
            <button className="flex items-center gap-2 px-5 py-2 bg-[#BCCCFE] text-[#0029FF] rounded-lg font-bold text-[14px] whitespace-nowrap hover:bg-[#a8bcfe] transition-colors min-w-[190px] justify-between">
              <span>Hoạt động ({sortOrder === "newest" ? "mới nhất" : "cũ nhất"})</span>
              <DownOutlined className="text-xs" />
            </button>
          </Dropdown>
        </div>

        {/* Danh sách nhóm */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sortedGroups.length === 0 ? (
            <div className="py-8 flex justify-center">
              <Empty description={searchText ? "Không tìm thấy nhóm phù hợp" : "Chưa có nhóm nào"} />
            </div>
          ) : (
            sortedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/chat?groupId=${group.id}`)}
                className="flex items-center justify-between hover:bg-[#F3F6FD] p-3 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={group.avatar}
                    className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm shrink-0"
                    alt=""
                  />
                  <span className="font-bold text-gray-800 truncate">{group.name}</span>
                </div>

                <Dropdown
                  menu={{ items: getContextMenuItems(group) }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-white rounded-full text-gray-300 hover:text-gray-600 transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </Dropdown>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
