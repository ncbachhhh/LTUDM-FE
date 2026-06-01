import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import LoginPage from "./components/pages/auth/LoginPage.jsx";
import ChatPage from "./components/pages/chat/ChatPage.jsx";
import ContactsPage from "./components/pages/contacts/ContactsPage";
import StoragesPage from "./components/pages/storages/StoragesPage.jsx";
import ProfilePage from "./components/pages/profile/ProfilePage.jsx"; // Đã có trong cây thư mục
import SettingsPage from "./components/pages/settings/SettingPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/storages" element={<StoragesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;