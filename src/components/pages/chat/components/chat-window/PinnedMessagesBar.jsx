// FILE: PinnedMessagesBar.jsx
import { List, Dropdown, message } from "antd";
import { useState } from "react";
import { FaThumbtack, FaChevronDown, FaRegCommentAlt, FaEllipsisH, FaChevronUp } from "react-icons/fa";

export default function PinnedMessagesBar({ 
  pinnedMessages, 
  latestPinnedMessage, 
  onJumpTo, 
  getMessagePreview,
  onPin 
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!latestPinnedMessage || pinnedMessages.length === 0) return null;

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép tin nhắn vào bộ nhớ tạm");
  };

  const getActionMenuItems = (item) => [
    {
      key: "unpin",
      label: <span className="text-sm text-red-500 font-medium">Bỏ ghim</span>,
      onClick: () => {
        if (onPin) onPin(item.id);
        else message.warning("Tính năng hủy ghim đang được đồng bộ");
      }
    },
    {
      key: "copy",
      label: <span className="text-sm text-gray-700">Sao chép</span>,
      onClick: () => handleCopyText(item.text || item.content || "")
    }
  ];

  return (
    <div className="w-full relative z-30 bg-transparent px-4 mt-3 mb-1 flex flex-col gap-1">
      
      {/* 1. TRẠNG THÁI ĐÓNG: Chỉ hiện thanh ghim xám nhỏ nhắn */}
      {!isOpen && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#f1f2f4] shadow-sm animate-fadeIn">
          <button
            type="button"
            onClick={() => onJumpTo(latestPinnedMessage.id)}
            className="flex min-w-0 items-center gap-3 flex-1 text-left"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
               <FaThumbtack size={14} />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="text-sm font-bold text-gray-900 truncate">Tin nhắn</span>
              <span className="text-sm text-gray-600 truncate">
                {latestPinnedMessage.senderName ? `${latestPinnedMessage.senderName}: ` : ""}{getMessagePreview(latestPinnedMessage)}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700">
                {pinnedMessages.length > 1 ? `+${pinnedMessages.length - 1} ghim` : "1 ghim"}
              </span>
              <FaChevronDown size={12} className="text-gray-500" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-200/50 rounded-full transition-colors">
              <FaEllipsisH size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2. TRẠNG THÁI MỞ: Hiện Box danh sách ghim xám lớn, không có bất kỳ overlay nào */}
      {isOpen && (
        <div className="w-full bg-[#f1f2f4] rounded-xl shadow-lg flex flex-col border border-gray-300/60 overflow-hidden animate-fadeIn">
          
          {/* Header danh sách ghim */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#f1f2f4]">
             <span className="font-bold text-sm text-gray-800">
               Danh sách ghim ({pinnedMessages.length})
             </span>
             <button 
               onClick={() => setIsOpen(false)}
               className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
             >
               Thu gọn <FaChevronUp size={12} className="text-gray-500" />
             </button>
          </div>

          {/* Nội dung danh sách ghim */}
          <div className="max-h-[240px] overflow-y-auto bg-[#f1f2f4] px-2 pb-2">
            <List
              size="large"
              dataSource={pinnedMessages}
              renderItem={(item) => (
                <List.Item 
                  className="cursor-pointer hover:bg-gray-200/60 px-3 py-3 transition-colors border-b border-gray-200 last:border-0 rounded-lg"
                  onClick={() => {
                    onJumpTo(item.id);
                    setIsOpen(false);
                  }}
                >
                  <List.Item.Meta
                    avatar={<FaRegCommentAlt className="text-blue-500 mt-1" size={16}/>}
                    title={<span className="text-sm font-bold text-gray-800">Tin nhắn</span>}
                    description={
                      <span className="text-sm text-gray-600 block truncate">
                        {item.senderName ? `${item.senderName}: ` : ""}{getMessagePreview(item)}
                      </span>
                    }
                  />

                  {/* Menu tương tác 3 chấm */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      menu={{ items: getActionMenuItems(item) }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <button className="text-gray-400 hover:text-gray-600 ml-2 p-1.5 hover:bg-gray-300/70 rounded-full transition-colors">
                        <FaEllipsisH size={14} />
                      </button>
                    </Dropdown>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}