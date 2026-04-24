import { notification } from "antd";
import { createContext, useContext } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={{ api }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
