import { useMemo, useState } from "react";
import { Empty, Input, Spin } from "antd";
import { SearchOutlined, StopOutlined } from "@ant-design/icons";
import { PROFILE_AVATAR } from "../../../constants/asset.constants.js";

/* ── Component ───────────────────────────────────── */

const BlockedUserList = ({ users = [], loading = false, onSelect, selectedId }) => {
  const [searchText, setSearchText] = useState("");

  /* Lọc danh sách theo tên */
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;
    const query = searchText.trim().toLowerCase();
    return users.filter((item) => item.name?.toLowerCase().includes(query));
  }, [users, searchText]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-[24px] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-50 p-4 space-y-3">
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E3E9FF] py-3 text-[14px] font-bold uppercase text-[#0029FF]">
          <StopOutlined className="!text-base" />
          Đã chặn
        </div>

        {/* Ô tìm kiếm */}
        {users.length > 0 && (
          <Input
            placeholder="Tìm kiếm..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            className="!rounded-lg !bg-[#E8EEFB] !border-none !h-[38px] hover:!bg-[#d8e3f9] focus-within:!bg-[#d8e3f9] [&_.ant-input]:!bg-transparent focus-within:!shadow-none"
          />
        )}
      </div>

      {/* Danh sách người bị chặn */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="py-10 flex justify-center">
            <Spin tip="Đang tải danh sách đã chặn..." />
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="py-10 flex justify-center">
            <Empty
              description={
                searchText.trim()
                  ? "Không tìm thấy người dùng phù hợp"
                  : "Chưa có người dùng bị chặn"
              }
            />
          </div>
        )}

        {!loading &&
          filteredUsers.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`relative mb-1 flex cursor-pointer items-center gap-3 rounded-[20px] p-4 transition-all ${
                selectedId === item.id
                  ? "bg-gradient-to-r from-[#E3E9FF] to-[#F5F7FF]"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={item.avatar || PROFILE_AVATAR}
                className="h-[52px] w-[52px] rounded-full border-2 border-white object-cover shadow-sm"
                alt=""
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[15px] font-bold">{item.name}</h4>
                <p className="truncate text-[12px] text-gray-400">
                  {item.message || "Hiện không thể liên lạc"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlockedUserList;
