import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "antd";
import { X, Search, Users, Camera, Plus, Check } from "lucide-react";
import FriendshipAPI from "../../../../../apis/friendship.api.jsx";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";
import { getAvatarUrl, getDisplayName, getMemberId } from "../../../../../utils/identity.util.js";

const getFriendFromResponse = (friendship) => {
  if (!friendship?.user) return friendship;

  return {
    ...friendship.user,
    friendship_id: friendship.id,
    friendshipId: friendship.id,
    friendship_status: friendship.status || "ACCEPTED",
    friendshipStatus: friendship.status || "ACCEPTED",
  };
};

const getFriendUserId = (user) => getMemberId(user) || user?._id;
const EMPTY_SELECTED_MEMBERS = [];

export default function CreateGroupModule({ 
  isOpen, 
  onClose, 
  onCreate, 
  contacts = { people: [] },
  initialSelectedMembers = EMPTY_SELECTED_MEMBERS,
  title = "Tạo nhóm chat"      // Bổ sung
}) {
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(initialSelectedMembers);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const fileInputRef = useRef(null);

  const fallbackFriendsList = useMemo(() => contacts?.people || [], [contacts?.people]);
  const friendsList = friendsLoaded ? friends : fallbackFriendsList;

  useEffect(() => {
    if (isOpen) {
      setSelectedMembers(initialSelectedMembers);
    }
  }, [isOpen, initialSelectedMembers]);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadFriends = async () => {
      setLoadingFriends(true);
      const result = await FriendshipAPI.getFriends();

      if (!cancelled && result.isSuccess) {
        setFriends((result.data || []).map(getFriendFromResponse).filter(Boolean));
        setFriendsLoaded(true);
      }

      if (!cancelled) {
        setLoadingFriends(false);
      }
    };

    loadFriends();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Gợi ý tên khi gõ từ khóa, loại bỏ người đã được chọn
  const suggestions = useMemo(() => {
    const query = memberInput.trim().toLowerCase();
    if (!query) return [];
    return friendsList.filter(
      (user) =>
        (
          getDisplayName(user, "").toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query)
        ) &&
        !selectedMembers.find((m) => String(getFriendUserId(m)) === String(getFriendUserId(user)))
    );
  }, [friendsList, memberInput, selectedMembers]);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddMember = (user) => {
    if (!selectedMembers.find((m) => String(getFriendUserId(m)) === String(getFriendUserId(user)))) {
      setSelectedMembers((prev) => [...prev, user]);
    }
    setMemberInput("");
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers((prev) => prev.filter((m) => String(getFriendUserId(m)) !== String(id)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) handleAddMember(suggestions[0]);
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedMembers.length === 0 || submitting) return;

    setSubmitting(true);
    try {
      const result = await onCreate?.(
        groupName.trim(), 
        selectedMembers.map(getFriendUserId).filter(Boolean), 
        avatarFile
      );
      if (result && result.isSuccess) {
        setGroupName("");
        setSelectedMembers([]);
        setAvatarFile(null);
        setAvatarPreview("");
        onClose();
      }
    } catch (error) {
      console.error("CREATE GROUP SUBMIT ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(groupName.trim() && selectedMembers.length > 0);

  return (
    <div className="flex flex-col bg-white" style={{ maxHeight: "90vh", overflowY: "auto" }}>
      {/* ── Header ─────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center px-6 py-5 shrink-0 rounded-[15px]" 
        style={{ background: "linear-gradient(135deg, #0033FF 0%, #7C3AED 100%)" }}
      >
        <button
          onClick={onClose}
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Users size={16} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-white">{title}</h2>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* ── Tên nhóm ───────────────────────────── */}
        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Tên nhóm
          </label>
          <div className="flex items-center gap-3">
            {/* Nút đổi ảnh nhóm */}
            <button
              type="button"
              onClick={handleAvatarClick}
              className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#F0F4FF] text-[#6366F1] transition hover:bg-[#E0E7FF] overflow-hidden p-0 cursor-pointer"
              title="Thêm ảnh nhóm"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Group Preview" className="h-full w-full object-cover" />
              ) : (
                <Camera size={18} />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <input
              type="text"
              placeholder="Đặt tên cho nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 rounded-2xl border-2 border-transparent bg-[#F0F4FF] px-4 py-3 text-[15px] font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none transition focus:border-[#6366F1]/40 focus:bg-white"
            />
          </div>
        </div>

        {/* ── Thêm thành viên ────────────────────── */}
        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Thành viên {selectedMembers.length > 0 && `(${selectedMembers.length})`}
          </label>

          {/* Tags thành viên đã chọn */}
          {selectedMembers.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <div
                  key={getFriendUserId(member)}
                  className="flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[13px] font-bold text-[#4F46E5]"
                >
                  <img
                    src={getAvatarUrl(member, DEFAULT_AVATAR)}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover border border-white"
                  />
                  <span>{getDisplayName(member, "Bạn bè")}</span>
                  <button
                    onClick={() => handleRemoveMember(getFriendUserId(member))}
                    className="ml-0.5 text-[#6366F1] hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Ô tìm thành viên */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-transparent bg-[#F0F4FF] px-4 py-3 transition focus-within:border-[#6366F1]/40 focus-within:bg-white">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm bạn bè để thêm vào nhóm..."
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[14px] font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Dropdown gợi ý */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {suggestions.map((user) => (
                  <button
                    key={getFriendUserId(user)}
                    type="button"
                    onClick={() => handleAddMember(user)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#F0F4FF]"
                  >
                    <img
                      src={getAvatarUrl(user, DEFAULT_AVATAR)}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-bold text-slate-800">
                        {getDisplayName(user, "Bạn bè")}
                      </p>
                      <p className="truncate text-[12px] text-slate-400">
                        {user.email || user.username || "Bạn bè"}
                      </p>
                    </div>
                    <Plus size={16} className="text-[#6366F1] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Bạn bè gần đây ─────────────────────── */}
        {friendsList.length > 0 && (
          <div>
            <label className="mb-3 block text-[12px] font-black uppercase tracking-widest text-slate-400">
              Bạn bè gần đây
            </label>
            <div className="space-y-1.5">
              {friendsList.slice(0, 4).map((friend) => {
                const friendUserId = getFriendUserId(friend);
                const isSelected = selectedMembers.some(
                  (m) => String(getFriendUserId(m)) === String(friendUserId)
                );
                return (
                  <div
                    key={friendUserId}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                      isSelected ? "bg-[#EEF2FF]" : "hover:bg-[#F8FAFF]"
                    }`}
                  >
                    <img
                      src={getAvatarUrl(friend, DEFAULT_AVATAR)}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-bold text-slate-800">
                        {getDisplayName(friend, "Bạn bè")}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        isSelected ? handleRemoveMember(friendUserId) : handleAddMember(friend)
                      }
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isSelected
                          ? "bg-[#6366F1] text-white hover:bg-red-500"
                          : "bg-[#F0F4FF] text-[#6366F1] hover:bg-[#E0E7FF]"
                      }`}
                    >
                      {isSelected ? <Check size={15} /> : <Plus size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {friendsList.length === 0 && (
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center text-[13px] font-semibold text-slate-400">
            {loadingFriends ? "Đang tải danh sách bạn bè..." : "Chưa có bạn bè nào để thêm vào nhóm."}
          </div>
        )}

        {/* ── Footer ─────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            size="large"
            className="flex-1 !rounded-xl !border-gray-200 !text-[15px] !font-bold !text-slate-600 hover:!bg-gray-50"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            disabled={!canSubmit || submitting}
            loading={submitting}
            onClick={handleSubmit}
            className="flex-1 !rounded-xl !bg-[#6366F1] !border-none !text-[15px] !font-bold hover:!opacity-90 disabled:!opacity-40"
          >
            Tạo nhóm
          </Button>
        </div>
      </div>
    </div>
  );
}
