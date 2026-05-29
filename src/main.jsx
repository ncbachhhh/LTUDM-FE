import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth.context.jsx";
import { NotificationProvider } from "./contexts/notification.context.jsx";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App.jsx";

const appTheme = {
  token: {
    colorPrimary: "#0029FF",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    borderRadius: 12,
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ConfigProvider theme={appTheme}>
            <App />
          </ConfigProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
