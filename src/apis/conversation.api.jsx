import { API_BASE_URL } from "../config/app.config.js";
import authorizedAxios from "../helpers/authorizedAxios.js";
import { failureResponse, successResponse } from "../utils/api-response.util.js";

const API_URL = {
  GET_MY_CONVERSATIONS: `${API_BASE_URL}/conversations/me`,
  CREATE_CONVERSATION: `${API_BASE_URL}/conversations`,
  ADD_MEMBERS: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}/members`,
  GET_INFO: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}/info`,
  UPDATE_NICKNAME: (conversationId, memberId) =>
    `${API_BASE_URL}/conversations/${conversationId}/members/${memberId}/nickname`,
  DELETE_CONVERSATION: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}`,
  UPLOAD_GROUP_AVATAR: (conversationId) => `${API_BASE_URL}/conversations/${conversationId}/avatar`,
};

const ConversationAPI = {
  getMyConversations: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_MY_CONVERSATIONS);
      return successResponse(response, []);
    } catch (error) {
      console.error("GET MY CONVERSATIONS ERROR:", error);
      return failureResponse(error, "Không lấy được danh sách hội thoại", []);
    }
  },

  createConversation: async (data) => {
    try {
      const response = await authorizedAxios().post(API_URL.CREATE_CONVERSATION, data);
      return successResponse(response);
    } catch (error) {
      console.error("CREATE CONVERSATION ERROR:", error);
      return failureResponse(error, "Tạo hội thoại thất bại");
    }
  },

  addMembers: async (conversationId, memberIds) => {
    try {
      const response = await authorizedAxios().post(API_URL.ADD_MEMBERS(conversationId), {
        member_ids: memberIds,
      });
      return successResponse(response);
    } catch (error) {
      console.error("ADD MEMBERS ERROR:", error);
      return failureResponse(error, "Thêm thành viên thất bại");
    }
  },

  getConversationInfo: async (conversationId) => {
    try {
      const response = await authorizedAxios().get(API_URL.GET_INFO(conversationId));
      return successResponse(response);
    } catch (error) {
      console.error("GET CONVERSATION INFO ERROR:", error);
      return failureResponse(error, "Không lấy được thông tin hội thoại");
    }
  },

  updateMemberNickname: async (conversationId, memberId, nickname) => {
    try {
      const response = await authorizedAxios().patch(
        API_URL.UPDATE_NICKNAME(conversationId, memberId),
        { nickname }
      );
      return successResponse(response);
    } catch (error) {
      console.error("UPDATE NICKNAME ERROR:", error);
      return failureResponse(error, "Cập nhật biệt danh thất bại");
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.DELETE_CONVERSATION(conversationId));
      return successResponse(response);
    } catch (error) {
      console.error("DELETE CONVERSATION ERROR:", error);
      return failureResponse(error, "Xóa hội thoại thất bại");
    }
  },

  uploadGroupAvatar: async (conversationId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await authorizedAxios().post(
        API_URL.UPLOAD_GROUP_AVATAR(conversationId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return successResponse(response);
    } catch (error) {
      console.error("UPLOAD GROUP AVATAR ERROR:", error);
      return failureResponse(error, "Tải ảnh đại diện nhóm thất bại");
    }
  },
};

export default ConversationAPI;
