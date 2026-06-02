import { useState } from "react";
import { Alert, Button, Empty, Spin, Tag } from "antd";
import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import FriendshipAPI from "../../../../apis/friendship.api.jsx";
import { DEFAULT_AVATAR } from "../../../../constants/asset.constants.js";

/* ── Helpers ──────────────────────────────────────── */

const getRequestUser = (request) => request?.user || {};

const getDisplayName = (user) =>
  user?.display_name || user?.displayName || user?.username || user?.email || "Người dùng";

const getAvatarUrl = (user) => user?.avatar_url || user?.avatarUrl || user?.avatar || DEFAULT_AVATAR;

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

/* ── Request Card ────────────────────────────────── */

const RequestCard = ({ request, isSent, isProcessing, onAction }) => {
  const user = getRequestUser(request);

  return (
    <div
      className={`bg-[#F8F9FC] p-5 rounded-[16px] flex items-center gap-4 shadow-sm transition-all hover:shadow-md`}
    >
      <img
        src={getAvatarUrl(user)}
        className="w-[64px] h-[64px] rounded-full object-cover border-2 border-white shadow-sm shrink-0"
        alt=""
      />

      <div className="flex flex-col flex-1 min-w-0 text-left">
        <div className="mb-2 min-w-0">
          <p className="font-bold text-[15px] text-gray-800 truncate">
            {getDisplayName(user)}
          </p>
          {user.email && (
            <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
          )}
          <Tag color="default" className="!mt-1 !text-[11px] !px-2 !border-none !bg-gray-100 !text-gray-400">
            {formatRequestTime(request)}
          </Tag>
        </div>

        {!isSent ? (
          <div className="flex gap-2 w-full">
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              loading={isProcessing}
              onClick={() => onAction(request, "ACCEPT")}
              className="flex-1 !rounded-lg !bg-[#BCCCFE] !text-[#0029FF] !border-none !font-bold !text-[12px] hover:!bg-[#a8bcfe]"
            >
              Chấp nhận
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              loading={isProcessing}
              onClick={() => onAction(request, "DECLINE")}
              className="flex-1 !rounded-lg !bg-[#EDEDEE] !text-gray-700 !border-none !font-bold !text-[12px] hover:!bg-gray-300"
            >
              Từ chối
            </Button>
          </div>
        ) : (
          <Button
            size="small"
            icon={<UndoOutlined />}
            loading={isProcessing}
            onClick={() => onAction(request, "WITHDRAW")}
            className="w-full !rounded-lg !bg-[#EDEDEE] !text-gray-700 !border-none !font-bold !text-[12px] hover:!bg-gray-300"
          >
            Thu hồi lời mời
          </Button>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────── */

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

  /* Render danh sách request dạng lưới */
  const renderRequestGrid = (requests, isSent) => {
    const visibleRequests =
      viewMode === "DEFAULT" ? requests.slice(0, 3) : requests;

    if (loading) {
      return (
        <div className="py-10 flex justify-center">
          <Spin tip="Đang tải lời mời kết bạn..." />
        </div>
      );
    }

    if (visibleRequests.length === 0) {
      return (
        <Empty
          description={isSent ? "Bạn chưa gửi lời mời nào" : "Không có lời mời mới"}
          className="!py-8"
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
          <div
            key={request.id}
            className={viewMode === "DEFAULT" ? "min-w-[320px] shrink-0" : ""}
          >
            <RequestCard
              request={request}
              isSent={isSent}
              isProcessing={processingId === request.id}
              onAction={handleRequestAction}
            />
          </div>
        ))}
      </div>
    );
  };

  const canExpandIncoming = incomingRequests.length > 3;
  const canExpandOutgoing = outgoingRequests.length > 3;

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError("")}
          className="!rounded-xl !font-semibold"
        />
      )}

      {/* ── Lời mời nhận được ── */}
      {(viewMode === "DEFAULT" || viewMode === "ALL_INCOMING") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-50 flex flex-col overflow-hidden ${
            viewMode === "ALL_INCOMING" ? "h-full" : ""
          }`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời kết bạn ({incomingRequests.length})
          </h2>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {renderRequestGrid(incomingRequests, false)}

            {viewMode === "ALL_INCOMING" && (
              <Button
                type="dashed"
                block
                onClick={() => setViewMode("DEFAULT")}
                className="!mt-5 !rounded-xl !font-bold !text-[#0029FF] !border-[#0029FF]"
              >
                Rút gọn
              </Button>
            )}
          </div>

          {viewMode === "DEFAULT" && canExpandIncoming && (
            <Button
              type="dashed"
              block
              onClick={() => setViewMode("ALL_INCOMING")}
              className="!mt-4 !rounded-xl !font-bold !text-[#0029FF] !border-[#0029FF]"
            >
              Xem tất cả
            </Button>
          )}
        </div>
      )}

      {/* ── Lời mời đã gửi ── */}
      {(viewMode === "DEFAULT" || viewMode === "ALL_OUTGOING") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col overflow-hidden ${
            viewMode === "ALL_OUTGOING" ? "h-full" : ""
          }`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời đã gửi ({outgoingRequests.length})
          </h2>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {renderRequestGrid(outgoingRequests, true)}

            {viewMode === "ALL_OUTGOING" && (
              <Button
                type="dashed"
                block
                onClick={() => setViewMode("DEFAULT")}
                className="!mt-5 !rounded-xl !font-bold !text-[#0029FF] !border-[#0029FF]"
              >
                Rút gọn
              </Button>
            )}
          </div>

          {viewMode === "DEFAULT" && canExpandOutgoing && (
            <Button
              type="dashed"
              block
              onClick={() => setViewMode("ALL_OUTGOING")}
              className="!mt-4 !rounded-xl !font-bold !text-[#0029FF] !border-[#0029FF]"
            >
              Xem tất cả
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequestModule;
