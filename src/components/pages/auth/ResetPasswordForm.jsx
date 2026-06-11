import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import { Form, Input, Button, Typography } from "antd";
import {
  getFirstValidationError,
  validateConfirmPassword,
  validatePassword,
  validateRequired,
} from "../../../utils/form-validation.util.js";

const { Title, Paragraph } = Typography;

const ResetPasswordForm = ({ setView, resetToken }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { api } = useNotification();

  const handleReset = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const validationError = getFirstValidationError([
      () => validateRequired(resetToken, "Phiên đặt lại mật khẩu"),
      () => validatePassword(newPassword, "Mật khẩu mới"),
      () => validateConfirmPassword(newPassword, confirmPassword),
    ]);

    if (validationError) {
      api.warning({
        message: "Mật khẩu không hợp lệ",
        description: validationError,
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    const result = await UserAPI.resetPassword(resetToken, newPassword);
    setLoading(false);

    if (result.isSuccess) {
      api.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
        placement: "topRight",
      });
      setView("login");
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
        <Title level={2} className="!text-2xl !font-bold !text-black !w-full !text-center !mt-0 !mb-0">Đặt lại mật khẩu</Title>
      </div>

      <div className="mb-6">
        <Paragraph className="!text-sm !text-gray-700 !leading-relaxed !font-medium !text-center !mb-0">
          Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
        </Paragraph>
      </div>

      <Form onFinish={handleReset} layout="vertical" className="flex flex-col gap-4">
        <Form.Item 
          label={<span className="text-sm font-bold text-black">Mật khẩu mới</span>}
          className="!mb-0"
        >
          <Input.Password
            required
            placeholder="Ít nhất 8 ký tự, gồm hoa/thường/số/ký tự đặc biệt"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            maxLength={72}
            size="large"
            className="w-full !p-4 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <Form.Item 
          label={<span className="text-sm font-bold text-black">Xác nhận mật khẩu</span>}
          className="!mb-0"
        >
          <Input.Password
            required
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            maxLength={72}
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
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default ResetPasswordForm;
