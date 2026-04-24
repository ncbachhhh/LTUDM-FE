import ChatInput from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";
import { activeConversation } from "../../helpers/chatData.js";

export default function ChatWindow() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div className="flex items-center gap-4">
          <img
            src={activeConversation.avatar}
            className="h-11 w-11 rounded-full object-cover"
            alt={activeConversation.name}
          />
          <span className="text-base font-black">{activeConversation.name}</span>
        </div>

        <img
          src="/thong-tin-hoi-thoai.svg"
          className="h-6 w-6"
          alt="Thông tin hội thoại"
        />
      </div>

      <MessageList />
      <ChatInput />
    </div>
  );
}
