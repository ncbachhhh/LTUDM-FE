import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../../../apis/user.api.jsx";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import { Form, Input, Button, Typography } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import {
    getFirstValidationError,
    trimValue,
    validateEmail,
    validateRequired,
} from "../../../utils/form-validation.util.js";

const { Title } = Typography;

const LoginForm = ({ setView }) => {
    const navigate = useNavigate();
    const { getProfile } = useAuth();
    const { api } = useNotification();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        const validationError = getFirstValidationError([
            () => validateEmail(formData.email),
            () => validateRequired(formData.password, "Mật khẩu"),
        ]);

        if (validationError) {
            api.warning({
                message: "Thông tin không hợp lệ",
                description: validationError,
                placement: "topRight",
            });
            return;
        }

        setLoading(true);

        const result = await UserAPI.login({
            email: trimValue(formData.email),
            password: formData.password,
        });

        if (result?.isSuccess) {
            await getProfile();

            api.success({
                message: "Đăng nhập thành công",
                description: "Đang chuyển vào trang chat",
                placement: "topRight",
            });

            setLoading(false);
            navigate("/chat");
        } else {
            setLoading(false);

            api.error({
                message: "Đăng nhập thất bại",
                description: result?.message || "Email hoặc mật khẩu không đúng",
                placement: "topRight",
            });
        }
    };

    return (
        <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[calc(100%-32px)] max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
            <button
                onClick={() => setView("landing")}
                className="absolute top-5 left-5 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black"
            >
                <FaArrowLeft className="w-4 h-4" />
            </button>

            <Title level={2} className="!text-2xl !font-bold !text-black !text-center !mt-0 !mb-6">
                Đăng nhập
            </Title>

            <Form onFinish={handleLogin} className="flex flex-col gap-4">
                <Form.Item className="!mb-0">
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        maxLength={255}
                        placeholder="Nhập email"
                        size="large"
                        className="w-full !p-4 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
                    />
                </Form.Item>

                <Form.Item className="!mb-0">
                    <Input.Password
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={1}
                        maxLength={72}
                        placeholder="Nhập mật khẩu"
                        size="large"
                        className="w-full !p-4 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
                    />
                </Form.Item>

                <Form.Item className="!mb-0">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full !p-6 !rounded-xl !bg-blue-600 !text-white !font-bold !text-lg hover:!bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center border-none"
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            <div className="flex justify-center mt-4 mb-6">
                <Button
                    type="link"
                    onClick={() => setView("forget")}
                    className="!text-center !text-sm !font-bold !text-black cursor-pointer hover:!underline p-0 h-auto"
                >
                    Quên mật khẩu?
                </Button>
            </div>

            <Button
                onClick={() => setView("register")}
                size="large"
                className="w-full !p-6 !rounded-xl !border !border-blue-600 !text-blue-800 !font-bold hover:!bg-blue-100 transition-colors flex items-center justify-center"
            >
                Đăng ký tài khoản mới
            </Button>
        </section>
    );
};

export default LoginForm;
