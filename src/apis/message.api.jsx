import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
    GET_MESSAGES_BY_CONVERSATION: (conversationId) =>
        `${URL}/messages/conversation/${conversationId}`,

    MARK_CONVERSATION_READ: (conversationId) =>
        `${URL}/messages/conversation/${conversationId}/read-all`,

    SEND_MESSAGE: `${URL}/messages`,
};

const MessageAPI = {
    getMessagesByConversation: async (conversationId) => {
        try {
            const response = await authorizedAxios().get(
                API_URL.GET_MESSAGES_BY_CONVERSATION(conversationId)
            );

            return {
                isSuccess: true,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error) {
            console.error("GET MESSAGES ERROR:", error);

            return {
                isSuccess: false,
                data: [],
                message: error.response?.data?.message || "Không lấy được tin nhắn",
            };
        }
    },

    markConversationRead: async (conversationId) => {
        try {
            const response = await authorizedAxios().put(
                API_URL.MARK_CONVERSATION_READ(conversationId),
                {}
            );

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("MARK CONVERSATION READ ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message:
                    error.response?.data?.message || "Không đánh dấu đã đọc được",
            };
        }
    },

    sendTextMessageREST: async (conversationId, content) => {
        try {
            const response = await authorizedAxios().post(API_URL.SEND_MESSAGE, {
                conversation_id: conversationId,
                content,
                type: "TEXT",
            });

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("SEND MESSAGE REST ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Gửi tin nhắn thất bại",
            };
        }
    },
};

export default MessageAPI;