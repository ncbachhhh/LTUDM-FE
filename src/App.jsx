import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import LoginPage from "./components/pages/auth/LoginPage.jsx";
import ChatPage from "./components/pages/chat/ChatPage.jsx";
import ContactsPage from "./components/pages/contacts/ContactsPage";
import StoragesPage from "./components/pages/storages/StoragesPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/storages" element={<StoragesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
