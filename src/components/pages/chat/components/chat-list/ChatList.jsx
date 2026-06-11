import React, { useEffect, useState } from "react";
import { Modal, Spin, Typography } from "antd";
import SearchBar from "./SearchBar.jsx";
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
  onCreateGroup,
  onDeleteConversation,
  onBlockUser,
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
    setPeople(
      (contacts?.people || []).map((p) => ({
        ...p,
        msg: p.message,
        unread: Boolean(p.unread || p.unreadCount > 0),
        unreadCount: p.unreadCount || 0,
      }))
    );
  }, [contacts?.people]);

  useEffect(() => {
    setGroups(
      (contacts?.groups || []).map((g) => ({
        ...g,
        msg: g.message || "Chưa có tin nhắn",
        unread: Boolean(g.unread || g.unreadCount > 0),
        unreadCount: g.unreadCount || 0,
      }))
    );
  }, [contacts?.groups]);

    // Mock handleCreateGroup removed

  const removeChatLocally = (chatId) => {
    setPeople((prev) => prev.filter((item) => item.id !== chatId));
    setGroups((prev) => prev.filter((item) => item.id !== chatId));
  };

  const markChatUnreadLocally = (chatId, unread) => {
    setPeople((prev) => prev.map((item) => (item.id === chatId ? { ...item, unread } : item)));
    setGroups((prev) => prev.map((item) => (item.id === chatId ? { ...item, unread } : item)));
  };

  const handleChatAction = async (type, chatId) => {
    const directChat = people.find((item) => item.id === chatId);
    const groupChat = groups.find((item) => item.id === chatId);
    const targetChat = directChat || groupChat;
    if (!targetChat) return;

    if (type === "READ") {
      markChatUnreadLocally(chatId, false);
      return;
    }

    if (type === "DELETE") {
      Modal.confirm({
        title: "Xóa đoạn chat?",
        content: "Toàn bộ tin nhắn hiện tại sẽ không hiển thị với bạn. Người khác vẫn thấy lịch sử của họ.",
        okText: "Xóa",
        okButtonProps: { danger: true },
        cancelText: "Hủy",
        onOk: async () => {
          const success = await onDeleteConversation?.(targetChat.conversation_id || targetChat.id);
          if (success) removeChatLocally(chatId);
        },
      });
      return;
    }

    if (type === "BLOCK" && directChat?.userId) {
      Modal.confirm({
        title: `Chặn ${directChat.name}?`,
        content: "Bạn sẽ không nhận hoặc gửi tin nhắn với người này cho đến khi bỏ chặn.",
        okText: "Chặn",
        okButtonProps: { danger: true },
        cancelText: "Hủy",
        onOk: async () => {
          const success = await onBlockUser?.(directChat.userId, directChat.conversation_id || directChat.id);
          if (success) removeChatLocally(chatId);
        },
      });
    }
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

      {/* Danh sách hội thoại cá nhân */}
      <div className="flex min-h-0 flex-[1.45] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
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
                isActive={selectedChat === user.id}
                canBlock
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
      <div className="flex min-h-0 flex-[1.15] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
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
          onCreate={onCreateGroup}
          contacts={contacts}
        />
      </Modal>
    </div>
  );
}
