import React, { useEffect, useState } from "react";
import { Modal, Spin, Typography } from "antd";
import SearchBar from "./SearchBar.jsx";
import UnreadFilter from "./UnreadFilter";
import AddFriendModule from "./AddFriendModule.jsx";
import UserProfileModule from "./UserProfileModule.jsx";
import ContactItem from "./ContactItem.jsx";
import CreateGroupModule from "./CreateGroupModule.jsx";
import { FaUserPlus, FaUsers } from "react-icons/fa";

const { Text } = Typography;

export default function ChatList({
  contacts = { people: [], groups: [] },
  loading = false,
  currentConvoId,
  onSelect,
  onOpenDirectConversation,
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
    setPeople((prev) =>
      (contacts?.people || []).map((p, index) => {
        const existing = prev.find((item) => item.id === p.id);
        return {
          ...p,
          msg: p.message,
          unread: Boolean(p.unread || p.unreadCount > 0),
          unreadCount: p.unreadCount || 0,
          pinned: existing ? existing.pinned : false,
          order: index,
        };
      })
    );
  }, [contacts?.people]);

  useEffect(() => {
    setGroups((prev) =>
      (contacts?.groups || []).map((g, index) => {
        const existing = prev.find((item) => item.id === g.id);
        return {
          ...g,
          msg: g.message || "Chưa có tin nhắn",
          unread: Boolean(g.unread || g.unreadCount > 0),
          unreadCount: g.unreadCount || 0,
          pinned: existing ? existing.pinned : false,
          order: index,
        };
      })
    );
  }, [contacts?.groups]);

  const handleCreateGroup = (newGroup) => {
    setGroups((prevGroups) => [{ ...newGroup, order: -1 }, ...prevGroups]);
    setIsModalOpen(false);
  };

  const handleChatAction = (type, chatId) => {
    const updateList = (list) => {
      switch (type) {
        case "PIN": {
          const pinnedCount = list.filter((p) => p.pinned).length;
          const target = list.find((p) => p.id === chatId);
          const isCurrentlyPinned = target?.pinned;

          if (!isCurrentlyPinned && pinnedCount >= 3) {
            // Dùng antd Modal.confirm thay cho alert() thuần
            Modal.warning({
              title: "Không thể ghim thêm",
              content: "Tối đa chỉ ghim được 3 hội thoại!",
              okText: "Đồng ý",
            });
            return list;
          }

          const updated = list.map((p) =>
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

        case "HIDE":
        case "BLOCK":
          return list.filter((p) => p.id !== chatId);

        case "MARK_UNREAD":
          return list.map((p) => (p.id === chatId ? { ...p, unread: true } : p));

        case "READ":
          return list.map((p) => (p.id === chatId ? { ...p, unread: false } : p));

        default:
          return list;
      }
    };

    setPeople((prev) => updateList(prev));
    setGroups((prev) => updateList(prev));
  };

  const handleOpenAddFriend = () => {
    setModalView("search");
    setIsModalOpen(true);
  };

  const handleOpenCreateGroup = () => {
    setModalView("createGroup");
    setIsModalOpen(true);
  };

  const handleSelect = (id) => {
    setSelectedChat(id);
    handleChatAction("READ", id);
    onSelect?.(id);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden bg-transparent">
      {/* Thanh tìm kiếm bạn bè */}
      <div className="flex items-center">
        <SearchBar contacts={contacts} />
      </div>

      {/* Bộ lọc chưa đọc */}
      <div className="flex items-center gap-3 px-1">
        <Text strong className="text-[14px] text-slate-800">Chưa đọc</Text>
        <UnreadFilter initialEnabled={false} />
      </div>

      {/* Danh sách hội thoại cá nhân */}
      <div className="flex min-h-0 flex-[1.55] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <Text strong className="text-base text-slate-800 uppercase tracking-wider">People</Text>
          <button
            type="button"
            onClick={handleOpenAddFriend}
            className="hover:opacity-70 transition-all active:scale-90"
            title="Thêm bạn"
          >
            <FaUserPlus className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="mt-6 flex justify-center">
              <Spin tip="Đang tải hội thoại..." />
            </div>
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
                isOnline={user.isActive}
                unreadCount={user.unreadCount}
                isPinned={user.pinned}
                isActive={selectedChat === user.id}
                onAction={handleChatAction}
                onClick={() => handleSelect(user.id)}
              />
            ))
          ) : (
            <Text type="secondary" className="mt-6 block text-center text-xs font-semibold">
              Không có hội thoại cá nhân
            </Text>
          )}
        </div>
      </div>

      {/* Danh sách nhóm chat */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <Text strong className="text-base text-slate-800 uppercase tracking-wider">Group</Text>
          <button
            type="button"
            onClick={handleOpenCreateGroup}
            className="hover:opacity-70 transition-all active:scale-90"
            title="Tạo nhóm"
          >
            <FaUsers className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="mt-6 flex justify-center">
              <Spin tip="Đang tải nhóm..." />
            </div>
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
                unreadCount={group.unreadCount}
                isPinned={group.pinned}
                isActive={selectedChat === group.id}
                onAction={handleChatAction}
                onClick={() => handleSelect(group.id)}
              />
            ))
          ) : (
            <Text type="secondary" className="mt-6 block text-center text-xs font-semibold">
              Không có nhóm chat
            </Text>
          )}
        </div>
      </div>

      {/* Modal Thêm bạn / Xem profile người dùng */}
      <Modal
        open={isModalOpen && modalView !== "createGroup"}
        onCancel={handleCloseModal}
        footer={null}
        centered
        destroyOnHidden
        width={580}
        styles={{ body: { padding: 0 }, content: { padding: 0, borderRadius: 24, overflow: "hidden" } }}
        closeIcon={null}
      >
        {modalView === "search" ? (
          <AddFriendModule
            onClose={handleCloseModal}
            onSearchSuccess={(user) => {
              setSearchedUser(user);
              setModalView("profile");
            }}
          />
        ) : (
          <UserProfileModule
            user={searchedUser}
            onClose={handleCloseModal}
            onBack={() => setModalView("search")}
            onMessageClick={(friendId) => {
              handleCloseModal();
              onOpenDirectConversation?.(friendId);
            }}
          />
        )}
      </Modal>

      {/* Modal Tạo nhóm */}
      <Modal
        open={isModalOpen && modalView === "createGroup"}
        onCancel={handleCloseModal}
        footer={null}
        centered
        destroyOnHidden
        width={500}
        styles={{ body: { padding: 0 }, content: { padding: 0, borderRadius: 24, overflow: "hidden" } }}
        closeIcon={null}
      >
        <CreateGroupModule
          isOpen={isModalOpen && modalView === "createGroup"}
          onClose={handleCloseModal}
          onCreate={handleCreateGroup}
          contacts={contacts}
        />
      </Modal>
    </div>
  );
}
