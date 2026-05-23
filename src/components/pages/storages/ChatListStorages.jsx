import { Ban } from "lucide-react";
import { PROFILE_AVATAR } from "../../../constants/asset.constants.js";

const ChatListStorages = ({
  people = [],
  loading = false,
  onSelect,
  selectedId,
}) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-[32px] bg-white shadow-sm">
      <div className="border-b border-gray-50 p-4">
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E3E9FF] py-3 text-[14px] font-bold uppercase text-[#0029FF]">
          <Ban size={18} />
          Block
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="py-10 text-center text-sm font-semibold text-gray-400">
            Đang tải danh sách đã chặn...
          </div>
        )}

        {!loading && people.length === 0 && (
          <div className="py-10 text-center text-sm font-semibold text-gray-400">
            Chưa có người dùng bị chặn.
          </div>
        )}

        {!loading &&
          people.map((item) => (
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

export default ChatListStorages;
