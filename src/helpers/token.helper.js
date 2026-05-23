import axios from "axios";
import { API_BASE_URL } from "../config/app.config.js";
import { STORAGE_KEYS } from "../constants/storage.constants.js";

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

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.accessToken);

export const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);

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

    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    }
    setAccessTokenHeader(accessToken);
};

export const clearStoredAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.userId);
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
