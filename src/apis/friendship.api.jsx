import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
  REQUESTS: `${URL}/friendships/requests`,
  ACCEPT: (id) => `${URL}/friendships/${id}/accept`,
  DECLINE: (id) => `${URL}/friendships/${id}/decline`,
  INCOMING: `${URL}/friendships/requests/incoming`,
  OUTGOING: `${URL}/friendships/requests/outgoing`,
  FRIENDSHIPS: `${URL}/friendships`,
  SEARCH: `${URL}/friendships/search`,
};

const FriendshipAPI = {
  sendRequest: async (userId) => {
    try {
      const response = await authorizedAxios().post(`${API_URL.REQUESTS}/${userId}`);
      return { isSuccess: true, data: response.data.data };
    } catch (error) {
      return { isSuccess: false, message: error.response?.data?.message || "Lỗi khi gửi yêu cầu kết bạn" };
    }
  },
  acceptRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.ACCEPT(friendshipId));
      return { isSuccess: true, data: response.data.data };
    } catch (error) {
      return { isSuccess: false, message: error.response?.data?.message || "Lỗi khi chấp nhận kết bạn" };
    }
  },
  declineRequest: async (friendshipId) => {
    try {
      const response = await authorizedAxios().post(API_URL.DECLINE(friendshipId));
      return { isSuccess: true, data: response.data.data };
    } catch (error) {
      return { isSuccess: false, message: error.response?.data?.message || "Lỗi khi từ chối kết bạn" };
    }
  },
};

export default FriendshipAPI;
