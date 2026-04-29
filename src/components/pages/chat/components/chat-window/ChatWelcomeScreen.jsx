import React from "react";

export default function ChatWelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Cụm Icon trung tâm */}
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Hình tròn xanh làm nền */}
        <img
          src="/hinh-tron-xanh.svg"
          className="absolute inset-0 w-full h-full object-contain"
          alt="Background circle"
        />
        {/* Icon tin nhắn trắng ở trên cùng */}
        <img
          src="/tin-nhan-white.svg"
          className="relative z-10 w-16 h-16"
          alt="Chat icon"
        />
      </div>

      {/* Phần Text */}
      <div className="mt-8 text-center">
        <h1 className="text-[32px] font-black text-[#0033FF] tracking-tight">
          Chào mừng bạn đến với Aplus!
        </h1>
        <p className="mt-2 text-[18px] font-bold text-black opacity-80">
          Chọn 1 cuộc hội thoại để bắt đầu chat
        </p>
      </div>
    </div>
  );
}
