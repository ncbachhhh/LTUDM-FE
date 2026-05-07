import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";

const WS_URL = "http://localhost:8080/api/v1/ws";

let stompClient = null;
let connectPromise = null;

const WebSocketAPI = {
    connect: () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return Promise.reject("Không có accessToken trong localStorage");
        }

        if (stompClient?.connected) {
            return Promise.resolve(stompClient);
        }

        if (connectPromise) {
            return connectPromise;
        }

        stompClient = new Client({
            webSocketFactory: () => new SockJS(WS_URL),

            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },

            reconnectDelay: 5000,

            debug: (message) => {
                console.log("[STOMP]", message);
            },
        });

        connectPromise = new Promise((resolve, reject) => {
            stompClient.onConnect = () => {
                console.log("Da ket noi stomp");
                connectPromise = null;
                resolve(stompClient);
            };

            stompClient.onStompError = (frame) => {
                console.error("Lỗi:", frame.headers?.message);
                console.error("Chi tiết:", frame.body);
                connectPromise = null;
                reject(frame);
            };

            stompClient.onWebSocketError = (error) => {
                console.error("lỗi wbe socket:", error);
                connectPromise = null;
                reject(error);
            };

            stompClient.onWebSocketClose = (event) => {
                console.warn("Đóng websocket:", event);
                connectPromise = null;
            };
        });

        stompClient.activate();

        return connectPromise;
    },

    subscribeConversation: async (conversationId, callback) => {
        const client = await WebSocketAPI.connect();

        const topic = `/topic/conversation/${conversationId}`;

        console.log("SUBSCRIBE:", topic);

        return client.subscribe(topic, (message) => {
            const data = JSON.parse(message.body);
            console.log("RECEIVE:", data);
            callback(data);
        });
    },

    sendTextMessage: async (conversationId, content) => {
        try {
            const client = await WebSocketAPI.connect();

            if (!client.connected) {
                return {
                    isSuccess: false,
                    message: "Socket chưa kết nối",
                };
            }

            const destination = `/app/chat/${conversationId}`;

            console.log("SEND:", destination, content);

            client.publish({
                destination,
                body: JSON.stringify({
                    content,
                    type: "TEXT",
                }),
            });

            return {
                isSuccess: true,
                message: "Đã gửi",
            };
        } catch (error) {
            console.error("Gửi lỗi:", error);

            return {
                isSuccess: false,
                message: "Không kết nối được socket",
            };
        }
    },

    disconnect: async () => {
        if (stompClient) {
            await stompClient.deactivate();
            stompClient = null;
            connectPromise = null;
        }
    },

    isConnected: () => {
        return !!stompClient?.connected;
    },
};

export default WebSocketAPI;