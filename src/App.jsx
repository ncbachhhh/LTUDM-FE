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

function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" description="Đang tải..." />
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
