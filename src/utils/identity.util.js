import { STORAGE_KEYS } from "../constants/storage.constants.js";

export const getStoredUserId = () => localStorage.getItem(STORAGE_KEYS.userId);

export const getCurrentUserId = (user) =>
  user?.id || user?.user_id || user?.userId || getStoredUserId();

export const getMemberId = (member) => member?.user_id || member?.userId || member?.id;

export const getDisplayName = (user, fallback = "Người dùng") =>
  user?.nickname ||
  user?.display_name ||
  user?.displayName ||
  user?.username ||
  user?.email ||
  fallback;

export const getAvatarUrl = (user, fallback) =>
  user?.avatar_url || user?.avatarUrl || user?.avatar || fallback;

export const getOnlineStatus = (user) =>
  Boolean(user?.is_online || user?.online || user?.isActive || user?.is_active);

