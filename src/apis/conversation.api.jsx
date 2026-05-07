import authorizedAxios from "../helpers/authorizedAxios.js";
import {CONST} from "../helpers/CONST.js";

const URL = `http://${CONST.host_ip}:8080/api/v1`;

const API_URL = {
    GET_MY_CONVERSATIONS: `${URL}/conversations/me`,
    CREATE_CONVERSATION: `${URL}/conversations`,
    ADD_MEMBERS: (conversationId) =>
        `${URL}/conversations/${conversationId}/members`,
    DELETE_CONVERSATION: (conversationId) =>
        `${URL}/conversations/${conversationId}`,
};

const ConversationAPI = {
    getMyConversations: async () => {
        try {
            const response = await authorizedAxios().get(
                API_URL.GET_MY_CONVERSATIONS
            );

            return {
                isSuccess: true,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error) {
            console.error("GET MY CONVERSATIONS ERROR:", error);

            return {
                isSuccess: false,
                data: [],
                message:
                    error.response?.data?.message || "Không lấy được danh sách hội thoại",
            };
        }
    },

    createConversation: async (data) => {
        try {
            const response = await authorizedAxios().post(
                API_URL.CREATE_CONVERSATION,
                data
            );

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("CREATE CONVERSATION ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Tạo hội thoại thất bại",
            };
        }
    },

    addMembers: async (conversationId, memberIds) => {
        try {
            const response = await authorizedAxios().post(
                API_URL.ADD_MEMBERS(conversationId),
                {
                    member_ids: memberIds,
                }
            );

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("ADD MEMBERS ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Thêm thành viên thất bại",
            };
        }
    },

    deleteConversation: async (conversationId) => {
        try {
            const response = await authorizedAxios().delete(
                API_URL.DELETE_CONVERSATION(conversationId)
            );

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("DELETE CONVERSATION ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Xóa hội thoại thất bại",
            };
        }
    },
};

export default ConversationAPI;