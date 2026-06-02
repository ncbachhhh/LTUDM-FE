import React, { useState } from "react";
import { Smartphone, Trash2, KeyRound } from "lucide-react";
import { Switch, Input, Modal, message } from "antd";

const SecuritySet = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState(""); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSavePassword = () => {
    if (passData.current !== "123456") return setError("Mật khẩu hiện tại không chính xác.");
    if (passData.new !== passData.confirm) return setError("Mật khẩu mới không khớp với xác nhận.");
    if (passData.new.length < 6) return setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
    
    setError("");
    setIsChangingPass(false);
    message.success("Đổi mật khẩu thành công!");
    setPassData({ current: "", new: "", confirm: "" }); 
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
                  onChange={(e) => setPassData({...passData, current: e.target.value})}
                  className="rounded-xl py-2"
                />
                <Input.Password 
                  placeholder="Mật khẩu mới" 
                  value={passData.new}
                  onChange={(e) => setPassData({...passData, new: e.target.value})}
                  className="rounded-xl py-2"
                />
                <Input.Password 
                  placeholder="Xác nhận mật khẩu" 
                  value={passData.confirm}
                  onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                  className="rounded-xl py-2"
                />
                
                {error && <p className="text-red-500 text-xs px-1">{error}</p>}

                <div className="flex gap-3 mt-1">
                  <button onClick={() => { setIsChangingPass(false); setError(""); }} className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 text-sm border-none cursor-pointer">Hủy</button>
                  <button onClick={handleSavePassword} className="px-5 py-2 rounded-xl bg-[#0033FF] hover:bg-blue-700 font-semibold text-white text-sm border-none cursor-pointer">Lưu</button>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <div className="flex items-center justify-between px-1 py-1">
            <div>
              <div className="font-medium text-gray-700">Xác thực 2 bước</div>
              <div className="text-xs text-gray-400">Thêm lớp bảo mật cho tài khoản</div>
            </div>
            <Switch checked={twoFactor} onChange={setTwoFactor} />
          </div>
        </div>
      </div>

      {/* ── CỤM 2: THIẾT BỊ & DỮ LIỆU ── */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-[16px] font-bold text-black px-1">Thiết bị & Dữ liệu</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Smartphone size={18} /></div>
              <span className="font-medium">Thiết bị đã đăng nhập</span>
            </div>
          </div>
          <div onClick={() => setShowDeleteModal(true)} className="flex items-center justify-between py-2 mt-1 px-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border-t border-gray-50 pt-3">
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
        onOk={() => {
          setShowDeleteModal(false);
          message.success("Đã gửi yêu cầu xóa tài khoản!");
        }}
        onCancel={() => setShowDeleteModal(false)}
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