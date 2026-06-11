import axios from "axios";
import { API_BASE_URL } from "../config/app.config.js";
import authorizedAxios from "../helpers/authorizedAxios.js";
import { clearStoredAuth, getRefreshToken, storeTokens } from "../helpers/token.helper.js";
import { failureResponse, successResponse } from "../utils/api-response.util.js";

const API_URL = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_PROFILE: `${API_BASE_URL}/users/me`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  SEARCH_USERS: `${API_BASE_URL}/users/search`,
  SEARCH_BY_EMAIL: `${API_BASE_URL}/users/search-by-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  VERIFY_RESET_OTP: `${API_BASE_URL}/auth/verify-reset-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  UPDATE_SETTINGS: `${API_BASE_URL}/users/settings`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/me/change-password`,
  DELETE_MY_ACCOUNT: `${API_BASE_URL}/users/me`,
};

const anonymousClient = axios.create();

const UserAPI = {
  register: async (data) => {
    try {
      clearStoredAuth();
      const response = await anonymousClient.post(API_URL.REGISTER, data);
      return successResponse(response);
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return failureResponse(error, "Đăng ký thất bại");
    }
  },

  login: async (data) => {
    try {
      clearStoredAuth();

      const response = await anonymousClient.post(API_URL.LOGIN, data);
      const accessToken = response.data?.data?.accessToken;
      const refreshToken = response.data?.data?.refreshToken;

      if (!accessToken) {
        return {
          isSuccess: false,
          data: null,
          message: "Backend không trả accessToken",
        };
      }

      storeTokens({ accessToken, refreshToken });

      return {
        ...successResponse(response),
        message: response.data.message || "Đăng nhập thành công",
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return failureResponse(error, "Đăng nhập thất bại");
    }
  },

  getProfile: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_PROFILE);
      return successResponse(response);
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);
      return failureResponse(error, "Lấy thông tin người dùng thất bại");
    }
  },

  searchByEmail: async (email) => {
    try {
      const response = await authorizedAxios().get(API_URL.SEARCH_BY_EMAIL, {
        params: { email },
      });
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Không tìm thấy người dùng");
    }
  },

  searchUsersForFriendRequest: async (keyword) => {
    try {
      const response = await authorizedAxios().get(API_URL.SEARCH_USERS, {
        params: { keyword },
      });
      return successResponse(response, []);
    } catch (error) {
      return failureResponse(error, "Không tìm thấy người dùng", []);
    }
  },

  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await authorizedAxios().post(API_URL.LOGOUT, { token: refreshToken });
      clearStoredAuth();

      return {
        isSuccess: true,
        message: "Đăng xuất thành công",
      };
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      clearStoredAuth();
      return failureResponse(error, "Đăng xuất thất bại");
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await anonymousClient.post(API_URL.FORGOT_PASSWORD, { email });
      return {
        ...successResponse(response),
        message: response.data.message || "Đã gửi mã OTP.",
      };
    } catch (error) {
      return failureResponse(error, "Lỗi khi gửi yêu cầu quên mật khẩu.");
    }
  },

  verifyResetOtp: async (email, otp) => {
    try {
      const response = await anonymousClient.post(API_URL.VERIFY_RESET_OTP, { email, otp });
      return {
        ...successResponse(response),
        message: response.data.message || "Xác thực OTP thành công.",
      };
    } catch (error) {
      return failureResponse(error, "OTP không hợp lệ hoặc đã hết hạn.");
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await anonymousClient.post(API_URL.RESET_PASSWORD, {
        resetToken,
        newPassword,
      });
      return {
        ...successResponse(response),
        message: response.data.message || "Đổi mật khẩu thành công.",
      };
    } catch (error) {
      return failureResponse(error, "Lỗi khi đặt lại mật khẩu.");
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await authorizedAxios().post(
        `${API_BASE_URL}/users/profile/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return successResponse(response);
    } catch (error) {
      console.error("UPLOAD AVATAR ERROR:", error);
      return failureResponse(error, "Tải ảnh đại diện thất bại");
    }
  },

  uploadBackground: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await authorizedAxios().post(
        `${API_BASE_URL}/users/profile/background`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return successResponse(response);
    } catch (error) {
      console.error("UPLOAD BACKGROUND ERROR:", error);
      return failureResponse(error, "Tải ảnh nền thất bại");
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await authorizedAxios().patch(
        `${API_BASE_URL}/users/profile`,
        data
      );
      return successResponse(response);
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      return failureResponse(error, "Cập nhật thông tin thất bại");
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await authorizedAxios().patch(API_URL.UPDATE_SETTINGS, data);
      return successResponse(response);
    } catch (error) {
      console.error("UPDATE SETTINGS ERROR:", error);
      return failureResponse(error, "Cập nhật cài đặt thất bại");
    }
  },

  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    try {
      const response = await authorizedAxios().post(API_URL.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return successResponse(response);
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
      return failureResponse(error, "Đổi mật khẩu thất bại");
    }
  },

  deleteMyAccount: async () => {
    try {
      const response = await authorizedAxios().delete(API_URL.DELETE_MY_ACCOUNT);
      return successResponse(response);
    } catch (error) {
      console.error("DELETE MY ACCOUNT ERROR:", error);
      return failureResponse(error, "Xóa tài khoản thất bại");
    }
  },
};

export default UserAPI;
