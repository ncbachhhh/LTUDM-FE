import { useState } from "react";
import UserAPI from "../../../../../apis/user.api.jsx";

const DEFAULT_AVATAR = "/anh-avata.svg";

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || DEFAULT_AVATAR;

export default function AddFriendModule({ onClose, onSearchSuccess }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const normalizedKeyword = keyword.trim();
    if (normalizedKeyword.length < 2 || loading) {
      setMessage("Nhập ít nhất 2 ký tự để tìm kiếm.");
      return;
    }

    setLoading(true);
    setMessage("");
    const response = await UserAPI.searchUsersForFriendRequest(normalizedKeyword);
    setLoading(false);

    if (!response.isSuccess) {
      setResults([]);
      setMessage(response.message);
      return;
    }

    setResults(response.data || []);
    if (!response.data?.length) {
      setMessage("Không tìm thấy người dùng phù hợp.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h-[90%] max-h-[800px] w-[60%] min-w-[500px] flex-col rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
      <div className="shrink-0 px-8 py-6 border-b border-gray-50">
        <div className="relative flex items-center justify-center">
          <h2 className="text-[24px] font-bold text-black">Thêm bạn</h2>
          <button
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        <div
          className={`mb-4 flex items-center gap-4 rounded-[20px] px-5 py-4 border-2 transition-all ${
            message ? "bg-red-50 border-red-300" : "bg-[#E0E7FF] border-transparent"
          }`}
        >
          <svg
            className={`h-7 w-7 shrink-0 ${message ? "text-red-500" : "text-[#4F46E5]"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setMessage("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nhập email, username hoặc tên hiển thị"
            className="w-full !bg-transparent text-[18px] font-semibold outline-none border-none p-0 placeholder:text-[#818CF8] focus:ring-0 shadow-none appearance-none"
          />
        </div>

        {message && (
          <p className="mb-6 px-4 text-[15px] font-bold text-red-500">{message}</p>
        )}

        <h3 className="mb-4 text-[18px] font-bold text-black">Kết quả tìm kiếm</h3>
        <div className="space-y-4">
          {loading && (
            <div className="rounded-[20px] bg-gray-50 p-6 text-center text-sm font-bold text-gray-400">
              Đang tìm kiếm...
            </div>
          )}

          {!loading &&
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => onSearchSuccess(user)}
                className="flex w-full items-center gap-4 p-3 hover:bg-gray-50 rounded-[20px] transition-all text-left"
              >
                <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200 shrink-0">
                  <img src={getAvatarUrl(user)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[18px] font-bold text-black truncate">
                    {getDisplayName(user)}
                  </p>
                  <p className="text-[14px] text-gray-400 font-bold italic truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="shrink-0 flex gap-5 px-8 py-6 border-t border-gray-100">
        <button
          onClick={onClose}
          className="flex-1 rounded-[20px] bg-[#F3F4F1] py-4 text-[18px] font-bold text-black hover:bg-gray-200 transition-all"
        >
          Hủy
        </button>
        <button
          disabled={loading}
          onClick={handleSearch}
          className="flex-1 rounded-[20px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-[#1E293B] hover:bg-[#A5B9F9] transition-all disabled:opacity-50"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
    </div>
  );
}
