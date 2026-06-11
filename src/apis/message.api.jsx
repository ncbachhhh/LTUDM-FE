import { API_BASE_URL } from "../config/app.config.js";
import { MESSAGE_TYPE } from "../constants/chat.constants.js";
import authorizedAxios from "../helpers/authorizedAxios.js";
import { failureResponse, successResponse } from "../utils/api-response.util.js";

const API_URL = {
  SEND_MESSAGE: `${API_BASE_URL}/messages`,
  GET_MESSAGES_BY_CONVERSATION: (conversationId, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/paged?page=${page}&size=${size}`,
  SEARCH_MESSAGES: (conversationId, keyword, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
  MARK_CONVERSATION_READ: (conversationId) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/read-all`,
  MARK_MESSAGE_READ: (messageId) => `${API_BASE_URL}/messages/${messageId}/read`,
  GET_UNREAD_COUNT: (conversationId) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/unread-count`,
  GET_LATEST_MESSAGE: (conversationId) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/latest`,
  GET_PINNED_MESSAGES: (conversationId) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/pinned`,
  GET_IMAGE_PREVIEW: (conversationId, limit) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/media/images/preview?limit=${limit}`,
  GET_IMAGES: (conversationId, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/media/images?page=${page}&size=${size}`,
  GET_FILES: (conversationId, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/media/files?page=${page}&size=${size}`,
  GET_LINKS: (conversationId, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/media/links?page=${page}&size=${size}`,
  PIN_MESSAGE: (messageId) => `${API_BASE_URL}/messages/${messageId}/pin`,
  RECALL_MESSAGE: (messageId) => `${API_BASE_URL}/messages/${messageId}/recall`,
  DELETE_MESSAGE_FOR_ME: (messageId) => `${API_BASE_URL}/messages/${messageId}`,
};

const pageContentResponse = (response, fallbackData = []) => ({
  ...successResponse(response, fallbackData),
  data: response.data?.data?.content || fallbackData,
  page: response.data?.data || null,
});

const MessageAPI = {
  sendFileMessage: async ({ conversationId, file, type }) => {
    try {
      const formData = new FormData();
      formData.append(
        "message",
        new Blob([JSON.stringify({ conversation_id: conversationId, type })], {
          type: "application/json",
        })
      );
      formData.append("file", file);

      const response = await authorizedAxios().post(API_URL.SEND_MESSAGE, formData);
      return successResponse(response);
    } catch (error) {
      console.error("SEND FILE MESSAGE ERROR:", error);
      return failureResponse(error, "Gửi tệp thất bại");
    }
  },

  getMessagesByConversation: async (conversationId, page = 0, size = 20) => {
    try {
      const response = await authorizedAxios().get(
        API_URL.GET_MESSAGES_BY_CONVERSATION(conversationId, page, size)
      );
      return pageContentResponse(response, []);
    } catch (error) {
      console.error("GET MESSAGES ERROR:", error);
      return failureResponse(error, "Không lấy được tin nhắn", []);
    }
  },

  searchMessages: async (conversationId, keyword, page = 0, size = 20) => {
    try {
      const response = await authorizedAxios().get(
        API_URL.SEARCH_MESSAGES(conversationId, keyword, page, size)
      );
      return pageContentResponse(response, []);
    } catch (error) {
      console.error("SEARCH MESSAGES ERROR:", error);
      return failureResponse(error, "Không tìm được tin nhắn", []);
    }
  },

  getConversationImagePreview: async (conversationId, limit = 3) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_IMAGE_PREVIEW(conversationId, limit));
      return successResponse(response, []);
    } catch (error) {
      console.error("GET IMAGE PREVIEW ERROR:", error);
      return failureResponse(error, "Không lấy được ảnh preview", []);
    }
  },

  getConversationImages: async (conversationId, page = 0, size = 30) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_IMAGES(conversationId, page, size));
      return pageContentResponse(response, []);
    } catch (error) {
      console.error("GET CONVERSATION IMAGES ERROR:", error);
      return failureResponse(error, "Không lấy được ảnh trong hội thoại", []);
    }
  },

  getConversationFiles: async (conversationId, page = 0, size = 30) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_FILES(conversationId, page, size));
      return pageContentResponse(response, []);
    } catch (error) {
      console.error("GET CONVERSATION FILES ERROR:", error);
      return failureResponse(error, "Không lấy được file trong hội thoại", []);
    }
  },

  getConversationLinks: async (conversationId, page = 0, size = 30) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_LINKS(conversationId, page, size));
      return pageContentResponse(response, []);
    } catch (error) {
      console.error("GET CONVERSATION LINKS ERROR:", error);
      return failureResponse(error, "Không lấy được link trong hội thoại", []);
    }
  },

  markConversationRead: async (conversationId) => {
    try {
      const response = await authorizedAxios().put(
        API_URL.MARK_CONVERSATION_READ(conversationId),
        {}
      );
      return successResponse(response);
    } catch (error) {
      console.error("MARK CONVERSATION READ ERROR:", error);
      return failureResponse(error, "Không đánh dấu đã đọc được");
    }
  },

  markMessageRead: async (messageId) => {
    try {
      const response = await authorizedAxios().put(API_URL.MARK_MESSAGE_READ(messageId), {});
      return successResponse(response);
    } catch (error) {
      console.error("MARK MESSAGE READ ERROR:", error);
      return failureResponse(error, "Không đánh dấu tin nhắn đã đọc được");
    }
  },

  getUnreadCount: async (conversationId) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_UNREAD_COUNT(conversationId));
      return successResponse(response, 0);
    } catch (error) {
      console.error("GET UNREAD COUNT ERROR:", error);
      return failureResponse(error, "Không lấy được số tin nhắn chưa đọc", 0);
    }
  },

  getLatestMessage: async (conversationId) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_LATEST_MESSAGE(conversationId));
      return successResponse(response);
    } catch (error) {
      console.error("GET LATEST MESSAGE ERROR:", error);
      return failureResponse(error, "Không lấy được tin nhắn mới nhất");
    }
  },

  getPinnedMessages: async (conversationId) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_PINNED_MESSAGES(conversationId));
      return successResponse(response, []);
    } catch (error) {
      console.error("GET PINNED MESSAGES ERROR:", error);
      return failureResponse(error, "Không lấy được danh sách ghim", []);
    }
  },

  pinMessage: async (messageId, shouldPin = true) => {
    try {
      const response = shouldPin
        ? await authorizedAxios().put(API_URL.PIN_MESSAGE(messageId), {})
        : await authorizedAxios().delete(API_URL.PIN_MESSAGE(messageId));
      return successResponse(response);
    } catch (error) {
      console.error("PIN MESSAGE ERROR:", error);
      return failureResponse(error, shouldPin ? "Không ghim được tin nhắn" : "Không bỏ ghim được tin nhắn");
    }
  },

  recallMessage: async (messageId) => {
    try {
      const response = await authorizedAxios().put(API_URL.RECALL_MESSAGE(messageId), {});
      return successResponse(response);
    } catch (error) {
      console.error("RECALL MESSAGE ERROR:", error);
      return failureResponse(error, "Không thu hồi được tin nhắn");
    }
  },

  deleteMessageForMe: async (messageId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.DELETE_MESSAGE_FOR_ME(messageId));
      return successResponse(response);
    } catch (error) {
      console.error("DELETE MESSAGE FOR ME ERROR:", error);
      return failureResponse(error, "Không xóa được tin nhắn phía bạn");
    }
  },
};

export { MESSAGE_TYPE };
export default MessageAPI;
