const hasTimezone = (value) => /(?:z|[+-]\d{2}:?\d{2})$/i.test(value);

const normalizeIsoDate = (value) => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;

  const isoValue = trimmedValue.includes("T")
    ? trimmedValue
    : trimmedValue.replace(" ", "T");

  return hasTimezone(isoValue) ? isoValue : `${isoValue}Z`;
};

export const parseApiDate = (value) => {
  if (!value) return null;

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = value;
    return new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, Math.floor(nano / 1_000_000))
    );
  }

  const date = new Date(normalizeIsoDate(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatConversationDate = (value) => {
  const date = parseApiDate(value);
  if (!date) return "";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

export const formatMessageTime = (value) => {
  const date = parseApiDate(value);
  if (!date) return "vừa xong";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimestamp = (value) => parseApiDate(value)?.getTime() || 0;

