import ChatList from "./components/chat-list/ChatList.jsx";
import ChatWindow from "./components/chat-window/ChatWindow.jsx";
import InfoPanel from "./components/info-panel/InfoPanel.jsx";

const ChatPage = () => {
  return (
    <div className="flex h-full w-full bg-[#f4f5f7] p-6 gap-6 overflow-hidden">
      
      <div className="h-full w-[320px] flex flex-col gap-4">
        <ChatList />
      </div>

      <div className="h-full flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
        <ChatWindow />
      </div>

      <div className="h-full w-[340px] flex flex-col gap-4 custom-scrollbar">
        <InfoPanel />
      </div>
      
    </div>
  );
};

export default ChatPage;