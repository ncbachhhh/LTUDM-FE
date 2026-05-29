import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import { Form, Input, Checkbox, Button, Typography } from "antd";
import { FaArrowLeft } from "react-icons/fa";

const { Title } = Typography;

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
    if (event && event.preventDefault) {
      event.preventDefault();
    }

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
        className="absolute top-5 left-5 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black"
      >
        <FaArrowLeft className="w-4 h-4" />
      </button>

      <Title level={2} className="!text-2xl !font-bold !text-black !text-center !mt-0 !mb-6">
        Đăng ký
      </Title>

      <Form onFinish={handleRegister} layout="vertical" className="flex flex-col gap-4">
        <Form.Item 
          label={<span className="text-sm font-bold text-black">Tên hiển thị</span>}
          className="!mb-0"
        >
          <Input
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            placeholder="Nhập tên hiển thị"
            size="large"
            className="w-full !p-3 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <Form.Item 
          label={<span className="text-sm font-bold text-black">Username</span>}
          className="!mb-0"
        >
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập username"
            size="large"
            className="w-full !p-3 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <Form.Item 
          label={<span className="text-sm font-bold text-black">Email</span>}
          className="!mb-0"
        >
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Nhập email"
            size="large"
            className="w-full !p-3 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <Form.Item 
          label={<span className="text-sm font-bold text-black">Mật khẩu</span>}
          className="!mb-0"
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tạo mật khẩu ít nhất 8 ký tự"
            size="large"
            className="w-full !p-3 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <div className="mt-1">
          <Checkbox
            name="terms"
            checked={formData.terms}
            onChange={(e) => {
              handleChange({
                target: {
                  name: 'terms',
                  type: 'checkbox',
                  checked: e.target.checked
                }
              });
            }}
            className="text-xs text-black font-medium leading-relaxed"
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
          </Checkbox>
        </div>

        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full !p-6 !mt-4 !rounded-xl !bg-blue-600 !text-white !font-bold !text-lg hover:!bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center border-none"
          >
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default RegisterForm;
