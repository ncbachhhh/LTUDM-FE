import axios from "axios";
import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `http://localhost:8080/api/v1`;

const API_URL = {
    LOGIN: `${URL}/auth/login`,
    REGISTER: `${URL}/auth/register`,
    GET_PROFILE: `${URL}/users/me`,
};

const UserAPI = {
    register: async (data) => {
        try {
            const response = await axios.post(API_URL.REGISTER, data);

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Đăng ký thất bại",
            };
        }
    },

    login: async (data) => {
        try {
            const response = await axios.post(API_URL.LOGIN, data);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            }

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Đăng nhập thất bại",
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
            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Lấy profile thất bại",
            };
        }
    },
};

export default UserAPI;