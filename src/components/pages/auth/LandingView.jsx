import React from "react";

const LandingView = ({ setView }) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden px-4">
      <header className="absolute top-6 right-8 z-50 flex gap-4">
        <button onClick={() => setView("login")} className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-all">
          Đăng nhập
        </button>
        <button onClick={() => setView("register")} className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all">
          Đăng ký
        </button>
      </header>

      <div className="absolute top-[15%] z-30">
        <h2 className="
          text-4xl
          text-center
          font-bold
          text-white/90 tracking-wider
          drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
        ">
          Nhắn là tới<br />
          Kết nối không chờ đợi
        </h2>
      </div>

      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
        <h3 className="
          text-base
          text-center
          text-white/90 tracking-wider
          drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
        ">
          Ứng dụng chat realtime là nền tảng giao tiếp hiện đại, cho phép người dùng kết nối và trao đổi thông tin tức thì với độ trễ tối thiểu.
        </h3>
      </div>

      <div
        className="
          absolute
          w-[1800px] h-[1800px]
          left-1/2 -translate-x-1/2
          top-[-1290px]
          rounded-full pointer-events-none z-0
          bg-[#000000]
          border-[1px] border-[#000000]
          shadow-[inset_0px_-25px_250px_#0033FF,inset_0px_-25px_94px_rgba(0,51,255,0.4),inset_0px_-25px_20px_#FFFFFF]
        "
      />

      <div
        className="
          absolute
          w-[1800px] h-[1800px]
          left-1/2 -translate-x-1/2
          top-[-1375px]
          rounded-full pointer-events-none z-10
          bg-[#000000]
          border-[1px] border-[#000000]
          shadow-[inset_0px_-6px_250px_#0033FF,inset_0px_-6px_94px_rgba(0,51,255,0.4),inset_0px_-8px_34px_rgba(255,255,255,0.65)]
        "
      />

      <div
        className="
          absolute
          w-[1800px] h-[1800px]
          left-1/2 -translate-x-1/2
          top-[565px]
          rounded-full pointer-events-none z-0
          bg-[#000000]
          border-[1px] border-[#000000]
          blur-[17.5px]
          shadow-[inset_0px_-25px_250px_#0033FF,inset_0px_-25px_94px_rgba(0,51,255,0.4),inset_0px_-25px_20px_#FFFFFF]
        "
      />

      <div
        className="
          absolute
          w-[300px] h-[300px]
          left-1/2 -translate-x-1/2
          top-[325px]
          z-20
        "
      >
        <img
          src="/planet-glass.png"
          alt="Crystal Sphere"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <h2
            className="
              text-5xl
              font-bold
              text-white/40 tracking-wider
              drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
            "
          >
            Chat
          </h2>
        </div>
      </div>
    </main>
  );
};

export default LandingView;
