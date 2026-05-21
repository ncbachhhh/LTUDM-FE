import React, { useState } from "react";
import { contacts } from "../../../helpers/chatData";
import ChatListStorages from "./ChatListStorages";
import ChatWindowStorages from "./ChatWindowStorages";

const StoragesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [filterType, setFilterType] = useState("SPAM"); // 'SPAM' hoặc 'BLOCK'

  return (
    <div className="flex h-full bg-[#Eef1f6] p-4 gap-4 overflow-hidden">
      {/* CỘT TRÁI: Danh sách SPAM/BLOCK */}
      <div className="w-[340px] flex flex-col gap-4 shrink-0 h-full text-left">
        <ChatListStorages
          people={contacts.people}
          filterType={filterType}
          setFilterType={setFilterType}
          onSelect={setSelectedChat}
          selectedId={selectedChat?.id}
        />
      </div>

      {/* CỘT PHẢI: Khung xác nhận hành động */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden h-full">
        {selectedChat ? (
          <ChatWindowStorages user={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Chọn một hội thoại để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
};

export default StoragesPage;
