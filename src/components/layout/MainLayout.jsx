import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/auth.context.jsx';
import WebSocketAPI from '../../apis/websocket.api.jsx';
import { Layout } from 'antd';

const { Sider, Content } = Layout;

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
    <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', flexDirection: 'row' }}>
      {/* THANH ĐIỀU HƯỚNG BÊN TRÁI (SIDER CỐ ĐỊNH) */}
      <Sider 
        width={80} 
        style={{ 
          background: '#0029FF', 
          height: '100%',
          zIndex: 50,
        }}
      >
        <Sidebar />
      </Sider>

      {/* VÙNG BÊN PHẢI (CONTENT CHÍNH) */}
      <Content style={{ background: '#ffffff', height: '100%', overflow: 'hidden' }}>
        <Outlet /> 
      </Content>
    </Layout>
  );
};

export default MainLayout;
