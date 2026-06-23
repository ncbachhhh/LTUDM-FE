import { useEffect, useState } from "react";
import { Button } from "antd";
import ModalWrapper from "../../../../../common/ModalWrapper.jsx";
import ConversationAPI from "../../../../../../apis/conversation.api.jsx";

export default function EditGroupName({ isOpen, onClose, conversationId, currentName = "", onUpdated }) {
  const [groupName, setGroupName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setGroupName(currentName || "");
    setError("");
    setSaving(false);
  }, [currentName, isOpen]);

  const handleSave = async () => {
    const title = groupName.trim();
    if (!conversationId || !title || saving) return;

    setSaving(true);
    setError("");
    const result = await ConversationAPI.updateGroupTitle(conversationId, title);
    setSaving(false);

    if (!result.isSuccess) {
      setError(result.message);
      return;
    }

    onUpdated?.(result.data);
    onClose?.();
  };

  const canSave = Boolean(groupName.trim()) && groupName.trim() !== currentName;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Đổi tên nhóm">
      <div className="mt-2 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-[12px] font-black uppercase tracking-widest text-slate-400">
            Tên nhóm
          </label>
          <input
            type="text"
            value={groupName}
            maxLength={150}
            onChange={(event) => setGroupName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
            className="w-full rounded-2xl border-2 border-transparent bg-[#F0F4FF] px-4 py-3 text-[15px] font-semibold text-slate-800 outline-none transition focus:border-[#6366F1]/40 focus:bg-white"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
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
            disabled={!canSave || saving}
            loading={saving}
            onClick={handleSave}
            className="flex-1 !rounded-xl !bg-[#6366F1] !border-none !text-[15px] !font-bold hover:!opacity-90 disabled:!opacity-40"
          >
            Lưu
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
