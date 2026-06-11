import { Button, Spin } from "antd";
import { Search, X, ArrowLeft } from "lucide-react";
import UserAPI from "../../../../../apis/user.api.jsx";
import { PROFILE_AVATAR } from "../../../../../constants/asset.constants.js";
import { useFriendSearch } from "../../../../../features/friendship/useFriendSearch.js";

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || PROFILE_AVATAR;

export default function AddFriendModule({ onClose, onSearchSuccess }) {
  const { keyword, setKeyword, results, loading, message, search, setMessage } = useFriendSearch({
    searchFn: UserAPI.searchUsersForFriendRequest,
    auto: false,
    emptyMessage: "Không tìm thấy người dùng phù hợp.",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  const hasSearched = !loading && keyword.trim() !== "";

  return (
    <div className="flex flex-col bg-white rounded-[24px] overflow-hidden" style={{ height: 560 }}>
      {/* ── Header ─────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center px-6 py-5 shrink-0 rounded-[24px]"
        style={{
          background: "linear-gradient(135deg, #0033FF 0%, #6366F1 100%)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <X size={18} />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-white/60">Chat App</p>
          <h2 className="text-xl font-black text-white">Tìm kiếm bạn bè</h2>
        </div>
      </div>

      {/* ── Search bar ─────────────────────────────── */}
      <div className="px-6 py-5 shrink-0 border-b border-gray-100">
        <div
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
            message
              ? "bg-red-50 ring-2 ring-red-300"
              : "bg-[#F0F4FF] ring-2 ring-transparent focus-within:ring-[#0033FF]/30"
          }`}
        >
          <Search size={18} className={message ? "text-red-400 shrink-0" : "text-[#6366F1] shrink-0"} />
          <input
            autoFocus
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setMessage(""); }}
            onKeyDown={handleKeyDown}
            placeholder="Email, username hoặc tên hiển thị..."
            className="flex-1 bg-transparent text-[15px] font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none"
          />
          {keyword && (
            <button
              onClick={() => { setKeyword(""); setMessage(""); }}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {message && (
          <p className="mt-2 px-1 text-[13px] font-semibold text-red-500">{message}</p>
        )}
      </div>

      {/* ── Results ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <Spin size="large" />
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center pb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F4FF]">
              <Search size={28} className="text-[#6366F1]" />
            </div>
            <p className="text-[15px] font-bold text-slate-700">Tìm kiếm người dùng</p>
            <p className="text-[13px] text-slate-400 max-w-[220px]">
              Nhập email, username hoặc tên và nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono">Enter</kbd>
            </p>
          </div>
        )}

        {!loading && hasSearched && (results?.length ?? 0) === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 pb-8">
            <p className="text-[15px] font-bold text-slate-500">Không tìm thấy kết quả</p>
            <p className="text-[13px] text-slate-400">Thử tìm với từ khóa khác</p>
          </div>
        )}

        {!loading && (results?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <p className="px-2 pb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
              {results.length} kết quả
            </p>
            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onSearchSuccess(user)}
                className="flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-all hover:bg-[#F0F4FF] active:scale-[0.98]"
              >
                <div className="relative h-12 w-12 shrink-0">
                  <img
                    src={getAvatarUrl(user)}
                    alt=""
                    className="h-full w-full rounded-full object-cover border-2 border-white shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-slate-800">{getDisplayName(user)}</p>
                  <p className="truncate text-[13px] text-slate-400">{user.email}</p>
                </div>
                <div className="shrink-0 rounded-full bg-[#0033FF]/10 px-3 py-1 text-[12px] font-bold text-[#0033FF]">
                  Xem
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div className="flex gap-3 border-t border-gray-100 px-6 py-4 shrink-0">
        <Button
          onClick={onClose}
          size="large"
          className="flex-1 !rounded-xl !border-gray-200 !text-[15px] !font-bold !text-slate-600 hover:!bg-gray-50"
        >
          Đóng
        </Button>
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={() => search()}
          disabled={!keyword.trim() || loading}
          className={`flex-1 !rounded-xl !border-none !text-[15px] !font-bold ${
            !keyword.trim()
              ? "!bg-slate-100 !text-slate-400"
              : "!bg-[#0033FF] !text-white hover:!opacity-90"
          }`}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
