import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import UnreadFilter from './UnreadFilter';
import AddFriendModule from "./AddFriendModule.jsx";
import UserProfileModule from "./UserProfileModule.jsx";
import ChatCard from "./ChatCard.jsx";
import CreateGroupModule from "./CreateGroupModule.jsx";

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("search"); 
  const [selectedChat, setSelectedChat] = useState(null);

  // --- GIỮ NGUYÊN DỮ LIỆU BAN ĐẦU CỦA ÔNG ---
  const [people, setPeople] = useState([
    { id: 1, name: 'Đỗ Minh Vương', msg: 'Khẩu xà tâm phật- super Lọ...', time: '35 phút trước', avatar: 'https://via.placeholder.com/150', unread: true, pinned: false },
    { id: 2, name: 'Nguyễn Chiến Bách', msg: 'Nạp tiền donate cho taoooo...', time: '1 giờ', avatar: 'https://via.placeholder.com/150', unread: true, pinned: false },
    { id: 3, name: 'Lê Duy Bách', msg: 'Check mail giúp mình với', time: '2 giờ', avatar: 'https://i.pravatar.cc/150?u=3', unread: false, pinned: false },
    { id: 4, name: 'Trần Hoàng Nam', msg: 'Tối nay làm ván game không?', time: '5 giờ', avatar: 'https://i.pravatar.cc/150?u=4', unread: true, pinned: false },
    { id: 5, name: 'Phạm Minh Đức', msg: 'Dự án xong chưa ông ơi?', time: '1 ngày', avatar: 'https://i.pravatar.cc/150?u=5', unread: false, pinned: false },
    { id: 6, name: 'Hoàng Thu Trang', msg: 'Gửi mình file Figma nhé', time: '2 ngày', avatar: 'https://i.pravatar.cc/150?u=6', unread: false, pinned: false },
  ]);

  const [groups, setGroups] = useState([
    { id: 101, name: 'Đồ án LT UDM', msg: 'Dương: Quay lại đi...', time: '1 phút trước', avatar: 'https://via.placeholder.com/150', unread: true, pinned: false },
    { id: 102, name: 'Figma Aplus', msg: 'Xuân: Làm lại đi', time: '1 năm', avatar: 'https://via.placeholder.com/150', unread: true, pinned: false },
    { id: 103, name: 'Nhóm ReactJS VN', msg: 'Admin: Chào mừng thành viên mới', time: '2 ngày', avatar: 'https://i.pravatar.cc/150?u=103', unread: false, pinned: false },
    { id: 104, name: 'Team Web Moji', msg: 'Cường: Đã cập nhật Sidebar', time: '3 ngày', avatar: 'https://i.pravatar.cc/150?u=104', unread: false, pinned: false },
    { id: 105, name: 'Gia đình', msg: 'Mẹ: Cuối tuần về ăn cơm nhé', time: '1 tuần', avatar: 'https://i.pravatar.cc/150?u=105', unread: true, pinned: false },
  ]);

  // --- CHỈ THAY ĐỔI ĐÚNG LOGIC TRONG CASE 'PIN' ---
  const handleChatAction = (type, chatId) => {
    const updateList = (list) => {
      switch (type) {
        case 'PIN': {
          const pinnedCount = list.filter(p => p.pinned).length;
          const target = list.find(p => p.id === chatId);
          const isCurrentlyPinned = target?.pinned;

          if (!isCurrentlyPinned && pinnedCount >= 3) {
            alert("Tối đa chỉ ghim được 3 hội thoại!");
            return list;
          }

          // Cập nhật trạng thái ghim
          const updated = list.map(p => 
            p.id === chatId ? { ...p, pinned: !p.pinned, lastPinnedAt: !isCurrentlyPinned ? Date.now() : 0 } : p
          );

          // Sắp xếp: Ghim lên đầu (mới nhất trên cùng), không ghim về theo ID ban đầu
          return [...updated].sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned - a.pinned;
            if (a.pinned && b.pinned) return b.lastPinnedAt - a.lastPinnedAt;
            return a.id - b.id;
          });
        }
        
        case 'HIDE':
        case 'BLOCK':
          return list.filter(p => p.id !== chatId);
        
        case 'MARK_UNREAD':
          return list.map(p => p.id === chatId ? { ...p, unread: true } : p);
        
        case 'READ':
          return list.map(p => p.id === chatId ? { ...p, unread: false } : p);
        
        default:
          return list;
      }
    };

    setPeople(prev => updateList(prev));
    setGroups(prev => updateList(prev));
  };

  const handleOpenAddFriend = () => { setModalView("search"); setIsModalOpen(true); };
  const handleOpenCreateGroup = () => { setModalView("createGroup"); setIsModalOpen(true); };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden bg-transparent">
      <div className="flex items-center">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 px-1">
        <span className="text-[14px] font-black text-slate-800">Chưa đọc</span>
        <UnreadFilter initialEnabled={false} />
      </div>

      <div className="flex min-h-0 flex-[1.55] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-base font-black text-slate-800">PEOPLE</h2>
          <button onClick={handleOpenAddFriend} className="hover:opacity-70 transition-all active:scale-90">
            <img src="/Icon-peolpe.svg" className="h-6 w-6" alt="Add" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {people.map((user) => (
            <ChatCard
              key={user.id}
              id={user.id}
              name={user.name}
              message={user.msg}
              time={user.time}
              avatar={user.avatar}
              isUnread={user.unread}
              isPinned={user.pinned} 
              isActive={selectedChat === user.id}
              onAction={handleChatAction} 
              onClick={() => {
                setSelectedChat(user.id);
                handleChatAction('READ', user.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-base font-black text-slate-800">GROUP</h2>
          <button onClick={handleOpenCreateGroup} className="hover:opacity-70 transition-all active:scale-90">
            <img src="/Icon-group.svg" className="h-6 w-6" alt="Add" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {groups.map((group) => (
            <ChatCard
              key={group.id}
              id={group.id}
              name={group.name}
              message={group.msg}
              time={group.time}
              avatar={group.avatar}
              isUnread={group.unread}
              isPinned={group.pinned}
              isActive={selectedChat === group.id}
              onAction={handleChatAction}
              onClick={() => {
                setSelectedChat(group.id);
                handleChatAction('READ', group.id);
              }}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <>
          {modalView === "createGroup" ? (
            <CreateGroupModule isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          ) : (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-6">
              {modalView === "search" ? (
                <AddFriendModule onClose={() => setIsModalOpen(false)} onSearchSuccess={() => setModalView("profile")} />
              ) : (
                <UserProfileModule onClose={() => setIsModalOpen(false)} onBack={() => setModalView("search")} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}