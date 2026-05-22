import axios from "axios";
import { clearStoredAuth, getAccessToken, refreshAccessToken } from "./token.helper.js";

const authorizedClient = axios.create();

authorizedClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

authorizedClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest?._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const accessToken = await refreshAccessToken();
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return authorizedClient(originalRequest);
        } catch (refreshError) {
            clearStoredAuth();
            return Promise.reject(refreshError);
        }
    }
);

const authorizedAxios = () => authorizedClient;

export default authorizedAxios;
