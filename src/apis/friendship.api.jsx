import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
  REQUESTS: `${URL}/friendships/requests`,
  ACCEPT: (id) => `${URL}/friendships/${id}/accept`,
  DECLINE: (id) => `${URL}/friendships/${id}/decline`,
  WITHDRAW: (id) => `${URL}/friendships/requests/${id}`,
  DELETE: (id) => `${URL}/friendships/${id}`,
  BLOCK: (userId) => `${URL}/friendships/blocks/${userId}`,
  BLOCKS: `${URL}/friendships/blocks`,
  UNBLOCK: (userId) => `${URL}/friendships/blocks/${userId}`,
  INCOMING: `${URL}/friendships/requests/incoming`,
  OUTGOING: `${URL}/friendships/requests/outgoing`,
  FRIENDSHIPS: `${URL}/friendships`,
  SEARCH: `${URL}/friendships/search`,
};

const unwrapData = (response) => response.data?.data;

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const FriendshipAPI = {
  sendRequest: async (userId) => {
    try {
      const response = await authorizedAxios().post(`${API_URL.REQUESTS}/${userId}`);
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Gửi lời mời kết bạn thất bại"),
      };
    }
  },

  acceptRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.ACCEPT(friendshipId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Chấp nhận lời mời thất bại"),
      };
    }
  },

  declineRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.DECLINE(friendshipId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Từ chối lời mời thất bại"),
      };
    }
  },

  withdrawRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.WITHDRAW(friendshipId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Thu hồi lời mời thất bại"),
      };
    }
  },

  deleteFriend: async (friendshipId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.DELETE(friendshipId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Xóa bạn thất bại"),
      };
    }
  },

  blockUser: async (userId) => {
    try {
      const response = await authorizedAxios().post(API_URL.BLOCK(userId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Chặn người dùng thất bại"),
      };
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await authorizedAxios().delete(API_URL.UNBLOCK(userId));
      return { isSuccess: true, data: unwrapData(response) };
    } catch (error) {
      return {
        isSuccess: false,
        message: getErrorMessage(error, "Bo chan nguoi dung that bai"),
      };
    }
  },

  getBlockedUsers: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.BLOCKS);
      return { isSuccess: true, data: unwrapData(response) || [] };
    } catch (error) {
      return {
        isSuccess: false,
        data: [],
        message: getErrorMessage(error, "Lay danh sach nguoi da chan that bai"),
      };
    }
  },

  getIncomingRequests: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.INCOMING);
      return { isSuccess: true, data: unwrapData(response) || [] };
    } catch (error) {
      return {
        isSuccess: false,
        data: [],
        message: getErrorMessage(error, "Lấy lời mời đã nhận thất bại"),
      };
    }
  },

  getOutgoingRequests: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.OUTGOING);
      return { isSuccess: true, data: unwrapData(response) || [] };
    } catch (error) {
      return {
        isSuccess: false,
        data: [],
        message: getErrorMessage(error, "Lấy lời mời đã gửi thất bại"),
      };
    }
  },

  getFriends: async () => {
    try {
      const response = await authorizedAxios().get(API_URL.FRIENDSHIPS);
      return { isSuccess: true, data: unwrapData(response) || [] };
    } catch (error) {
      return {
        isSuccess: false,
        data: [],
        message: getErrorMessage(error, "Lấy danh sách bạn bè thất bại"),
      };
    }
  },

  searchFriends: async (name) => {
    try {
      const response = await authorizedAxios().get(API_URL.SEARCH, {
        params: { name },
      });
      return { isSuccess: true, data: unwrapData(response) || [] };
    } catch (error) {
      return {
        isSuccess: false,
        data: [],
        message: getErrorMessage(error, "Tìm kiếm bạn bè thất bại"),
      };
    }
  },
};

export default FriendshipAPI;
