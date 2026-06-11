import React, { useState } from "react";
import UserAPI from "../../../apis/user.api.jsx";
import { useNotification } from "../../../contexts/notification.context.jsx";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  DatePicker,
} from "antd";
import { FaArrowLeft } from "react-icons/fa";
import {
  getFirstValidationError,
  trimValue,
  validateBirthDate,
  validateDisplayName,
  validateEmail,
  validateGender,
  validatePassword,
} from "../../../utils/form-validation.util.js";

const { Title } = Typography;

const RegisterForm = ({ setView }) => {
  const { api } = useNotification();

  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    birth_date: "",
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

    const validationError = getFirstValidationError([
      () => validateDisplayName(formData.display_name),
      () => validateGender(formData.gender),
      () => validateBirthDate(formData.birth_date),
      () => validateEmail(formData.email),
      () => validatePassword(formData.password),
      () => (!formData.terms ? "Bạn cần đồng ý với điều khoản dịch vụ." : ""),
    ]);

    if (validationError) {
      api.warning({
        message: "Thông tin không hợp lệ",
        description: validationError,
        placement: "topRight",
      });
      return;
    }

    const data = {
      email: trimValue(formData.email),
      gender: formData.gender,
      birth_date: formData.birth_date,
      password: formData.password,
      display_name: trimValue(formData.display_name),
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

      <Title
        level={2}
        className="!text-2xl !font-bold !text-black !text-center !mt-0 !mb-6"
      >
        Đăng ký
      </Title>

      <Form
        onFinish={handleRegister}
        layout="vertical"
        className="flex flex-col gap-4"
      >
        <Form.Item
          label={
            <span className="text-sm font-bold text-black">Tên hiển thị</span>
          }
          className="!mb-0"
        >
          <Input
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            maxLength={100}
            placeholder="Nhập tên hiển thị"
            size="large"
            className="w-full !p-3 !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold placeholder-blue-500/70 border-none outline-none focus:!ring-2 focus:!ring-blue-600"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-sm font-bold text-black">Giới tính</span>
            }
            className="!mb-0"
          >
            <Select
              value={formData.gender || undefined}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  gender: value,
                })
              }
              placeholder="Chọn giới tính"
              size="large"
              className="w-full !h-[48px] !rounded-xl !font-semibold !bg-[#C7D2FE]"
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-bold text-black">Ngày sinh</span>
            }
            className="!mb-0"
          >
            <DatePicker
              onChange={(date) =>
                setFormData({
                  ...formData,
                  birth_date: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              placeholder="Chọn ngày sinh"
              size="large"
              format="DD/MM/YYYY"
              className="w-full !h-[48px] !rounded-xl !bg-[#C7D2FE] !text-blue-900 !font-semibold border-none outline-none focus:!ring-2 focus:!ring-blue-600"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-sm font-bold text-black">Email</span>}
          className="!mb-0"
        >
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            maxLength={255}
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
            minLength={8}
            maxLength={72}
            placeholder="Ít nhất 8 ký tự, gồm hoa/thường/số/ký tự đặc biệt"
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
                  name: "terms",
                  type: "checkbox",
                  checked: e.target.checked,
                },
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
