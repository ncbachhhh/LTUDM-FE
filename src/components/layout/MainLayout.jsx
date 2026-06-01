import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/auth.context.jsx';
import WebSocketAPI from '../../apis/websocket.api.jsx';
import { Layout } from 'antd';
import { useSound } from '../../contexts/sound.jsx';

const { Sider, Content } = Layout;

const MainLayout = () => {
  const { user, loading } = useAuth();
  //Lấy hàm phát âm thanh
  const { playMessageSound } = useSound(); 
  // ghi nhớ đã thông báo
  const playedSoundMessageIds = useRef(new Set());

  useEffect(() => {
    if (loading || !user) return undefined;

    //Lấy id người dùng hiện tại
    const currentUserId = user?.id || user?.userId;
    let subscription = null;
    let conversationSub = null;
    const initPresence = async () => {
      try {
        subscription = await WebSocketAPI.subscribePresence((presence) => {
          window.dispatchEvent(new CustomEvent("presence:update", { detail: presence }));
        });

        //lắng nghe tin nhắn mới để phát âm thanh thông báo
        conversationSub = await WebSocketAPI.subscribeConversationUpdates((updatedConversation) => {
          if (!updatedConversation?.id) return;
          
          const newMsg = updatedConversation?.latest_message || updatedConversation?.lastMessage;
          
          if (newMsg && newMsg.id) {
             const msgId = newMsg.id;
             const senderId = newMsg?.sender_id || newMsg?.senderId;
             // Kiểm tra xem có phải người khác gửi không
             const isFromOtherPerson = senderId && String(senderId) !== String(currentUserId);
             
             // Nếu là người khác gửi VÀ tin nhắn này chưa từng được kêu chuông
             if (isFromOtherPerson && !playedSoundMessageIds.current.has(msgId)) {
                playMessageSound(); 
                playedSoundMessageIds.current.add(msgId);
             }
          }
        });

      } catch (error) {
        console.error("PRESENCE SUBSCRIBE ERROR:", error);
      }
    };

    initPresence();

    return () => {
      subscription?.unsubscribe();
      conversationSub?.unsubscribe();
    };
  }, [loading, user,playMessageSound]);

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
