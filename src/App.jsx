import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainLayout from "./components/layout/MainLayout.jsx";
import ChatPage from "./components/pages/chat/ChatPage.jsx";
// import ContactsPage from './pages/contacts/ContactsPage';
import LoginPage from './components/pages/auth/LoginPage.jsx';

function App() {
  return (
    <Routes>
      {/* Mặc định vào thẳng trang login */}
      <Route path="/" element={<LoginPage />} />
      
      {/* MainLayout bọc ngoài */}
      <Route element={<MainLayout />}>

      {/* Đổi sang trang chat */}
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