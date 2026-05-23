import { API_BASE_URL } from "../config/app.config.js";
import { MESSAGE_TYPE } from "../constants/chat.constants.js";
import authorizedAxios from "../helpers/authorizedAxios.js";
import { failureResponse, successResponse } from "../utils/api-response.util.js";

const API_URL = {
  SEND_MESSAGE: `${API_BASE_URL}/messages`,
  GET_MESSAGES_BY_CONVERSATION: (conversationId, page, size) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/paged?page=${page}&size=${size}`,
  MARK_CONVERSATION_READ: (conversationId) =>
    `${API_BASE_URL}/messages/conversation/${conversationId}/read-all`,
};

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

  getMessagesByConversation: async (conversationId, page = 0, size = 50) => {
    try {
      const response = await authorizedAxios().get(
        API_URL.GET_MESSAGES_BY_CONVERSATION(conversationId, page, size)
      );
      return {
        ...successResponse(response, []),
        data: response.data.data?.content || [],
      };
    } catch (error) {
      console.error("GET MESSAGES ERROR:", error);
      return failureResponse(error, "Không lấy được tin nhắn", []);
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
};

export { MESSAGE_TYPE };
export default MessageAPI;
