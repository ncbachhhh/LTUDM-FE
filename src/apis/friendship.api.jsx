import { API_BASE_URL } from "../config/app.config.js";
import authorizedAxios from "../helpers/authorizedAxios.js";
import { failureResponse, successResponse } from "../utils/api-response.util.js";

const API_URL = {
  REQUESTS: `${API_BASE_URL}/friendships/requests`,
  ACCEPT: (id) => `${API_BASE_URL}/friendships/${id}/accept`,
  DECLINE: (id) => `${API_BASE_URL}/friendships/${id}/decline`,
  WITHDRAW: (id) => `${API_BASE_URL}/friendships/requests/${id}`,
  DELETE: (id) => `${API_BASE_URL}/friendships/${id}`,
  BLOCK: (userId) => `${API_BASE_URL}/friendships/blocks/${userId}`,
  BLOCKS: `${API_BASE_URL}/friendships/blocks`,
  UNBLOCK: (userId) => `${API_BASE_URL}/friendships/blocks/${userId}`,
  INCOMING: `${API_BASE_URL}/friendships/requests/incoming`,
  OUTGOING: `${API_BASE_URL}/friendships/requests/outgoing`,
  FRIENDSHIPS: `${API_BASE_URL}/friendships`,
  SEARCH: `${API_BASE_URL}/friendships/search`,
};

const withDataFallback = (response, fallbackData = []) => successResponse(response, fallbackData);

const FriendshipAPI = {
  sendRequest: async (userId) => {
    try {
      const response = await authorizedAxios().post(`${API_URL.REQUESTS}/${userId}`);
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Gửi lời mời kết bạn thất bại");
    }
  },

  acceptRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.ACCEPT(friendshipId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Chấp nhận lời mời thất bại");
    }
  },

  declineRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.DECLINE(friendshipId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Từ chối lời mời thất bại");
    }
  },

  withdrawRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.WITHDRAW(friendshipId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Thu hồi lời mời thất bại");
    }
  },

  deleteFriend: async (friendshipId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.DELETE(friendshipId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Xóa bạn thất bại");
    }
  },

  blockUser: async (userId) => {
    try {
      const response = await authorizedAxios().post(API_URL.BLOCK(userId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Chặn người dùng thất bại");
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.UNBLOCK(userId));
      return successResponse(response);
    } catch (error) {
      return failureResponse(error, "Bỏ chặn người dùng thất bại");
    }
  },

  getBlockedUsers: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.BLOCKS);
      return withDataFallback(response);
    } catch (error) {
      return failureResponse(error, "Lấy danh sách người đã chặn thất bại", []);
    }
  },

  getIncomingRequests: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.INCOMING);
      return withDataFallback(response);
    } catch (error) {
      return failureResponse(error, "Lấy lời mời đã nhận thất bại", []);
    }
  },

  getOutgoingRequests: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.OUTGOING);
      return withDataFallback(response);
    } catch (error) {
      return failureResponse(error, "Lấy lời mời đã gửi thất bại", []);
    }
  },

  getFriends: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.FRIENDSHIPS);
      return withDataFallback(response);
    } catch (error) {
      return failureResponse(error, "Lấy danh sách bạn bè thất bại", []);
    }
  },

  searchFriends: async (name) => {
    try {
      const response = await authorizedAxios().get(API_URL.SEARCH, {
        params: { name },
      });
      return withDataFallback(response);
    } catch (error) {
      return failureResponse(error, "Tìm kiếm bạn bè thất bại", []);
    }
  },
};

export default FriendshipAPI;
