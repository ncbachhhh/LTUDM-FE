import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import LoginPage from "./components/pages/auth/LoginPage.jsx";
import ChatPage from "./components/pages/chat/ChatPage.jsx";
import ContactsPage from "./components/pages/contacts/ContactsPage";
import StoragesPage from "./components/pages/storages/StoragesPage.jsx";
import { SoundProvider } from "./contexts/sound.jsx"; 
import ProfilePage from "./components/pages/profile/ProfilePage.jsx"; // Đã có trong cây thư mục
import SettingsPage from "./components/pages/settings/SettingPage.jsx";
import { useAuth } from "./contexts/auth.context.jsx";
import { Spin } from "antd";
import { useEffect } from "react";

const DEFAULT_CHAT_COLOR = "#0033FF";

function getUserTheme(user) {
  return user?.theme_mode || user?.themeMode || "light";
}

function getUserChatColor(user) {
  return user?.chat_color || user?.chatColor || DEFAULT_CHAT_COLOR;
}

function AppearanceSync() {
  const { user } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    const theme = getUserTheme(user) === "dark" ? "dark" : "light";
    const chatColor = getUserChatColor(user);

    root.dataset.theme = theme;
    root.style.setProperty("--chat-bubble-bg", chatColor);
    root.style.setProperty("--app-accent", chatColor);

    return () => {
      root.dataset.theme = "light";
      root.style.setProperty("--chat-bubble-bg", DEFAULT_CHAT_COLOR);
      root.style.setProperty("--app-accent", DEFAULT_CHAT_COLOR);
    };
  }, [user]);

  return null;
}

function LoadingScreen() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}

function App() {
  return (
    <SoundProvider>
      <AppearanceSync />
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/storages" element={<StoragesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </SoundProvider>
  );
}

export default App;
