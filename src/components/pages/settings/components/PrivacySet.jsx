import React, { useState } from "react";
import { AtSign, Eye, Shield } from "lucide-react"; // Thêm Icon Shield
import { Switch, Select, message } from "antd";
import UserAPI from "../../../../apis/user.api.jsx";
import { useAuth } from "../../../../contexts/auth.context.jsx";

const PrivacySet = () => {
  const { user, setUser } = useAuth();
  const [showBirthday, setShowBirthday] = useState(
    () => user?.showBirthday || user?.show_birthday || "full",
  );
  const [onlineStatus, setOnlineStatus] = useState(
    () => user?.onlineStatus ?? user?.online_status ?? true,
  );
  const [showEmail, setShowEmail] = useState(
    () => user?.showEmail ?? user?.show_email ?? true,
  ); 
  const [mentionSuggestions, setMentionSuggestions] = useState(
    () => user?.mentionSuggestions ?? user?.mention_suggestions ?? true,
  );
  const [readReceipts, setReadReceipts] = useState(
    () => user?.readReceipts ?? user?.read_receipts ?? true,
  );
  const [savingKey, setSavingKey] = useState("");

  const updateSetting = async (key, value, applyLocalValue) => {
    const previousValue = applyLocalValue();
    setSavingKey(key);

    const response = await UserAPI.updateSettings({ [key]: value });
    setSavingKey("");

    if (!response.isSuccess) {
      previousValue();
      message.error(response.message);
      return;
    }

    setUser(response.data);
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden">
      
      {/* ── TIÊU ĐỀ ĐỒNG BỘ ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-gray-700 px-1 flex items-center gap-2">
          <Shield size={18} className="text-gray-500" />
          Quyền riêng tư
        </h2>
      </div>
      
      {/* ── CỤM 1: CÁ NHÂN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Cá nhân</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-gray-700">Hiện ngày sinh</span>
            <Select 
              value={showBirthday} 
              disabled={savingKey === "showBirthday"}
              onChange={(value) =>
                updateSetting("showBirthday", value, () => {
                  const previous = showBirthday;
                  setShowBirthday(value);
                  return () => setShowBirthday(previous);
                })
              } 
              style={{ width: 220 }}
              options={[
                { value: "full", label: "Hiện đầy đủ ngày, tháng, năm" },
                { value: "hide", label: "Ẩn ngày sinh" }
              ]} 
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-medium text-gray-700">Hiển thị trạng thái truy cập</span>
            <Switch
              checked={onlineStatus}
              loading={savingKey === "onlineStatus"}
              onChange={(checked) =>
                updateSetting("onlineStatus", checked, () => {
                  const previous = onlineStatus;
                  setOnlineStatus(checked);
                  return () => setOnlineStatus(previous);
                })
              }
            />
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-50 mt-1">
            <span className="font-medium text-gray-700">Hiện Email</span>
            <Switch
              checked={showEmail}
              loading={savingKey === "showEmail"}
              onChange={(checked) =>
                updateSetting("showEmail", checked, () => {
                  const previous = showEmail;
                  setShowEmail(checked);
                  return () => setShowEmail(previous);
                })
              }
            />
          </div>
        </div>
      </div>

      {/* ── CỤM 2: TIN NHẮN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Tin nhắn</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AtSign size={18} /></div>
              <div>
                <div className="font-medium text-[15px]">Gợi ý nhắc tên</div>
                <div className="text-xs text-gray-400 mt-0.5">Gợi ý nhắc tên theo nội dung đang soạn</div>
              </div>
            </div>
            <Switch
              checked={mentionSuggestions}
              loading={savingKey === "mentionSuggestions"}
              onChange={(checked) =>
                updateSetting("mentionSuggestions", checked, () => {
                  const previous = mentionSuggestions;
                  setMentionSuggestions(checked);
                  return () => setMentionSuggestions(previous);
                })
              }
            />
          </div>
          <div className="flex items-center justify-between py-2 mt-2 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Eye size={18} /></div>
              <span className="font-medium text-[15px]">Hiện trạng thái "Đã xem"</span>
            </div>
            <Switch
              checked={readReceipts}
              loading={savingKey === "readReceipts"}
              onChange={(checked) =>
                updateSetting("readReceipts", checked, () => {
                  const previous = readReceipts;
                  setReadReceipts(checked);
                  return () => setReadReceipts(previous);
                })
              }
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PrivacySet;
