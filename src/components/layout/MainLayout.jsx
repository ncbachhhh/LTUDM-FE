import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* THANH ĐIỀU HƯỚNG BÊN TRÁI (LUÔN CỐ ĐỊNH) */}
      <Sidebar />

      {/* VÙNG BÊN PHẢI: Thay đổi tùy theo url (ChatPage, ContactsPage...) */}
      <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;