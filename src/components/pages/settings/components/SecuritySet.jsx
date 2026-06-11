import { useState } from "react";
import { Trash2, KeyRound } from "lucide-react";
import { Input, Modal, message } from "antd";
import UserAPI from "../../../../apis/user.api.jsx";
import WebSocketAPI from "../../../../apis/websocket.api.jsx";
import { useAuth } from "../../../../contexts/auth.context.jsx";
import { clearStoredAuth } from "../../../../helpers/token.helper.js";
import {
  getFirstValidationError,
  validateConfirmPassword,
  validatePassword,
  validateRequired,
} from "../../../../utils/form-validation.util.js";

const SecuritySet = () => {
  const { setUser } = useAuth();
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState(""); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleSavePassword = async () => {
    const validationError = getFirstValidationError([
      () => validateRequired(passData.current, "Mật khẩu hiện tại"),
      () => validatePassword(passData.new, "Mật khẩu mới"),
      () => validateConfirmPassword(passData.new, passData.confirm),
      () =>
        passData.current === passData.new
          ? "Mật khẩu mới không được trùng mật khẩu hiện tại."
          : "",
    ]);

    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSavingPassword(true);
    setError("");
    const response = await UserAPI.changePassword({
      currentPassword: passData.current,
      newPassword: passData.new,
      confirmPassword: passData.confirm,
    });
    setSavingPassword(false);

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    message.success("Đổi mật khẩu thành công!");
    setIsChangingPass(false);
    setPassData({ current: "", new: "", confirm: "" }); 
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    const response = await UserAPI.deleteMyAccount();
    setDeletingAccount(false);

    if (!response.isSuccess) {
      message.error(response.message);
      return;
    }

    setShowDeleteModal(false);
    await WebSocketAPI.disconnect();
    clearStoredAuth();
    setUser(null);
    message.success("Tài khoản đã được xóa.");
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full select-none text-left overflow-hidden">
      
      {/* ── TIÊU ĐỀ ĐỒNG BỘ ── */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-gray-700 px-1 flex items-center gap-2">
          <KeyRound size={18} className="text-gray-500" />
          Tài khoản và bảo mật
        </h2>
      </div>

      {/* ── CỤM 1: BẢO MẬT TÀI KHOẢN ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Bảo mật tài khoản</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-medium text-gray-700">Quản lý mật khẩu</span>
              {!isChangingPass && (
                <button onClick={() => setIsChangingPass(true)} className="text-sm text-[#0033FF] font-semibold hover:underline bg-transparent border-none cursor-pointer">
                  Đổi mật khẩu
                </button>
              )}
            </div>

            {isChangingPass && (
              <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input.Password 
                  placeholder="Mật khẩu hiện tại" 
                  value={passData.current}
                  disabled={savingPassword}
                  minLength={1}
                  maxLength={72}
                  onChange={(e) => setPassData({...passData, current: e.target.value})}
                  className="rounded-xl py-2"
                />
                <Input.Password 
                  placeholder="Ít nhất 8 ký tự, gồm hoa/thường/số/ký tự đặc biệt" 
                  value={passData.new}
                  disabled={savingPassword}
                  minLength={8}
                  maxLength={72}
                  onChange={(e) => setPassData({...passData, new: e.target.value})}
                  className="rounded-xl py-2"
                />
                <Input.Password 
                  placeholder="Xác nhận mật khẩu" 
                  value={passData.confirm}
                  disabled={savingPassword}
                  minLength={8}
                  maxLength={72}
                  onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                  className="rounded-xl py-2"
                />
                
                {error && <p className="text-red-500 text-xs px-1">{error}</p>}

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    disabled={savingPassword}
                    onClick={() => { setIsChangingPass(false); setError(""); }}
                    className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-60 font-semibold text-gray-700 text-sm border-none cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={savingPassword}
                    onClick={handleSavePassword}
                    className="px-5 py-2 rounded-xl bg-[#0033FF] hover:bg-blue-700 disabled:bg-blue-300 font-semibold text-white text-sm border-none cursor-pointer"
                  >
                    {savingPassword ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CỤM 2: DỮ LIỆU ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Dữ liệu</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div onClick={() => setShowDeleteModal(true)} className="flex items-center justify-between py-2 px-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 bg-red-50 rounded-lg"><Trash2 size={18} /></div>
              <span className="font-medium">Xóa tài khoản</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Xác nhận xóa tài khoản"
        open={showDeleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        confirmLoading={deletingAccount}
        okText="Đồng ý"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p className="py-4 text-gray-600 font-medium">
          Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác và toàn bộ dữ liệu của bạn sẽ bị xóa.
        </p>
      </Modal>
    </div>
  );
};

export default SecuritySet;
