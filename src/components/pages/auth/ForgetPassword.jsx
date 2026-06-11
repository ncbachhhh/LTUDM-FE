import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import { Form, Input, Button, Typography } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { trimValue, validateEmail } from "../../../utils/form-validation.util.js";

const { Title, Paragraph } = Typography;

const ForgetPassword = ({ setView, setResetEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { api } = useNotification();

  const handleResetPassword = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const validationError = validateEmail(email);
    if (validationError) {
      api.warning({
        message: "Email không hợp lệ",
        description: validationError,
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    const result = await UserAPI.forgotPassword(trimValue(email));
    setLoading(false);

    if (result.isSuccess) {
      api.success({
        message: "Thành công",
        description: result.message,
        placement: "topRight",
      });
      setResetEmail(trimValue(email));
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
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[calc(100%-32px)] max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      <button
        onClick={() => setView("login")}
        className="absolute top-5 left-5 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black"
      >
        <FaArrowLeft className="w-4 h-4" />
      </button>

      <Title level={2} className="!text-2xl !font-bold !text-black !text-center !mt-0 !mb-2">Khôi phục mật khẩu</Title>

      <Paragraph className="!text-center !text-sm !text-gray-600 !font-medium !mb-6 !px-4">
        Vui lòng nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận (OTP) cho bạn.
      </Paragraph>

      <Form onFinish={handleResetPassword} layout="vertical" className="flex flex-col gap-4">
        <Form.Item 
          label={<span className="text-sm font-bold text-black">Email</span>}
          className="!mb-0"
        >
          <Input
            required
            type="email"
            maxLength={255}
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            size="large"
            className="w-full !p-4 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full !p-6 !mt-2 !rounded-xl !bg-blue-600 !text-white !font-bold !text-lg hover:!bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center border-none"
          >
            Gửi mã xác nhận
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default ForgetPassword;
