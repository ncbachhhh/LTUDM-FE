import axios from "axios";

const URL = "http://localhost:8080/api/v1";

export const DEFAULT_CONVERSATION_ID = "2b7deef1-c0d1-4348-aaf1-5cb7a8bab2f6";

const API_URL = {
    SEND_MESSAGE: `${URL}/messages`,
    GET_MESSAGES_BY_CONVERSATION: (conversationId) =>
        `${URL}/messages/conversation/${conversationId}`,
};

const getAuthHeader = () => {
    const accessToken = localStorage.getItem("accessToken");

    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

const MessageAPI = {
    sendMessage: async (content, conversationId = DEFAULT_CONVERSATION_ID) => {
        try {
            const data = {
                conversation_id: conversationId,
                content,
                type: "TEXT",
            };

            const response = await axios.post(API_URL.SEND_MESSAGE, data, {
                headers: getAuthHeader(),
            });

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: null,
                message: error.response?.data?.message || "Gửi tin nhắn thất bại",
            };
        }
    },

    getMessagesByConversation: async (conversationId = DEFAULT_CONVERSATION_ID) => {
        try {
            const response = await axios.get(
                API_URL.GET_MESSAGES_BY_CONVERSATION(conversationId),
                {
                    headers: getAuthHeader(),
                }
            );

            return {
                isSuccess: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: [],
                message: error.response?.data?.message || "Lấy tin nhắn thất bại",
            };
        }
    },
};

export default MessageAPI;