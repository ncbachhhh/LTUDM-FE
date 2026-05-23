import React, { useState } from "react";
import ModalWrapper from "../../../../../common/ModalWrapper";
import ConversationAPI from "../../../../../../apis/conversation.api.jsx";
import { DEFAULT_AVATAR } from "../../../../../../constants/asset.constants.js";

const getMemberId = (member) => member?.user_id || member?.userId || member?.id;

const getMemberName = (member) =>
  member?.nickname || member?.display_name || member?.displayName || member?.username || "Người dùng";

const getRealName = (member) =>
  member?.display_name || member?.displayName || member?.username || "Người dùng";

export default function EditNickname({ isOpen, onClose, conversationId, members = [], onUpdated }) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleEditClick = (member) => {
    setEditingUserId(getMemberId(member));
    setEditValue(member.nickname || "");
    setError("");
  };

  const handleSaveClick = async (memberId) => {
    if (!conversationId || !memberId || saving) return;

    setSaving(true);
    setError("");
    const result = await ConversationAPI.updateMemberNickname(
      conversationId,
      memberId,
      editValue
    );
    setSaving(false);

    if (!result.isSuccess) {
      setError(result.message);
      return;
    }

    setEditingUserId(null);
    onUpdated?.(result.data);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Chỉnh sửa biệt danh">
      <div className="flex flex-col gap-4 mt-2">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {members.length === 0 && (
          <div className="rounded-lg bg-gray-50 px-3 py-6 text-center text-sm font-bold text-gray-400">
            Chưa có thông tin thành viên.
          </div>
        )}

        {members.map((member) => {
          const memberId = getMemberId(member);
          const isEditing = editingUserId === memberId;

          return (
            <div key={memberId} className="flex items-center justify-between gap-3">
              <img
                src={member.avatar_url || member.avatarUrl || DEFAULT_AVATAR}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />

              {isEditing ? (
                <>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(event) => setEditValue(event.target.value)}
                      placeholder="Để trống để xóa biệt danh"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => handleSaveClick(memberId)}
                    className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
                  >
                    ✓
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {getMemberName(member)}
                    </h4>
                    <p className="text-[12px] text-gray-500 truncate">
                      {member.nickname ? getRealName(member) : "Đặt biệt danh"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditClick(member)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    ✎
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </ModalWrapper>
  );
}
