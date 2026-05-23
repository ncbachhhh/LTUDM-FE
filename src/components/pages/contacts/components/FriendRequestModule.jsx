import { useState } from "react";
import FriendshipAPI from "../../../../apis/friendship.api.jsx";
import { PROFILE_AVATAR } from "../../../../constants/asset.constants.js";

const getRequestUser = (request) => request?.user || {};

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || PROFILE_AVATAR;

const formatRequestTime = (request) => {
  const value = request?.created_at || request?.createdAt;
  if (!value) return "Đang chờ xử lý";

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "Đang chờ xử lý";

  return createdAt.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const EmptyState = ({ text }) => (
  <div className="rounded-[16px] bg-[#F8F9FC] px-6 py-10 text-center text-sm font-semibold text-gray-400">
    {text}
  </div>
);

const FriendRequestModule = ({
  incomingRequests = [],
  outgoingRequests = [],
  loading = false,
  onChanged,
}) => {
  const [viewMode, setViewMode] = useState("DEFAULT");
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const handleRequestAction = async (request, action) => {
    if (!request?.id || processingId) return;

    setProcessingId(request.id);
    setError("");

    const result =
      action === "ACCEPT"
        ? await FriendshipAPI.acceptRequest(request.id)
        : action === "DECLINE"
          ? await FriendshipAPI.declineRequest(request.id)
          : await FriendshipAPI.withdrawRequest(request.id);

    setProcessingId(null);

    if (!result.isSuccess) {
      setError(result.message);
      return;
    }

    onChanged?.();
  };

  const RequestCard = ({ request, isSent }) => {
    const user = getRequestUser(request);
    const isProcessing = processingId === request.id;

    return (
      <div
        className={`bg-[#F1F3F7] p-5 rounded-[16px] flex items-center gap-4 shadow-sm ${
          viewMode === "DEFAULT" ? "min-w-[330px]" : "w-full"
        }`}
      >
        <img
          src={getAvatarUrl(user)}
          className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white shadow-sm shrink-0"
          alt=""
        />

        <div className="flex flex-col flex-1 min-w-0 text-left">
          <div className="mb-3 min-w-0">
            <p className="font-bold text-[16px] text-gray-800 truncate">
              {getDisplayName(user)}
            </p>
            {user.email && <p className="text-[12px] text-gray-500 truncate">{user.email}</p>}
            <p className="text-[11px] text-gray-400 italic">{formatRequestTime(request)}</p>
          </div>

          {!isSent ? (
            <div className="flex gap-2 w-full">
              <button
                disabled={isProcessing}
                onClick={() => handleRequestAction(request, "ACCEPT")}
                className="flex-1 py-2 bg-[#BCCCFE] text-[#0029FF] rounded-lg text-[12px] font-bold hover:bg-blue-300 disabled:opacity-50"
              >
                {isProcessing ? "Đang xử lý" : "Chấp nhận"}
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleRequestAction(request, "DECLINE")}
                className="flex-1 py-2 bg-[#D9D9D9] text-gray-700 rounded-lg text-[12px] font-bold hover:bg-gray-300 disabled:opacity-50"
              >
                Từ chối
              </button>
            </div>
          ) : (
            <button
              disabled={isProcessing}
              onClick={() => handleRequestAction(request, "WITHDRAW")}
              className="w-full py-2 bg-[#D9D9D9] text-gray-700 rounded-lg text-[12px] font-bold hover:bg-gray-300 disabled:opacity-50"
            >
              {isProcessing ? "Đang hủy..." : "Thu hồi lời mời"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderRequestGrid = (requests, isSent) => {
    const visibleRequests =
      viewMode === "DEFAULT" ? requests.slice(0, 3) : requests;

    if (loading) {
      return <EmptyState text="Đang tải lời mời kết bạn..." />;
    }

    if (visibleRequests.length === 0) {
      return (
        <EmptyState
          text={isSent ? "Bạn chưa gửi lời mời nào." : "Không có lời mời mới."}
        />
      );
    }

    return (
      <div
        className={
          viewMode === "DEFAULT"
            ? "flex gap-4 overflow-x-auto pb-1"
            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        }
      >
        {visibleRequests.map((request) => (
          <RequestCard key={request.id} request={request} isSent={isSent} />
        ))}
      </div>
    );
  };

  const canExpandIncoming = incomingRequests.length > 3;
  const canExpandOutgoing = outgoingRequests.length > 3;

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden animate-in fade-in duration-300">
      {error && (
        <div className="rounded-[12px] bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {(viewMode === "DEFAULT" || viewMode === "ALL_INCOMING") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-50 flex flex-col overflow-hidden ${
            viewMode === "ALL_INCOMING" ? "h-full" : ""
          }`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời kết bạn ({incomingRequests.length})
          </h2>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {renderRequestGrid(incomingRequests, false)}

            {viewMode === "ALL_INCOMING" && (
              <button
                onClick={() => setViewMode("DEFAULT")}
                className="w-full mt-6 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
              >
                Rút gọn
              </button>
            )}
          </div>

          {viewMode === "DEFAULT" && canExpandIncoming && (
            <button
              onClick={() => setViewMode("ALL_INCOMING")}
              className="w-full mt-4 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
            >
              Xem tất cả
            </button>
          )}
        </div>
      )}

      {(viewMode === "DEFAULT" || viewMode === "ALL_OUTGOING") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col overflow-hidden ${
            viewMode === "ALL_OUTGOING" ? "h-full" : ""
          }`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời đã gửi ({outgoingRequests.length})
          </h2>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {renderRequestGrid(outgoingRequests, true)}

            {viewMode === "ALL_OUTGOING" && (
              <button
                onClick={() => setViewMode("DEFAULT")}
                className="w-full mt-6 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
              >
                Rút gọn
              </button>
            )}
          </div>

          {viewMode === "DEFAULT" && canExpandOutgoing && (
            <button
              onClick={() => setViewMode("ALL_OUTGOING")}
              className="w-full mt-4 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
            >
              Xem tất cả
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequestModule;
