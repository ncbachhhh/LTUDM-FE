import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserPlus, UserRound, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FriendshipAPI from "../../../apis/friendship.api.jsx";
import { contacts } from "../../../helpers/chatData";
import FriendList from "./components/FriendList";
import FriendRequestModule from "./components/FriendRequestModule";
import GroupList from "./components/GroupList";
import UserProfileModule from "../chat/components/chat-list/UserProfileModule.jsx";

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

const ContactsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("REQUESTS");
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [friendSearchResults, setFriendSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchingFriends, setSearchingFriends] = useState(false);
  const [error, setError] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const loadFriendshipData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [friendsRes, incomingRes, outgoingRes] = await Promise.all([
      FriendshipAPI.getFriends(),
      FriendshipAPI.getIncomingRequests(),
      FriendshipAPI.getOutgoingRequests(),
    ]);

    setFriends((friendsRes.data || []).map(getFriendFromResponse).filter(Boolean));
    setFriendSearchResults(null);
    setIncomingRequests(incomingRes.data || []);
    setOutgoingRequests(outgoingRes.data || []);

    const failed = [friendsRes, incomingRes, outgoingRes].find((res) => !res.isSuccess);
    if (failed) {
      setError(failed.message || "Không thể tải dữ liệu bạn bè");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(loadFriendshipData, 0);
    return () => window.clearTimeout(timerId);
  }, [loadFriendshipData]);

  useEffect(() => {
    if (activeTab !== "FRIENDS") return undefined;

    const query = globalSearch.trim();
    const timerId = window.setTimeout(async () => {
      if (query.length < 2) {
        setFriendSearchResults(null);
        return;
      }

      setSearchingFriends(true);
      const result = await FriendshipAPI.searchFriends(query);
      setSearchingFriends(false);

      if (result.isSuccess) {
        setFriendSearchResults(result.data || []);
      } else {
        setFriendSearchResults([]);
        setError(result.message || "Tìm kiếm bạn bè thất bại");
      }
    }, 250);

    return () => window.clearTimeout(timerId);
  }, [activeTab, globalSearch]);

  const title = useMemo(() => {
    if (activeTab === "FRIENDS") return "Danh sách bạn bè";
    if (activeTab === "GROUPS") return "Danh sách nhóm";
    return "Lời mời kết bạn";
  }, [activeTab]);

  const displayedFriends = friendSearchResults || friends;

  return (
    <div className="flex h-full bg-[#EEF1F6] p-4 gap-4 overflow-hidden">
      <div className="w-[320px] flex flex-col gap-4 shrink-0 h-full">
        <div className="bg-white rounded-[16px] p-2 px-4 flex items-center shadow-sm h-[60px] shrink-0">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            value={globalSearch}
            onChange={(event) => setGlobalSearch(event.target.value)}
            placeholder="Tìm kiếm bạn bè"
            className="w-full bg-transparent outline-none text-[15px] font-medium"
          />
        </div>

        <div className="bg-white rounded-[24px] flex-1 p-6 shadow-sm flex flex-col overflow-hidden">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("FRIENDS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === "FRIENDS"
                  ? "bg-[#F1F4FF] text-black font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserRound size={22} />
              <span className="text-[16px]">Danh sách bạn bè</span>
            </button>
            <button
              onClick={() => setActiveTab("GROUPS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === "GROUPS"
                  ? "bg-[#F1F4FF] text-black font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users size={22} />
              <span className="text-[16px]">Danh sách nhóm</span>
            </button>
            <button
              onClick={() => setActiveTab("REQUESTS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                activeTab === "REQUESTS"
                  ? "bg-[#F1F4FF] text-black font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserPlus size={22} />
              <span className="text-[16px]">Lời mời kết bạn</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-white rounded-[16px] px-8 h-[60px] flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <UserPlus size={22} className="text-black" />
            <h1 className="font-bold text-[17px]">{title}</h1>
          </div>
          <button
            onClick={loadFriendshipData}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#E8EEFB] text-[#0029FF] text-sm font-bold disabled:opacity-50"
          >
            Làm mới
          </button>
        </div>

        {error && (
          <div className="rounded-[12px] bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {activeTab === "FRIENDS" && (
            <FriendList
              friends={displayedFriends}
              searchQuery={friendSearchResults ? "" : globalSearch}
              loading={loading || searchingFriends}
              onOpenProfile={setSelectedProfile}
            />
          )}
          {activeTab === "GROUPS" && <GroupList groups={contacts.groups} />}
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

      {selectedProfile && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-6">
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
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
