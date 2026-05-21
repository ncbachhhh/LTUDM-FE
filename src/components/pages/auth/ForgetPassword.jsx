import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";

const ForgetPassword = ({ setView, setResetEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { api } = useNotification();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!email) {
      api.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng nhập email",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    const result = await UserAPI.forgotPassword(email);
    setLoading(false);

    if (result.isSuccess) {
      api.success({
        message: "Thành công",
        description: result.message,
        placement: "topRight",
      });
      setResetEmail(email);
      setView("verify-otp");
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
      <button
        onClick={() => setView("login")}
        className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
      >
        &lt;
      </button>

      <h2 className="text-2xl font-bold text-black text-center mb-2">Khôi phục mật khẩu</h2>

      <p className="text-center text-sm text-gray-600 font-medium mb-6 px-4">
        Vui lòng nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận (OTP) cho bạn.
      </p>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">Email</label>
          <input
            required
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 mt-2 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
        </button>
      </form>
    </section>
  );
};

export default ForgetPassword;
