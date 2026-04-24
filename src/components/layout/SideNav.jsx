export default function SideNav() {
  return (
    <div className="relative flex h-full w-20 shrink-0 flex-col items-end bg-[#0029FF] py-6">
      <div className="flex w-full flex-1 flex-col items-end gap-4">
        <div className="relative mt-2 flex w-[calc(100%-12px)] items-center justify-center rounded-l-[29px] bg-[#E8EEFB] py-4">
          <div
            className="absolute -top-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB]
              before:absolute before:inset-0 before:rounded-br-[25px] before:bg-[#0029FF] before:content-['']"
          />

          <div className="relative z-10 flex h-6 w-8 items-center justify-center">
            <img
              src="/tin-nhan-xanh.svg"
              alt="Tin nhắn"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div
            className="absolute -bottom-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB]
              before:absolute before:inset-0 before:rounded-tr-[25px] before:bg-[#0029FF] before:content-['']"
          />
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center opacity-80 transition-opacity hover:opacity-100"
          >
            <img
              src="/danh-ba.svg"
              alt="Danh bạ"
              className="h-7 w-7 object-contain"
            />
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center opacity-80 transition-opacity hover:opacity-100"
          >
            <img
              src="/luu-tru.svg"
              alt="Lưu trữ"
              className="h-7 w-7 object-contain"
            />
          </button>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-10">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center opacity-80 hover:opacity-100"
        >
          <img
            src="/cai-dat.svg"
            alt="Cài đặt"
            className="h-7 w-7 object-contain"
          />
        </button>

        <img
          src="/avatar-mac-dinh.jpg"
          alt="Avatar người dùng"
          className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-md"
        />
      </div>
    </div>
  );
}
