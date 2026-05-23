const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const APP_CONFIG = {
  hostUrl: trimTrailingSlash(import.meta.env.VITE_HOST_URL || "http://localhost:8080"),
};

export const API_BASE_URL = `${APP_CONFIG.hostUrl}/api/v1`;
export const WS_URL = `${API_BASE_URL}/ws`;
export const RECONNECT_DELAY_MS = 5000;

