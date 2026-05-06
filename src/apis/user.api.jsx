import axios from "axios";
// import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `http://localhost:8080/api/v1`;

const API_URL = {
    LOGIN: `${URL}/auth/login`,
    REGISTER: `${URL}/auth/register`,
    GET_PROFILE: `${URL}/users/me`,
}

const UserAPI = {
    register: async (data) => {
        try {
            const response = await axios.post(API_URL.REGISTER, data);
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.log(error);
        }
    },

    login: async (data) => {
        try {
            const response = await axios.post(API_URL.LOGIN, data);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            if (response.data.data.accessToken) {
                axios.defaults.headers["Authorization"] = `Bearer ${response.data.data.accessToken}`;
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
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
                message: error.response.data.message,
            };
        }
    },

    getProfile: async () => {
        try {
            const response = await axios.get(API_URL.GET_PROFILE);
            console.log(response.data);
            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: null,
                message: error.response.data.message,
            };
        }
    },
}

export default UserAPI;