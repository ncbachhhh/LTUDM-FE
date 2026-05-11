import axios from "axios";
import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
    LOGIN: `${URL}/auth/login`,
    REGISTER: `${URL}/auth/register`,
    GET_PROFILE: `${URL}/users/me`,
};

const clearAuthHeader = () => {
    delete axios.defaults.headers.common["Authorization"];
};

const UserAPI = {
    register: async (data) => {
        try {
            clearAuthHeader();

            const response = await axios.post(API_URL.REGISTER, data, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });

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
};

export default UserAPI;