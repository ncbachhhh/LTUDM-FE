export const CONVERSATION_TYPE = {
  direct: "DIRECT",
  group: "GROUP",
};

export const MESSAGE_TYPE = {
  text: "TEXT",
  image: "IMAGE",
  file: "FILE",
};

export const FRIENDSHIP_STATUS = {
  none: "NONE",
  pending: "PENDING",
  accepted: "ACCEPTED",
  blocked: "BLOCKED",
};

export const FRIENDSHIP_DIRECTION = {
  none: "NONE",
  incoming: "INCOMING",
  outgoing: "OUTGOING",
};

export const DEFAULT_CONVERSATION_STATS = [
  { id: "streak", label: "Chuỗi chat", value: "0", subValue: "0" },
  { id: "links", label: "Link", value: "0" },
  { id: "files", label: "File", value: "0" },
  { id: "images", label: "Hình ảnh", value: "0" },
];

export const DEFAULT_CONVERSATION_SETTINGS = [
  "Chỉnh sửa biệt danh",
  "Thay đổi biểu tượng cảm xúc",
];

