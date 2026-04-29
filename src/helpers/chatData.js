export const contacts = {
  people: [
    {
      id: "vuong",
      name: "Đỗ Minh Vương",
      message: "hahaha",
      time: "35 phút",
      avatar: "/anh-avata.svg",
      isActive: true,
      messages: [
        { id: 1, text: "ô là trời ", isOwn: false },
        { id: 2, text: "????", isOwn: true },
        { id: 3, text: "hahahah", isOwn: false },
        { id: 3, text: "hahahah", isOwn: true },
      ],
    },
    {
      id: "bach",
      name: "Nguyễn Chiến Bách",
      message: "Sau nghỉ lễ ...",
      time: "1 giờ",
      avatar: "/anh-avata.svg",
      isActive: true,
      messages: [
        { id: 1, text: "Gửi tui file thiết kế với", isOwn: false },
        { id: 1, text: "Sau nghỉ lễ nha :))", isOwn: true },
      ],
    },
    {
      id: "cuong",
      name: "Nguyễn Quốc cường",
      message: "Donate cho mình nhé...",
      time: "2 giờ",
      avatar: "/anh-avata.svg",
      isActive: true,

      messages: [{ id: 1, text: "Làm thiết kế figma đi m ê", isOwn: false }],
    },
  ],
  groups: [
    {
      id: "figma-aplus",
      name: "Figma Aplus",
      message: "Làm lại đi",
      time: "1 năm",
      avatar: "/Icon-group.svg",
      isActive: true,
      isGroup: true,
    },
    {
      id: "hahaha",
      name: "F88",
      message: "",
      time: "1 năm",
      avatar: "/Icon-group.svg",
      isActive: true,
      isGroup: true,
      messages: [],
    },
  ],
};

export const activeConversation = {
  name: "Nguyễn Quốc Cường",
  avatar: "/anh-avata.svg",
  status: "Hoạt động 19 giờ trước",
  stats: [
    { id: "streak", label: "Chuỗi chat", value: "36", subValue: "70" },
    { id: "links", label: "Link", value: "36" },
    { id: "files", label: "File", value: "36" },
    { id: "images", label: "Hình ảnh", value: "36" },
  ],
  settings: ["Chỉnh sửa biệt danh", "Giao diện đoạn chat"],
};
