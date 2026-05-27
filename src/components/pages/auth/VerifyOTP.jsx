import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import { Form, Input, Button, Typography } from "antd";
import { FaArrowLeft } from "react-icons/fa";

const { Title, Paragraph, Text } = Typography;

const VerifyOTP = ({ setView, resetEmail, setResetToken }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { api } = useNotification();

  const handleVerify = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

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
      setView("reset-password");
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
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[calc(100%-32px)] max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      <div className="flex items-center mb-6 relative">
        <button
          onClick={() => setView("forget")}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black flex-shrink-0"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <Title level={2} className="!text-2xl !font-bold !text-black !w-full !text-center !mt-0 !mb-0">Quên mật khẩu</Title>
      </div>

      <div className="mb-6">
        <Title level={3} className="!font-bold !text-black !text-lg !mt-0 !mb-1">Xác nhận tài khoản</Title>
        <Paragraph className="!text-sm !text-gray-700 !leading-relaxed !font-medium !mb-0">
          Chúng tôi đã gửi mã qua email <Text strong>{resetEmail}</Text>. Hãy nhập mã đó để xác nhận tài khoản.
        </Paragraph>
      </div>

      <Form onFinish={handleVerify} className="flex flex-col gap-4">
        <Form.Item className="!mb-0 flex justify-center">
          <Input.OTP
            length={6}
            value={otp}
            onChange={setOtp}
            size="large"
          />
        </Form.Item>

        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full !p-6 !mt-2 !rounded-xl !bg-blue-600 !text-white !font-bold !text-lg hover:!bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center border-none"
          >
            Tiếp tục
          </Button>
        </Form.Item>
      </Form>

      <Button
        onClick={handleResend}
        disabled={resending}
        className="w-full mt-4 !p-6 !rounded-xl !border !border-blue-600 !text-black !font-bold hover:!bg-blue-50 transition-colors flex items-center justify-center"
      >
        {resending ? "Đang gửi..." : "Bạn chưa nhận được mã?"}
      </Button>
    </section>
  );
};

export default VerifyOTP;
