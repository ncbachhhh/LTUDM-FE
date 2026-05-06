import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx"; // sửa lại path cho đúng project của bạn

const RegisterForm = ({ setView }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    display_name: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.username || !formData.password || !formData.display_name) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!formData.terms) {
      setMessage("Bạn cần đồng ý với điều khoản dịch vụ");
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
      alert("Đăng ký thành công");
      setView("login");
    } else {
      setMessage(result?.message || "Đăng ký thất bại");
    }
  };

  return (
      <section className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
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

          {message && (
              <p className="text-sm text-center font-semibold text-red-600">
                {message}
              </p>
          )}

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