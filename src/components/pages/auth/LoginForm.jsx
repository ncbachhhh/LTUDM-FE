import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../apis/user.api.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginForm = ({ setView }) => {
    const navigate = useNavigate();
    const { getProfile } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!formData.email || !formData.password) {
            setMessage("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        const data = {
            email: formData.email,
            password: formData.password,
        };

        setLoading(true);

        const result = await UserAPI.login(data);

        if (result?.isSuccess) {
            await getProfile();

            setLoading(false);
            navigate("/chat");
        } else {
            setLoading(false);
            setMessage(result?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <section className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
            <button
                onClick={() => setView("landing")}
                className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
            >
                &lt;
            </button>

            <h2 className="text-2xl font-bold text-black text-center mb-6">
                Đăng nhập
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Nhập Email"
                    className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600"
                />

                {message && (
                    <p className="text-sm text-center font-semibold text-red-600">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-4 mt-2 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <button
                onClick={() => setView("forget")}
                className="text-center text-sm font-bold text-black mt-4 mb-6 cursor-pointer hover:underline"
            >
                Quên mật khẩu ?
            </button>

            <button
                onClick={() => setView("register")}
                className="w-full p-4 rounded-xl border border-blue-600 text-blue-800 font-bold hover:bg-blue-100 transition-colors"
            >
                Đăng ký tài khoản mới
            </button>
        </section>
    );
};

export default LoginForm;