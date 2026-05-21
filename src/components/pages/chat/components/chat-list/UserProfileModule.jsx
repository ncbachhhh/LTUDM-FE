import { useState } from "react";
import FriendshipAPI from "../../../../../apis/friendship.api.jsx";

const DEFAULT_AVATAR = "/anh-avata.svg";

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || DEFAULT_AVATAR;

const getFriendshipStatus = (user) =>
  user?.friendship_status || user?.friendshipStatus || "NONE";

const getFriendshipDirection = (user) =>
  user?.friendship_direction || user?.friendshipDirection || "NONE";

const getRequestUserId = (request) => request?.user?.id || request?.userId;

export default function UserProfileModule({
  onClose,
  onBack,
  user,
  onMessageClick,
  onFriendshipChanged,
}) {
  const [friendshipStatus, setFriendshipStatus] = useState(getFriendshipStatus(user));
  const [friendshipDirection, setFriendshipDirection] = useState(getFriendshipDirection(user));
  const [friendshipId, setFriendshipId] = useState(user?.friendship_id || user?.friendshipId || null);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  const resolveOutgoingRequestId = async () => {
    if (friendshipId) return friendshipId;

    const response = await FriendshipAPI.getOutgoingRequests();
    if (!response.isSuccess) {
      setError(response.message);
      return null;
    }

    const request = response.data.find((item) => getRequestUserId(item) === user.id);
    if (!request?.id) {
      setError("Không tìm thấy lời mời đang chờ.");
      return null;
    }

    setFriendshipId(request.id);
    return request.id;
  };

  const resolveAcceptedFriendshipId = async () => {
    if (friendshipId) return friendshipId;

    const response = await FriendshipAPI.getFriends();
    if (!response.isSuccess) {
      setError(response.message);
      return null;
    }

    const friendship = response.data.find((item) => getRequestUserId(item) === user.id);
    if (!friendship?.id) {
      setError("Không tìm thấy quan hệ bạn bè.");
      return null;
    }

    setFriendshipId(friendship.id);
    return friendship.id;
  };

  const handleSendRequest = async () => {
    setLoadingAction("SEND");
    setError("");
    const response = await FriendshipAPI.sendRequest(user.id);
    setLoadingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    setFriendshipStatus("PENDING");
    setFriendshipDirection("OUTGOING");
    setFriendshipId(response.data?.id || null);
    onFriendshipChanged?.();
  };

  const handleWithdrawRequest = async () => {
    setLoadingAction("WITHDRAW");
    setError("");
    const requestId = await resolveOutgoingRequestId();

    if (!requestId) {
      setLoadingAction("");
      return;
    }

    const response = await FriendshipAPI.withdrawRequest(requestId);
    setLoadingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    setFriendshipStatus("NONE");
    setFriendshipDirection("NONE");
    setFriendshipId(null);
    onFriendshipChanged?.();
  };

  const handleDeleteFriend = async () => {
    setLoadingAction("DELETE");
    setError("");
    const acceptedFriendshipId = await resolveAcceptedFriendshipId();

    if (!acceptedFriendshipId) {
      setLoadingAction("");
      return;
    }

    const response = await FriendshipAPI.deleteFriend(acceptedFriendshipId);
    setLoadingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    setFriendshipStatus("NONE");
    setFriendshipDirection("NONE");
    setFriendshipId(null);
    onFriendshipChanged?.();
  };

  const handleBlockUser = async () => {
    setLoadingAction("BLOCK");
    setError("");
    const response = await FriendshipAPI.blockUser(user.id);
    setLoadingAction("");

    if (!response.isSuccess) {
      setError(response.message);
      return;
    }

    setFriendshipStatus("BLOCKED");
    setFriendshipDirection("NONE");
    setFriendshipId(response.data?.id || null);
    onFriendshipChanged?.();
  };

  const renderPrimaryActions = () => {
    if (friendshipStatus === "ACCEPTED") {
      return (
        <>
          <button
            onClick={() => onMessageClick?.(user.id)}
            className="flex-1 rounded-[20px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-[#1E293B] hover:bg-[#A5B9F9] transition-all active:scale-[0.98]"
          >
            Nhắn tin
          </button>
          <button
            disabled={Boolean(loadingAction)}
            onClick={handleDeleteFriend}
            className="flex-1 rounded-[20px] bg-red-50 py-4 text-[18px] font-bold text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
          >
            {loadingAction === "DELETE" ? "Đang xóa..." : "Xóa bạn"}
          </button>
        </>
      );
    }

    if (friendshipStatus === "PENDING" && friendshipDirection === "OUTGOING") {
      return (
        <>
          <button
            disabled
            className="flex-1 rounded-[20px] bg-gray-100 text-gray-500 py-4 text-[18px] font-bold cursor-not-allowed"
          >
            Đã gửi lời mời
          </button>
          <button
            disabled={Boolean(loadingAction)}
            onClick={handleWithdrawRequest}
            className="flex-1 rounded-[20px] bg-[#F3F4F1] py-4 text-[18px] font-bold text-black hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {loadingAction === "WITHDRAW" ? "Đang hủy..." : "Hủy lời mời"}
          </button>
        </>
      );
    }

    if (friendshipStatus === "PENDING" && friendshipDirection === "INCOMING") {
      return (
        <button
          disabled
          className="w-full rounded-[20px] bg-gray-100 text-gray-500 py-4 text-[18px] font-bold cursor-not-allowed"
        >
          Đang chờ bạn phản hồi ở mục lời mời
        </button>
      );
    }

    if (friendshipStatus === "BLOCKED") {
      return (
        <button
          disabled
          className="w-full rounded-[20px] bg-gray-100 text-gray-500 py-4 text-[18px] font-bold cursor-not-allowed"
        >
          Đã chặn người dùng
        </button>
      );
    }

    return (
      <button
        disabled={Boolean(loadingAction)}
        onClick={handleSendRequest}
        className="w-full rounded-[20px] py-4 text-[18px] font-bold transition-all bg-[#F3F4F1] text-black hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
      >
        {loadingAction === "SEND" ? "Đang gửi..." : "Kết bạn"}
      </button>
    );
  };

  return (
    <div className="flex h-[90%] max-h-[800px] w-[60%] min-w-[500px] flex-col rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
      <div className="shrink-0 px-8 py-6 border-b border-gray-50 bg-white z-20">
        <div className="relative flex items-center justify-center">
          {onBack && (
            <button onClick={onBack} className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-all">
              <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-[24px] font-bold text-black">Thông tin cá nhân</h2>
          <button onClick={onClose} className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-all">
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:my-6 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col">
          <div className="relative min-h-[450px] flex flex-col">
            <div className="h-[200px] w-full overflow-hidden bg-slate-200">
              <img
                src="https://via.placeholder.com/1200x400"
                className="h-full w-full object-cover"
                alt=""
              />
            </div>

            <div className="px-12 -mt-10 flex items-end gap-6 text-left">
              <div className="h-32 w-32 shrink-0 rounded-full border-[5px] border-white shadow-lg overflow-hidden bg-white">
                <img src={getAvatarUrl(user)} className="h-full w-full object-cover" alt="" />
              </div>
              <div className="mb-2 min-w-0">
                <h1 className="text-[26px] font-black text-black leading-tight truncate">
                  {getDisplayName(user)}
                </h1>
                <p className="text-[16px] font-bold text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {error && (
              <div className="mx-12 mt-6 rounded-[14px] bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 flex gap-4 px-12 pb-10">
              {renderPrimaryActions()}
            </div>

            {friendshipStatus !== "BLOCKED" && (
              <div className="px-12 pb-10">
                <button
                  disabled={Boolean(loadingAction)}
                  onClick={handleBlockUser}
                  className="w-full rounded-[20px] border border-red-100 bg-white py-3 text-[16px] font-bold text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  {loadingAction === "BLOCK" ? "Đang chặn..." : "Chặn người này"}
                </button>
              </div>
            )}
          </div>

          <div className="h-[10px] w-full bg-[#F8F9FC]"></div>

          <div className="px-14 py-10">
            <h3 className="mb-8 text-[24px] font-bold text-black text-left">Thông tin tài khoản</h3>
            <div className="flex flex-col gap-6 pb-20">
              {[
                { label: "Email:", value: user.email },
                { label: "Tên đăng nhập:", value: user.username },
                { label: "Trạng thái:", value: friendshipStatus },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-gray-50 pb-5 gap-6">
                  <span className="text-[19px] font-semibold text-slate-400 italic">{item.label}</span>
                  <span className="text-[19px] font-bold text-black truncate">{item.value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
