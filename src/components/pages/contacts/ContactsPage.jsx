import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Modal } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ConversationAPI from "../../../apis/conversation.api.jsx";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import { useAuth } from "../../../contexts/auth.context.jsx";
import { mapConversationsToContacts } from "../../../features/chat/conversation.mapper.js";
import { getCurrentUserId } from "../../../utils/identity.util.js";
import UserProfileModule from "../chat/components/chat-list/UserProfileModule.jsx";
import FriendList from "./components/FriendList";
import FriendRequestModule from "./components/FriendRequestModule";
import GroupList from "./components/GroupList";

/* ── Helpers ──────────────────────────────────────── */

const getFriendFromResponse = (friendship) => {
  if (!friendship?.user) return friendship;

  return {
    ...friendship.user,
    friendship_id: friendship.id,
    friendshipId: friendship.id,
    friendship_status: friendship.status || "ACCEPTED",
    friendshipStatus: friendship.status || "ACCEPTED",
    friendship_direction: "NONE",
    friendshipDirection: "NONE",
  };
};

/* ── Tab config ──────────────────────────────────── */

const TAB_CONFIG = [
  {
    key: "FRIENDS",
    label: "Danh sách bạn bè",
    icon: <UserOutlined className="!text-lg" />,
  },
  {
    key: "GROUPS",
    label: "Danh sách nhóm",
    icon: <TeamOutlined className="!text-lg" />,
  },
  {
    key: "REQUESTS",
    label: "Lời mời kết bạn",
    icon: <UserAddOutlined className="!text-lg" />,
  },
];

/* ── Component ───────────────────────────────────── */

const ContactsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = getCurrentUserId(user);
  const [activeTab, setActiveTab] = useState("FRIENDS");
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  /* ── Fetch data ────────────────────────────────── */

  const loadFriendshipData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [friendsRes, incomingRes, outgoingRes, conversationsRes] =
      await Promise.all([
        FriendshipAPI.getFriends(),
        FriendshipAPI.getIncomingRequests(),
        FriendshipAPI.getOutgoingRequests(),
        ConversationAPI.getMyConversations(),
      ]);

    setFriends(
      (friendsRes.data || []).map(getFriendFromResponse).filter(Boolean),
    );
    setGroups(
      conversationsRes.isSuccess
        ? mapConversationsToContacts(conversationsRes.data || [], currentUserId)
            .groups
        : [],
    );
    setIncomingRequests(incomingRes.data || []);
    setOutgoingRequests(outgoingRes.data || []);

    const failed = [
      friendsRes,
      incomingRes,
      outgoingRes,
      conversationsRes,
    ].find((res) => !res.isSuccess);

    if (failed) {
      setError(failed.message || "Không thể tải dữ liệu bạn bè");
    }

    setLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    const timerId = window.setTimeout(loadFriendshipData, 0);
    return () => window.clearTimeout(timerId);
  }, [loadFriendshipData]);

  /* ── Presence updates ──────────────────────────── */

  useEffect(() => {
    const handlePresenceUpdate = (event) => {
      const userId = event.detail?.user_id || event.detail?.userId;
      const online = Boolean(event.detail?.is_online ?? event.detail?.online);
      if (!userId) return;

      const applyPresence = (friend) =>
        String(friend.id) === String(userId)
          ? {
              ...friend,
              is_online: online,
              isOnline: online,
              online,
            }
          : friend;

      setFriends((previousFriends) => previousFriends.map(applyPresence));
    };

    window.addEventListener("presence:update", handlePresenceUpdate);
    return () =>
      window.removeEventListener("presence:update", handlePresenceUpdate);
  }, []);

  /* ── Derived state ─────────────────────────────── */

  const title = useMemo(() => {
    if (activeTab === "FRIENDS") return "Danh sách bạn bè";
    if (activeTab === "GROUPS") return "Danh sách nhóm";
    return "Lời mời kết bạn";
  }, [activeTab]);

  const tabIcon = useMemo(() => {
    const found = TAB_CONFIG.find((t) => t.key === activeTab);
    return found?.icon || <UserAddOutlined />;
  }, [activeTab]);

  const displayedFriends = friends;
  const pageError = error;
  const requestCount = incomingRequests.length;

  return (
    <div className="flex h-full bg-[#E9ECF6] p-4 gap-4 overflow-hidden">
      {/* ── Sidebar TRÁI: Chuẩn đét dải xanh tách biệt hộp trắng ── */}
      <div className="w-[320px] flex flex-col gap-3 shrink-0 h-full">
        <div className="w-full bg-[#D1DCFE] text-[#0029FF] border border-[#0029FF]/20 text-center font-black text-[14px] py-3 rounded-xl tracking-wider uppercase select-none shrink-0">
          Danh bạ
        </div>

        <div className="bg-white rounded-[24px] flex-1 p-5 shadow-sm flex flex-col overflow-hidden">
          <nav className="space-y-3">
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200 rounded-2xl border-none outline-none
                    ${isActive ? "text-[#0033FF] font-bold" : "text-black bg-transparent hover:bg-[#EEF2F9]"}`}
                  style={isActive ? { background: "linear-gradient(0deg, rgba(242, 230, 238, 0.3) 0%, rgba(151, 125, 255, 0.3) 100%)" } : {}}
                >
                  <span className={`flex items-center shrink-0 transition-colors ${isActive ? "text-[#0033FF]" : "text-gray-500"}`}>
                    {tab.icon}
                  </span>
                  <span className="text-[16px] flex-1 text-left">
                    {tab.label}
                  </span>
                  {tab.key === "REQUESTS" && requestCount > 0 && (
                    <Badge
                      count={requestCount}
                      size="small"
                      className="[&_.ant-badge-count]:!bg-[#0029FF]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
        {/* Header */}
        <div className="bg-white rounded-[16px] px-8 h-[60px] flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            {tabIcon}
            <h1 className="font-bold text-[17px]">{title}</h1>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadFriendshipData}
            loading={loading}
            className="!rounded-lg !bg-[#E8EEFB] !text-[#0029FF] !border-none !font-bold !text-sm hover:!bg-[#d6e0f7]"
          >
            Làm mới
          </Button>
        </div>

        {/* Error */}
        {pageError && (
          <Alert
            type="error"
            message={pageError}
            showIcon
            closable
            onClose={() => setError("")}
            className="!rounded-xl !font-semibold"
          />
        )}

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "FRIENDS" && (
            <FriendList
              friends={displayedFriends}
              loading={loading}
              onOpenProfile={setSelectedProfile}
            />
          )}
          {activeTab === "GROUPS" && <GroupList groups={groups} />}
          {activeTab === "REQUESTS" && (
            <FriendRequestModule
              incomingRequests={incomingRequests}
              outgoingRequests={outgoingRequests}
              loading={loading}
              onChanged={loadFriendshipData}
            />
          )}
        </div>
      </div>

      {/* ── Profile Modal ────────────────────────── */}
      <Modal
        open={!!selectedProfile}
        onCancel={() => setSelectedProfile(null)}
        footer={null}
        centered
        destroyOnHidden
        width={600}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, borderRadius: 24, overflow: "hidden" },
        }}
        closeIcon={null}
      >
        {selectedProfile && (
          <UserProfileModule
            key={selectedProfile.id}
            user={selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onFriendshipChanged={loadFriendshipData}
            onMessageClick={(userId) => {
              setSelectedProfile(null);
              navigate(`/chat?userId=${encodeURIComponent(userId)}`);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ContactsPage;