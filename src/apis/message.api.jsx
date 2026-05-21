import authorizedAxios from "../helpers/authorizedAxios.js";

const URL = `${import.meta.env.VITE_HOST_URL}/api/v1`;

const API_URL = {
    SEND_MESSAGE: `${URL}/messages`,
    GET_MESSAGES_BY_CONVERSATION: (conversationId, page, size) =>
        `${URL}/messages/conversation/${conversationId}/paged?page=${page}&size=${size}`,

    MARK_CONVERSATION_READ: (conversationId) =>
        `${URL}/messages/conversation/${conversationId}/read-all`,
};

const MessageAPI = {
    sendFileMessage: async ({ conversationId, file, type }) => {
        try {
            const formData = new FormData();
            formData.append(
                "message",
                new Blob(
                    [JSON.stringify({ conversation_id: conversationId, type })],
                    { type: "application/json" }
                )
            );
            formData.append("file", file);

            const response = await authorizedAxios().post(API_URL.SEND_MESSAGE, formData);

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            console.error("SEND FILE MESSAGE ERROR:", error);

            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Gửi tệp thất bại",
            };
        }
    },

    getMessagesByConversation: async (conversationId, page = 0, size = 50) => {
        try {
            const response = await authorizedAxios().get(
                API_URL.GET_MESSAGES_BY_CONVERSATION(conversationId, page, size)
            );

            return {
                isSuccess: true,
                data: response.data.data?.content || [],
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
};

export default MessageAPI;
