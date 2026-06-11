const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_PATTERN = /^\d{6}$/;

export const trimValue = (value) => (typeof value === "string" ? value.trim() : "");

export const validateRequired = (value, label) => {
  if (!trimValue(value)) return `${label} không được để trống.`;
  return "";
};

export const validateEmail = (value) => {
  const email = trimValue(value);
  if (!email) return "Email không được để trống.";
  if (email.length > 255) return "Email không được vượt quá 255 ký tự.";
  if (!EMAIL_PATTERN.test(email)) return "Email không đúng định dạng.";
  return "";
};

export const validateDisplayName = (value) => {
  const displayName = trimValue(value);
  if (!displayName) return "Tên hiển thị không được để trống.";
  if (displayName.length > 100) return "Tên hiển thị không được vượt quá 100 ký tự.";
  return "";
};

export const validatePassword = (value, label = "Mật khẩu") => {
  if (!value) return `${label} không được để trống.`;
  if (value.length < 8) return `${label} phải có ít nhất 8 ký tự.`;
  if (value.length > 72) return `${label} không được vượt quá 72 ký tự.`;
  if (!/[a-z]/.test(value)) return `${label} phải có ít nhất 1 chữ thường.`;
  if (!/[A-Z]/.test(value)) return `${label} phải có ít nhất 1 chữ hoa.`;
  if (!/\d/.test(value)) return `${label} phải có ít nhất 1 chữ số.`;
  if (!/[^A-Za-z0-9]/.test(value)) return `${label} phải có ít nhất 1 ký tự đặc biệt.`;
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const confirmError = validatePassword(confirmPassword, "Mật khẩu xác nhận");
  if (confirmError) return confirmError;
  if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp.";
  return "";
};

export const validateGender = (value) => {
  if (!value) return "Vui lòng chọn giới tính.";
  if (!["male", "female"].includes(value)) return "Giới tính không hợp lệ.";
  return "";
};

export const validateBirthDate = (value) => {
  if (!value) return "Vui lòng chọn ngày sinh.";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Ngày sinh không hợp lệ.";
  if (date.getTime() > Date.now()) return "Ngày sinh không được ở tương lai.";
  return "";
};

export const validateOtp = (value) => {
  const otp = trimValue(value);
  if (!otp) return "Mã OTP không được để trống.";
  if (!OTP_PATTERN.test(otp)) return "Mã OTP phải gồm đúng 6 chữ số.";
  return "";
};

export const getFirstValidationError = (validators) => {
  for (const validator of validators) {
    const error = validator();
    if (error) return error;
  }
  return "";
};
