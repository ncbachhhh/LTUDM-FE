import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainLayout from "./components/layout/MainLayout.jsx";
import ChatPage from "./components/pages/chat/ChatPage.jsx";
// import ContactsPage from './pages/contacts/ContactsPage';

function App() {
  return (
    <Routes>
      {/* MainLayout bọc ngoài */}
      <Route element={<MainLayout />}>
         
        {/* Mặc định vào thẳng trang chat */}
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
          
        {/* Đổi sang danh bạ */}
        {/* <Route path="/contacts" element={<ContactsPage />} /> */}

        {/* Đổi sang lưu trữ */}
        {/* <Route path="/storages" element={<StoragesPage />} /> */}

        {/* Đổi sang cài đặt */}
        {/* <Route path="/setting" element={<SettingPage />} /> */}
          
      </Route>
    </Routes>
);
}

export default App;