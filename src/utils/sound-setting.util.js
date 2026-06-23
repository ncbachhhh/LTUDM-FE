export const SOUND_ENABLED_STORAGE_KEY = "sound_enabled";

export const parseSoundEnabled = (value, fallback = true) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value).trim().toLowerCase();
  if (["false", "0", "off", "disabled", "no"].includes(normalized)) return false;
  if (["true", "1", "on", "enabled", "yes"].includes(normalized)) return true;

  return Boolean(value);
};

export const getStoredSoundEnabled = () => {
  const storedValue = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
  if (storedValue === null) return null;
  return parseSoundEnabled(storedValue);
};

export const getUserSoundEnabled = (user, fallback = true) =>
  parseSoundEnabled(user?.soundEnabled ?? user?.sound_enabled, fallback);

export const getEffectiveSoundEnabled = (user) => {
  const storedValue = getStoredSoundEnabled();
  return storedValue ?? getUserSoundEnabled(user);
};
