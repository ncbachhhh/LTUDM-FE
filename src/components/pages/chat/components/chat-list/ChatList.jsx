import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";
import UnreadFilter from './UnreadFilter';
import AddFriendModule from "./AddFriendModule.jsx";
import UserProfileModule from "./UserProfileModule.jsx";
import ContactItem from "./ContactItem.jsx";
import CreateGroupModule from "./CreateGroupModule.jsx";

export default function ChatList({
  contacts = { people: [], groups: [] },
  loading = false,
  currentConvoId,
  onSelect,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("search"); 
  const [selectedChat, setSelectedChat] = useState(currentConvoId || null);
  const [searchedUser, setSearchedUser] = useState(null);

  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setSelectedChat(currentConvoId);
  }, [currentConvoId]);

  useEffect(() => {
    setPeople(prev => {
      return (contacts?.people || []).map((p, index) => {
        const existing = prev.find(item => item.id === p.id);
        return {
          ...p,
          msg: p.message, 
          unread: existing ? existing.unread : false,
          pinned: existing ? existing.pinned : false,
          order: existing ? existing.order : index 
        };
      });
    });
  }, [contacts?.people]);

  useEffect(() => {
    setGroups(prev => {
      return (contacts?.groups || []).map((g, index) => {
        const existing = prev.find(item => item.id === g.id);
        return {
          ...g,
          msg: g.message || "Chưa có tin nhắn",
          unread: existing ? existing.unread : false,
          pinned: existing ? existing.pinned : false,
          order: existing ? existing.order : index 
        };
      });
    });
  }, [contacts?.groups]);

  // --- HÀM THÊM NHÓM MỚI ---
  const handleCreateGroup = (newGroup) => {
    setGroups(prevGroups => {
      // Thêm nhóm mới vào đầu danh sách (order: -1 để luôn nằm trên các nhóm cũ)
      const updatedGroups = [{ ...newGroup, order: -1 }, ...prevGroups];
      return updatedGroups;
    });
    setIsModalOpen(false); // Đóng modal sau khi tạo thành công
  };

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

          const updated = list.map(p => 
            p.id === chatId 
              ? { ...p, pinned: !p.pinned, lastPinnedAt: !isCurrentlyPinned ? Date.now() : 0 } 
              : p
          );

          return [...updated].sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned - a.pinned;
            if (a.pinned && b.pinned) return b.lastPinnedAt - a.lastPinnedAt;
            return a.order - b.order;
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

  const handleSelect = (id) => {
    setSelectedChat(id);
    handleChatAction('READ', id);
    if (onSelect) onSelect(id);
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden bg-transparent">
      <div className="flex items-center">
        <SearchBar contacts={contacts} />
      </div>

      <div className="flex items-center gap-3 px-1">
        <span className="text-[14px] font-black text-slate-800">Chưa đọc</span>
        <UnreadFilter initialEnabled={false} />
      </div>

      {/* SECTION PEOPLE */}
      <div className="flex min-h-0 flex-[1.55] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">People</h2>
          <button onClick={handleOpenAddFriend} className="hover:opacity-70 transition-all active:scale-90">
            <img src="/Icon-peolpe.svg" className="h-6 w-6" alt="Add" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
             <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                 Đang tải hội thoại...
             </p>
          ) : people.length > 0 ? (
            people.map((user) => (
              <ContactItem
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
                onClick={() => handleSelect(user.id)}
              />
            ))
          ) : (
            <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                Không có hội thoại cá nhân
            </p>
          )}
        </div>
      </div>

      {/* SECTION GROUP */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Group</h2>
          <button onClick={handleOpenCreateGroup} className="hover:opacity-70 transition-all active:scale-90">
            <img src="/Icon-group.svg" className="h-6 w-6" alt="Add" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
              <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                  Đang tải nhóm...
              </p>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <ContactItem
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
                onClick={() => handleSelect(group.id)}
              />
            ))
          ) : (
            <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                Không có nhóm chat
            </p>
          )}
        </div>
      </div>
          
      {/* MODALS LAYER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-6">
          {modalView === "createGroup" ? (
            <CreateGroupModule 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onCreate={handleCreateGroup} 
              contacts={contacts}
            />
          ) : modalView === "search" ? (
            <AddFriendModule 
              onClose={() => setIsModalOpen(false)} 
              onSearchSuccess={(user) => {
                 setSearchedUser(user);
                 setModalView("profile");
              }} 
            />
          ) : (
            <UserProfileModule 
              user={searchedUser}
              onClose={() => setIsModalOpen(false)} 
              onBack={() => setModalView("search")} 
              onMessageClick={(friendId) => {
                 setIsModalOpen(false);
                 handleSelect(friendId);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}