import StatCard from "./StatCard.jsx";
import { activeConversation } from "../../helpers/chatData.js";

export default function InfoPanel() {
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto py-4 pr-2">
      <div className="flex w-full flex-col items-center rounded-[10px] bg-white p-8 text-center shadow-sm">
        <div className="relative mb-4">
          <img
            src={activeConversation.avatar}
            className="h-22 w-22 rounded-full border-4 border-white object-cover shadow-md"
            alt={activeConversation.name}
          />
          <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[4px] border-white bg-emerald-400" />
        </div>

        <h3 className="text-lg font-black">{activeConversation.name}</h3>
        <p className="text-[12px] font-bold text-gray-400">{activeConversation.status}</p>
      </div>

      <div className="flex min-h-[118px] w-full items-center justify-center rounded-[10px] bg-white p-4 shadow-sm">
        <div className="grid w-full grid-cols-3 gap-2">
          <ActionBtn label="Tạo nhóm">
            <img
              src="/icon-tao-nhom.svg"
              alt="Nút tạo nhóm"
              className="h-6 w-6"
            />
          </ActionBtn>

          <ActionBtn label="Thông báo">
            <img
              src="/icon-chuong.svg"
              alt="Nút thông báo"
              className="h-6 w-6"
            />
          </ActionBtn>

          <ActionBtn label="Tìm kiếm">
            <img
              src="/kinh-lup.svg"
              alt="Tìm kiếm"
              className="h-6 w-6 opacity-60"
            />
          </ActionBtn>
        </div>
      </div>

      <div className="w-full rounded-[10px] bg-white p-6 shadow-sm">
        <h4 className="mb-5 text-sm font-black uppercase tracking-wide">Thống kê</h4>
        <div className="grid grid-cols-2 gap-3">
          {activeConversation.stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              subValue={stat.subValue}
            />
          ))}
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-2xl bg-[#0033FF]/5 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-500"
        >
          Xem tất cả
        </button>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-[10px] bg-white p-6 shadow-sm">
        <h4 className="mb-1 text-sm font-black uppercase tracking-wide">Cài đặt</h4>
        {activeConversation.settings.map((setting) => (
          <button
            key={setting}
            type="button"
            className="cursor-pointer rounded-2xl bg-[#F6F8FF] p-4 text-left text-[12px] font-bold text-slate-700"
          >
            {setting}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionBtn({ label, children }) {
  return (
    <button
      type="button"
      className="flex min-h-[70px] w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#003EFF]/40 to-[#FFCCF2]/40 p-3 transition-all duration-300 hover:opacity-80"
    >
      <div className="mb-1">{children}</div>
      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-800">
        {label}
      </span>
    </button>
  );
}
