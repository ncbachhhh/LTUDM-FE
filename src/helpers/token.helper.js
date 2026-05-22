import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;
const REFRESH_WINDOW_MS = 30000;
let refreshPromise = null;

const parseJwtPayload = (token) => {
    try {
        const [, payload] = token.split(".");
        if (!payload) {
            return null;
        }

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalizedPayload));
    } catch {
        return null;
    }
};

const isExpired = (token) => {
    const payload = parseJwtPayload(token);
    if (!payload?.exp) {
        return true;
    }

    return payload.exp * 1000 <= Date.now() + REFRESH_WINDOW_MS;
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const hasStoredAuth = () => Boolean(getAccessToken() || getRefreshToken());

export const setAccessTokenHeader = (accessToken) => {
    if (accessToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        delete axios.defaults.headers.common.Authorization;
    }
};

export const storeTokens = ({ accessToken, refreshToken }) => {
    if (!accessToken) {
        throw new Error("Missing access token");
    }

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
    setAccessTokenHeader(accessToken);
};

export const clearStoredAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setAccessTokenHeader(null);
};

export const refreshAccessToken = async () => {
    if (refreshPromise) {
        return refreshPromise;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearStoredAuth();
        throw new Error("Missing refresh token");
    }

    refreshPromise = axios
        .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        .then((response) => {
            const accessToken = response.data?.data?.accessToken;
            const newRefreshToken = response.data?.data?.refreshToken;

            storeTokens({ accessToken, refreshToken: newRefreshToken });

            return accessToken;
        })
        .catch((error) => {
            clearStoredAuth();
            throw error;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};

export const getValidAccessToken = async () => {
    const accessToken = getAccessToken();
    if (accessToken && !isExpired(accessToken)) {
        setAccessTokenHeader(accessToken);
        return accessToken;
    }

    return refreshAccessToken();
};
