import axios from "axios";
import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
  LOGIN: `${URL}/auth/login`,
  REGISTER: `${URL}/auth/register`,
  GET_PROFILE: `${URL}/users/me`,
  LOGOUT: `${URL}/auth/logout`,
  SEARCH_BY_EMAIL: `${URL}/users/search-by-email`,
  FORGOT_PASSWORD: `${URL}/auth/forgot-password`,
  VERIFY_RESET_OTP: `${URL}/auth/verify-reset-otp`,
  RESET_PASSWORD: `${URL}/auth/reset-password`,
};

const clearAuthHeader = () => {
  delete axios.defaults.headers.common["Authorization"];
};

const UserAPI = {
  register: async (data) => {
    try {
      clearAuthHeader();

      const response = await axios.post(API_URL.REGISTER, data);

      return {
        isSuccess: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      return {
        isSuccess: false,
        data: null,
        message: error.response?.data?.message || "Đăng ký thất bại",
      };
    }
  },

  login: async (data) => {
    try {
      // Xóa token/header cũ trước khi login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");

      clearAuthHeader();

      const response = await axios.post(API_URL.LOGIN, data);

      console.log("LOGIN RESPONSE:", response.data);

      const accessToken = response.data?.data?.accessToken;
      const refreshToken = response.data?.data?.refreshToken;

      if (!accessToken) {
        return {
          isSuccess: false,
          data: null,
          message: "Backend không trả accessToken",
        };
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return {
        isSuccess: true,
        data: response.data.data,
        message: response.data.message || "Đăng nhập thành công",
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return {
        isSuccess: false,
        data: null,
        message:
          error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại",
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_PROFILE);

      return {
        isSuccess: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      return {
        isSuccess: false,
        data: null,
        message:
          error.response?.data?.message || "Lấy thông tin người dùng thất bại",
      };
    }
  },

  searchByEmail: async (email) => {
    try {
      const response = await authorizedAxios().get(`${API_URL.SEARCH_BY_EMAIL}?email=${email}`);
      return {
        isSuccess: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Không tìm thấy người dùng",
      };
    }
  },

  logout: async () => {
    try {
      const response = await authorizedAxios().post(API_URL.LOGOUT);
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      clearAuthHeader();

      return {
        isSuccess: true,
        message: "Đăng xuất thành công",
      };
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      // Vẫn clear token ở client dù API báo lỗi
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      clearAuthHeader();

      return {
        isSuccess: false,
        message: error.response?.data?.message || "Đăng xuất thất bại",
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(API_URL.FORGOT_PASSWORD, { email });
      return {
        isSuccess: true,
        message: response.data.message || "Đã gửi mã OTP.",
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Lỗi khi gửi yêu cầu quên mật khẩu.",
      };
    }
  },

  verifyResetOtp: async (email, otp) => {
    try {
      const response = await axios.post(API_URL.VERIFY_RESET_OTP, { email, otp });
      return {
        isSuccess: true,
        data: response.data.data,
        message: response.data.message || "Xác thực OTP thành công.",
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.",
      };
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axios.post(API_URL.RESET_PASSWORD, { resetToken, newPassword });
      return {
        isSuccess: true,
        message: response.data.message || "Đổi mật khẩu thành công.",
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || "Lỗi khi đặt lại mật khẩu.",
      };
    }
  }
};

export default UserAPI;
