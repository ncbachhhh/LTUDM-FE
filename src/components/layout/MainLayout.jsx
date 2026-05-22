import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/auth.context.jsx';
import WebSocketAPI from '../../apis/websocket.api.jsx';

const MainLayout = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return undefined;

    let subscription = null;
    const initPresence = async () => {
      try {
        subscription = await WebSocketAPI.subscribePresence((presence) => {
          window.dispatchEvent(new CustomEvent("presence:update", { detail: presence }));
        });
      } catch (error) {
        console.error("PRESENCE SUBSCRIBE ERROR:", error);
      }
    };

    initPresence();

    return () => {
      subscription?.unsubscribe();
    };
  }, [loading, user]);

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
