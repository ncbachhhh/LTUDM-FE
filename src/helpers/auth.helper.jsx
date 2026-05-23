import { STORAGE_KEYS } from "../constants/storage.constants.js";

export const getUserIdFromToken = () => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);

    if (!token) return null;

    try {
        const payloadBase64 = token.split(".")[1];

        const payloadJson = atob(
            payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
        );

        const payload = JSON.parse(payloadJson);

        return payload.sub;
    } catch (error) {
        console.error("Decode token error:", error);
        return null;
    }
};
