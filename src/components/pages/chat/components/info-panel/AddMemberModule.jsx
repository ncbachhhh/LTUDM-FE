import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { X, Search, Users, Plus, Check } from "lucide-react";
import { DEFAULT_AVATAR, DEFAULT_GROUP_AVATAR } from "../../../../../constants/asset.constants.js";
import { getAvatarUrl, getDisplayName, getMemberId } from "../../../../../utils/identity.util.js";

const getFriendUserId = (user) => getMemberId(user) || user?._id;

export default function AddMemberModule({
  isOpen,
  onClose,
  onAddMembers,
  contacts = { people: [] },
  existingMembers = [],
  groupName = "",
  groupAvatar = ""
}) {
  const [memberInput, setMemberInput] = useState("");
  const [selectedNewMembers, setSelectedNewMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const friendsList = useMemo(() => contacts?.people || [], [contacts?.people]);

  const isAlreadyMember = useCallback((user) => {
    const userId = getFriendUserId(user);
    return existingMembers.some((m) => String(getFriendUserId(m)) === String(userId));
  }, [existingMembers]);

  const availableFriends = useMemo(
    () => friendsList.filter((friend) => !isAlreadyMember(friend)),
    [friendsList, isAlreadyMember]
  );

  const suggestions = useMemo(() => {
    const query = memberInput.trim().toLowerCase();
    if (!query) return [];
    return availableFriends.filter(
      (user) =>
        (
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query)
        ) &&
        !selectedNewMembers.find((m) => String(getFriendUserId(m)) === String(getFriendUserId(user)))
    );
  }, [availableFriends, memberInput, selectedNewMembers]);

  useEffect(() => {
    if (isOpen) {
      setMemberInput("");
      setSelectedNewMembers([]);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMember = (user) => {
    if (isAlreadyMember(user)) return;
    if (!selectedNewMembers.find((m) => String(getFriendUserId(m)) === String(getFriendUserId(user)))) {
      setSelectedNewMembers((prev) => [...prev, user]);
    }
    setMemberInput("");
  };

  const handleRemoveNewMember = (userId) => {
    setSelectedNewMembers((prev) => prev.filter((m) => String(getFriendUserId(m)) !== String(userId)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleAddMember(suggestions[0]);
    }
  };

  const handleSubmit = async () => {
    if (selectedNewMembers.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const newMemberIds = selectedNewMembers.map(getFriendUserId).filter(Boolean);
      const result = await onAddMembers?.(newMemberIds);
      if (result?.isSuccess === false) return;
      setSelectedNewMembers([]);
      setMemberInput("");
      onClose();
    } catch (error) {
      console.error("Lỗi thêm thành viên:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = selectedNewMembers.length > 0;

  return (
    <div className="flex flex-col bg-white" style={{ maxHeight: "90vh", overflowY: "auto" }}>
      {/* ── Header ─────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center px-6 py-5 shrink-0 rounded-[15px]" // 👈 CHỈ CẦN THÊM CLASS NÀY LÀ BO TRÒN 4 GÓC
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
          <h2 className="text-xl font-black text-white">Thêm thành viên</h2>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* ── Tên nhóm và Ảnh nhóm ───────────────── */}
        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Tên nhóm
          </label>
          <div className="flex items-center gap-3 opacity-80">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4FF] border border-gray-100 overflow-hidden">
              <img src={groupAvatar || DEFAULT_GROUP_AVATAR} alt="Group" className="h-full w-full object-cover" />
            </div>
            <input
              type="text"
              value={groupName}
              disabled
              className="flex-1 rounded-2xl border-2 border-transparent bg-gray-100 px-4 py-3 text-[15px] font-semibold text-slate-500 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* ── Thành viên hiện tại ───────────────────────── */}
        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Thành viên hiện tại ({existingMembers.length})
          </label>

          {existingMembers.length > 0 ? (
            <div className="mb-3 max-h-[150px] overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-2">
              {existingMembers.map((member) => (
                <div key={getFriendUserId(member)} className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <img
                    src={getAvatarUrl(member, DEFAULT_AVATAR)}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover border border-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-slate-800">
                      {getDisplayName(member, "Thành viên")}
                    </p>
                    <p className="truncate text-[12px] text-slate-400">
                      {member.email || member.username || "Đang trong nhóm"}
                    </p>
                  </div>
                  <Check size={15} className="shrink-0 text-emerald-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-3 rounded-2xl bg-gray-50 px-4 py-3 text-[13px] font-semibold text-slate-400">
              Chưa có dữ liệu thành viên.
            </div>
          )}
        </div>

        {/* ── Tìm bạn bè để thêm ───────────────────── */}
        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Tìm bạn bè để thêm
          </label>

          {selectedNewMembers.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 rounded-2xl bg-[#F8FAFF] p-2">
              {selectedNewMembers.map((member) => (
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
                    type="button"
                    onClick={() => handleRemoveNewMember(getFriendUserId(member))}
                    className="ml-0.5 text-[#6366F1] hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-transparent bg-[#F0F4FF] px-4 py-3 transition focus-within:border-[#6366F1]/40 focus-within:bg-white">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm bạn bè để thêm..."
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[14px] font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Khung gợi ý khi gõ tìm kiếm */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[200px] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
                {suggestions.map((user) => (
                  <button
                    key={getFriendUserId(user)}
                    type="button"
                    onClick={() => handleAddMember(user)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#F0F4FF]"
                  >
                    <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-bold text-slate-800">{user.name}</p>
                      <p className="truncate text-[12px] text-slate-400">{user.email || "Bạn bè"}</p>
                    </div>
                    <Plus size={16} className="text-[#6366F1] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Danh Sách Bạn Bè Có Thể Thêm ────────────────── */}
        {availableFriends.length > 0 && (
          <div>
            <label className="mb-3 block text-[12px] font-black uppercase tracking-widest text-slate-400">
              Bạn bè có thể thêm
            </label>
            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
              {availableFriends.map((friend) => {
                const friendId = getFriendUserId(friend);
                const isSelectedNew = selectedNewMembers.some((m) => String(getFriendUserId(m)) === String(friendId));

                return (
                  <div
                    key={friendId}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                      isSelectedNew ? "bg-[#EEF2FF]" : "hover:bg-[#F8FAFF]"
                    }`}
                  >
                    <img src={getAvatarUrl(friend, DEFAULT_AVATAR)} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-bold text-slate-800">
                        {getDisplayName(friend, "Bạn bè")}
                      </p>
                      <p className="truncate text-[12px] text-slate-400">{friend.email || friend.username || "Bạn bè"}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelectedNew) {
                          handleRemoveNewMember(friendId);
                        } else {
                          handleAddMember(friend);
                        }
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isSelectedNew
                          ? "bg-[#6366F1] text-white hover:bg-red-500"
                          : "bg-[#F0F4FF] text-[#6366F1] hover:bg-[#E0E7FF]"
                      }`}
                    >
                      {isSelectedNew ? <Check size={15} /> : <Plus size={15} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {availableFriends.length === 0 && (
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center text-[13px] font-semibold text-slate-400">
            Không còn bạn bè nào để thêm vào nhóm.
          </div>
        )}

        {/* ── Footer Buttons ─────────────────────────── */}
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
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
