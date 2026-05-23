import UserAPI from "../../../../../apis/user.api.jsx";
import SearchInput from "../../../../common/SearchInput.jsx";
import { PROFILE_AVATAR } from "../../../../../constants/asset.constants.js";
import { useFriendSearch } from "../../../../../features/friendship/useFriendSearch.js";

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || PROFILE_AVATAR;

export default function AddFriendModule({ onClose, onSearchSuccess }) {
  const {
    keyword,
    setKeyword,
    results,
    loading,
    message,
    search,
    setMessage,
  } = useFriendSearch({
    searchFn: UserAPI.searchUsersForFriendRequest,
    auto: false,
    emptyMessage: "Không tìm thấy người dùng phù hợp.",
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div className="flex h-[90%] max-h-[800px] w-[60%] min-w-[500px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="shrink-0 border-b border-gray-50 px-8 py-6">
        <div className="relative flex items-center justify-center">
          <h2 className="text-[24px] font-bold text-black">Thêm bạn</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 rounded-full p-2 transition-all hover:bg-gray-100"
          >
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto px-8 py-6">
        <SearchInput
          value={keyword}
          onChange={(value) => {
            setKeyword(value);
            setMessage("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Nhập email, username hoặc tên hiển thị"
          wrapperClassName={`mb-4 rounded-[20px] border-2 px-5 py-4 transition-all ${
            message ? "border-red-300 bg-red-50" : "border-transparent bg-[#E0E7FF]"
          }`}
          inputClassName="pl-10 text-[18px] font-semibold text-slate-900 placeholder:text-[#818CF8]"
          iconClassName={message ? "text-red-500" : "text-[#4F46E5]"}
        />

        {message && <p className="mb-6 px-4 text-[15px] font-bold text-red-500">{message}</p>}

        <h3 className="mb-4 text-[18px] font-bold text-black">Kết quả tìm kiếm</h3>
        <div className="space-y-4">
          {loading && (
            <div className="rounded-[20px] bg-gray-50 p-6 text-center text-sm font-bold text-gray-400">
              Đang tìm kiếm...
            </div>
          )}

          {!loading &&
            (results || []).map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onSearchSuccess(user)}
                className="flex w-full items-center gap-4 rounded-[20px] p-3 text-left transition-all hover:bg-gray-50"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <img src={getAvatarUrl(user)} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-bold text-black">{getDisplayName(user)}</p>
                  <p className="truncate text-[14px] font-bold italic text-gray-400">{user.email}</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="flex shrink-0 gap-5 border-t border-gray-100 px-8 py-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-[20px] bg-[#F3F4F1] py-4 text-[18px] font-bold text-black transition-all hover:bg-gray-200"
        >
          Hủy
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => search()}
          className="flex-1 rounded-[20px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-[#1E293B] transition-all hover:bg-[#A5B9F9] disabled:opacity-50"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
    </div>
  );
}

