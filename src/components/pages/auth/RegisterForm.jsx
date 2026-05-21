import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";

const RegisterForm = ({ setView }) => {
  const { api } = useNotification();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    display_name: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.display_name
    ) {
      api.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ thông tin đăng ký",
        placement: "topRight",
      });
      return;
    }

    if (formData.password.length < 8) {
      api.warning({
        message: "Mật khẩu không hợp lệ",
        description: "Mật khẩu phải có ít nhất 8 ký tự",
        placement: "topRight",
      });
      return;
    }

    if (!formData.terms) {
      api.warning({
        message: "Chưa đồng ý điều khoản",
        description: "Bạn cần đồng ý với điều khoản dịch vụ",
        placement: "topRight",
      });
      return;
    }

    const data = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      display_name: formData.display_name,
    };

    setLoading(true);

    const result = await UserAPI.register(data);

    setLoading(false);

    if (result?.isSuccess) {
      api.success({
        message: "Đăng ký thành công",
        description: "Bạn có thể đăng nhập ngay bây giờ",
        placement: "topRight",
      });

      setView("login");
    } else {
      api.error({
        message: "Đăng ký thất bại",
        description: result?.message || "Vui lòng kiểm tra lại thông tin",
        placement: "topRight",
      });
    }
  };

  return (
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[calc(100%-32px)] max-w-[600px] max-h-[92vh] overflow-y-auto bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      <button
        onClick={() => setView("login")}
        className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
      >
        &lt;
      </button>

      <h2 className="text-2xl font-bold text-black text-center mb-6">
        Đăng ký
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Tên hiển thị
          </label>
          <input
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            type="text"
            placeholder="Nhập tên hiển thị"
            className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Nhập username"
            className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Nhập email"
            className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Mật khẩu
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Tạo mật khẩu ít nhất 8 ký tự"
            className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-start gap-2 mt-1">
          <input
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 cursor-pointer accent-blue-600"
          />

          <label
            htmlFor="terms"
            className="text-xs text-black font-medium cursor-pointer leading-relaxed"
          >
            Tôi đã đọc và đồng ý với các{" "}
            <a href="#" className="text-blue-700 font-bold hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-700 font-bold hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của ứng dụng Chat.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 mt-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
        </button>
      </form>
    </section>
  );
};

export default RegisterForm;
