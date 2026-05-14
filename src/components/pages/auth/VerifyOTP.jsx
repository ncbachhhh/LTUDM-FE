import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";

const VerifyOTP = ({ setView, resetEmail, setResetToken }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { api } = useNotification();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      api.warning({
        message: "Lỗi",
        description: "Mã OTP phải có 6 chữ số.",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    const result = await UserAPI.verifyResetOtp(resetEmail, otp);
    setLoading(false);

    if (result.isSuccess) {
      api.success({
        message: "Thành công",
        description: result.message,
        placement: "topRight",
      });
      setResetToken(result.data.resetToken);
      setView('reset-password'); 
    } else {
      api.error({
        message: "Lỗi",
        description: result.message,
        placement: "topRight",
      });
    }
  };

  const handleResend = async () => {
    if (!resetEmail) return;
    setResending(true);
    const result = await UserAPI.forgotPassword(resetEmail);
    setResending(false);

    if (result.isSuccess) {
      api.success({
        message: "Đã gửi lại",
        description: result.message,
        placement: "topRight",
      });
    } else {
      api.error({
        message: "Lỗi",
        description: result.message,
        placement: "topRight",
      });
    }
  };

  return (
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      
      <div className="flex items-center mb-6 relative">
        <button 
          onClick={() => setView('forget')} 
          className="absolute left-0 text-xl font-black text-black hover:text-gray-600 transition-colors"
        >
          &lt;
        </button>
        <h2 className="text-2xl font-bold text-black w-full text-center">Quên mật khẩu</h2>
      </div>
      
      {/* NỘI DUNG: Tiêu đề phụ và Mô tả */}
      <div className="mb-6">
        <h3 className="font-bold text-black text-lg mb-1">Xác nhận tài khoản</h3>
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          Chúng tôi đã gửi mã qua email <b>{resetEmail}</b>. Hãy nhập mã đó để xác nhận tài khoản.
        </p>
      </div>

      {/* FORM NHẬP MÃ */}
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        
        <input 
          required 
          type="text" 
          placeholder="Nhập mã 6 chữ số" 
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600 text-center tracking-widest text-lg" 
        />
        
        {/* Nút Tiếp tục (Submit) */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-4 mt-2 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang kiểm tra..." : "Tiếp tục"}
        </button>
        
      </form>

      {/* Nút Gửi lại mã  */}
      <button 
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="w-full mt-4 p-4 rounded-xl border border-blue-600 text-black font-bold hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {resending ? "Đang gửi..." : "Bạn chưa nhận được mã ?"}
      </button>

    </section>
  );
};

export default VerifyOTP;

