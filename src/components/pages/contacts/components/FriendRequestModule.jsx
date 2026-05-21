import React, { useState } from "react";

const FriendRequestModule = () => {
  const [viewMode, setViewMode] = useState("DEFAULT");

  const receivedData = Array(12).fill({
    name: "Đỗ Minh Vương",
    avatar: "/anh-avata.svg",
    time: "Đã gửi từ 1h trước",
  });
  const sentData = Array(6).fill({
    name: "Đỗ Minh Vương",
    avatar: "/anh-avata.svg",
    time: "Đã gửi từ 1h trước",
  });

  const RequestCard = ({ isSent }) => (
    <div
      className={`bg-[#F1F3F7] p-11 rounded-[16px] flex items-center gap-2 shadow-sm ${viewMode === "DEFAULT" ? "min-w-[330px]" : "w-full"}`}
    >
      <div className="shrink-0">
        <img
          src="/anh-avata.svg"
          className="w-[74px] h-[74px] rounded-full object-cover border-2 border-white shadow-sm"
          alt=""
        />
      </div>

      <div className="flex flex-col flex-2 min-w-0 text-left px-1">
        <div className="flex flex-col mb-2">
          <span className="font-bold text-[16px] text-gray-800 truncate">
            Đỗ Minh Vương
          </span>
          <span className="text-[11px] text-gray-400 italic">
            Đã gửi từ 1h trước
          </span>
        </div>

        <div className="flex gap-2 w-full">
          {!isSent ? (
            <>
              <button className="flex-3 py-1.5 bg-[#BCCCFE] text-[#0029FF] rounded-lg text-[11px] font-bold hover:bg-blue-300">
                Xác nhận
              </button>
              <button className="flex-3 py-1.5 bg-[#D9D9D9] text-gray-700 rounded-lg text-[11px] font-bold hover:bg-gray-300">
                Xóa
              </button>
            </>
          ) : (
            <button className="w-full py-1.5 bg-[#D9D9D9] text-gray-700 rounded-lg text-[11px] font-bold">
              Thu hồi lời mời
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden animate-in fade-in duration-300">
      {/* KHỐI 1: LỜI MỜI NHẬN */}
      {(viewMode === "DEFAULT" || viewMode === "ALL_RECEIVED") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-50 flex flex-col overflow-hidden ${viewMode === "ALL_RECEIVED" ? "h-full" : ""}`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời kết bạn
          </h2>

          <div className={`flex-1 overflow-y-auto no-scrollbar`}>
            <div
              className={`${viewMode === "ALL_RECEIVED" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex gap-4"}`}
            >
              {(viewMode === "ALL_RECEIVED"
                ? receivedData
                : receivedData.slice(0, 3)
              ).map((_, i) => (
                <RequestCard key={i} isSent={false} />
              ))}
            </div>

            {viewMode === "ALL_RECEIVED" && (
              <button
                onClick={() => setViewMode("DEFAULT")}
                className="w-full mt-6 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
              >
                Rút gọn
              </button>
            )}
          </div>

          {viewMode === "DEFAULT" && (
            <button
              onClick={() => setViewMode("ALL_RECEIVED")}
              className="w-full mt-4 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
            >
              Xem tất cả
            </button>
          )}
        </div>
      )}

      {/* KHỐI 2: LỜI MỜI GỬI */}
      {(viewMode === "DEFAULT" || viewMode === "ALL_SENT") && (
        <div
          className={`bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col overflow-hidden ${viewMode === "ALL_SENT" ? "h-full" : ""}`}
        >
          <h2 className="font-bold text-[17px] mb-4 text-left">
            Lời mời đã gửi
          </h2>

          <div className={`flex-1 overflow-y-auto no-scrollbar`}>
            <div
              className={`${viewMode === "ALL_SENT" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex gap-4"}`}
            >
              {(viewMode === "ALL_SENT" ? sentData : sentData.slice(0, 3)).map(
                (_, i) => (
                  <RequestCard key={i} isSent={true} />
                ),
              )}
            </div>

            {viewMode === "ALL_SENT" && (
              <button
                onClick={() => setViewMode("DEFAULT")}
                className="w-full mt-6 py-2.5 border-[1.5px] border-[#0029FF] text-[#0029FF] rounded-[12px] font-bold text-[14px] hover:bg-blue-50"
              >
                Rút gọn
              </button>
            )}
          </div>

          {viewMode === "DEFAULT" && (
            <button
              onClick={() => setViewMode("ALL_SENT")}
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
