import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { RECONNECT_DELAY_MS, WS_URL } from "../config/app.config.js";
import {
  clearStoredAuth,
  getValidAccessToken,
} from "../helpers/token.helper.js";

let stompClient = null;
let connectPromise = null;

const parseMessage = (message) => JSON.parse(message.body);

const isAuthErrorFrame = (frame) => {
  const message =
    `${frame.headers?.message || ""} ${frame.body || ""}`.toLowerCase();
  return (
    message.includes("token") ||
    message.includes("unauthenticated") ||
    message.includes("unauthorized")
  );
};

const resetClient = () => {
  stompClient = null;
  connectPromise = null;
};

const createClient = () => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: RECONNECT_DELAY_MS,
    debug: (message) => console.log("[STOMP]", message),
    beforeConnect: async () => {
      const accessToken = await getValidAccessToken();
      client.connectHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
    },
  });

  return client;
};

const WebSocketAPI = {
  connect: async () => {
    if (stompClient?.connected) {
      return stompClient;
    }

    if (connectPromise) {
      return connectPromise;
    }

    stompClient = createClient();

    connectPromise = new Promise((resolve, reject) => {
      stompClient.onConnect = () => {
        console.log("Connected STOMP");
        connectPromise = null;
        resolve(stompClient);
      };

      stompClient.onStompError = (frame) => {
        console.error("STOMP error:", frame.headers?.message);
        console.error("STOMP detail:", frame.body);

        if (isAuthErrorFrame(frame)) {
          clearStoredAuth();
        }

        resetClient();
        reject(frame);
      };

      stompClient.onWebSocketError = (error) => {
        console.error("WebSocket error:", error);
        resetClient();
        reject(error);
      };

      stompClient.onWebSocketClose = (event) => {
        console.warn("WebSocket closed:", event);
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
      const data = parseMessage(message);
      console.log("RECEIVE:", data);
      callback(data);
    });
  },

  subscribeConversationRead: async (conversationId, callback) => {
    const client = await WebSocketAPI.connect();
    const topic = `/topic/conversation/${conversationId}/read`;

    console.log("SUBSCRIBE:", topic);

    return client.subscribe(topic, (message) => {
      const data = parseMessage(message);
      console.log("RECEIVE READ EVENT:", data);
      callback(data);
    });
  },

  subscribeConversationUpdates: async (callback) => {
    const client = await WebSocketAPI.connect();
    const topic = "/user/queue/conversations";

    console.log("SUBSCRIBE:", topic);

    return client.subscribe(topic, (message) => {
      const data = parseMessage(message);
      console.log("RECEIVE CONVERSATION UPDATE:", data);
      callback(data);
    });
  },

  subscribePresence: async (callback) => {
    const client = await WebSocketAPI.connect();
    const topic = "/topic/presence";

    console.log("SUBSCRIBE:", topic);

    return client.subscribe(topic, (message) => {
      const data = parseMessage(message);
      console.log("RECEIVE PRESENCE:", data);
      callback(data);
    });
  },

  sendTextMessage: async (conversationId, content, parentId = null) => {
    try {
      const client = await WebSocketAPI.connect();

      if (!client.connected) {
        return {
          isSuccess: false,
          message: "Socket chua ket noi",
        };
      }

      const destination = `/app/chat/${conversationId}`;

      console.log("SEND:", destination, content, parentId);

      client.publish({
        destination,
        body: JSON.stringify({
          content,
          type: "TEXT",
          reply_to_message_id: parentId || null,
        }),
      });

      return {
        isSuccess: true,
        message: "Da gui",
      };
    } catch (error) {
      console.error("Send message error:", error);

      return {
        isSuccess: false,
        message: "Khong ket noi duoc socket",
      };
    }
  },

  sendReadReceipt: async (conversationId) => {
    try {
      const client = await WebSocketAPI.connect();
      if (!client.connected) return { isSuccess: false, message: "Socket chua ket noi" };

      client.publish({
        destination: `/app/chat/${conversationId}/read`,
        body: JSON.stringify({}),
      });

      return { isSuccess: true };
    } catch (error) {
      console.error("Send read receipt error:", error);
      return { isSuccess: false, message: "Khong gui duoc trang thai da doc" };
    }
  },

  sendTyping: async (conversationId, typing = true) => {
    try {
      const client = await WebSocketAPI.connect();
      if (!client.connected) return { isSuccess: false, message: "Socket chua ket noi" };

      client.publish({
        destination: `/app/chat/${conversationId}/typing`,
        body: JSON.stringify({ typing }),
      });

      return { isSuccess: true };
    } catch (error) {
      console.error("Send typing error:", error);
      return { isSuccess: false, message: "Khong gui duoc trang thai dang nhap" };
    }
  },

  disconnect: async () => {
    if (!stompClient) {
      return;
    }

    const client = stompClient;
    resetClient();
    await client.deactivate();
  },

  isConnected: () => !!stompClient?.connected,
};

export default WebSocketAPI;
