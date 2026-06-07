import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const LandingView = ({ setView }) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden px-4">
      {/* KHỐI STYLE ĐƯỢC THIẾT KẾ RIÊNG:
        Ép cứng translateX(-50%) trực tiếp vào keyframes của các khối dùng left-1/2 để KHÔNG BỊ LỆCH LAYOUT.
      */}
<style>{`
        /* --- BƯỚC 1: Các khối tròn lớn xuất hiện (0s -> 1s) --- */
        @keyframes animStep1Top {
          0% { margin-top: -150px; opacity: 0; }
          100% { margin-top: 0px; opacity: 1; }
        }
        @keyframes animStep1Bottom {
          0% { margin-top: 150px; opacity: 0; }
          100% { margin-top: 0px; opacity: 1; }
        }

        /* --- BƯỚC 2: Khối cầu Chat dịch lên & Dòng chữ lớn hiện ra (1s -> 1.8s) --- */
        @keyframes animStep2Chat {
          0% { margin-top: 100px; opacity: 0; }
          100% { margin-top: 0px; opacity: 1; }
        }
        @keyframes animStep2Title {
          0% { opacity: 0; margin-top: 20px; }
          100% { opacity: 1; margin-top: 0px; }
        }

        /* --- BƯỚC 3: Header trượt từ phải vào & Text nhỏ chạy hiệu ứng quét chữ (1.8s -> 3.3s) --- */
        @keyframes animStep3Header {
          0% { right: -100px; opacity: 0; }
          100% { right: 32px; opacity: 1; }
        }
        @keyframes animStep3Subtitle {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          1% { opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }

        /* Classes gán đồng bộ timeline, giữ nguyên thuộc tính vị trí gốc của sếp */
        .anim-step1-top { animation: animStep1Top 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .anim-step1-bottom { animation: animStep1Bottom 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        
        .anim-step2-chat { opacity: 0; animation: animStep2Chat 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards; transition: all 0.4s ease; }
        .anim-step2-title { opacity: 0; animation: animStep2Title 0.8s ease-out 1s forwards; }
        
        .anim-step3-header { opacity: 0; animation: animStep3Header 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.8s forwards; }
        
        /* FIX LỖI MẤT CHỮ: Ép giải phóng hoàn toàn clip-path và giữ nguyên opacity khi kết thúc */
        .anim-step3-subtitle { 
          opacity: 0; 
          animation: animStep3Subtitle 1.5s steps(60, end) 1.8s forwards; 
        }

        /* --- HIỆU ỨNG HOVER ĐẶC BIỆT CHO QUẢ CẦU CHAT --- */
        .anim-step2-chat:hover {
          cursor: pointer;
          filter: saturate(1.3) brightness(1.15);
        }
        /* Phóng to nhẹ lõi quả cầu và tăng bóng đổ phản chiếu */
        .anim-step2-chat:hover img {
          transform: scale(1.06);
          filter: drop-shadow(0 0 25px rgba(0, 51, 255, 0.75));
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .anim-step2-chat img { transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }

        /* Đổi chữ "Chat" sang màu xanh Cyan neon phát sáng rực rỡ */
        .anim-step2-chat:hover .ant-typography {
          color: #26e6e6 !important;
          opacity: 0.95 !important;
          text-shadow: 0 0 10px rgba(38, 230, 230, 0.8), 0 0 20px rgba(0, 51, 255, 0.5);
          transform: scale(1.03);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .anim-step2-chat .ant-typography { transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
      `}</style>

      {/* Header - Nút đăng nhập/đăng ký trượt mượt vào vị trí tĩnh ở góc phải */}
      <header className="absolute top-6 right-8 z-50 flex gap-4 anim-step3-header">
        <button
          onClick={() => setView("login")}
          className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-all"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setView("register")}
          className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all"
        >
          Đăng ký
        </button>
      </header>

      {/* Dòng chữ lớn hiện mờ dần ở Bước 2 */}
      <div className="absolute top-[15%] z-30 anim-step2-title">
        <Title 
          level={2}
          className="
            !text-4xl
            !text-center
            !font-bold
            !text-white/90 !tracking-wider
            drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
            !mb-0
          "
        >
          Nhắn là tới<br />
          Kết nối không chờ đợi
        </Title>
      </div>

      {/* Dòng chữ nhỏ chạy hiệu ứng đánh máy ở Bước 3 */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30 anim-step3-subtitle">
        <Title 
          level={3}
          className="
            !text-base
            !text-center
            !text-white/90 !tracking-wider
            drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
            !font-normal
            !mb-0
          "
        >
          Ứng dụng chat realtime là nền tảng giao tiếp hiện đại, cho phép người dùng kết nối và trao đổi thông tin tức thì với độ trễ tối thiểu.
        </Title>
      </div>

      {/* Khối tròn lớn trên 1 - Bước 1 */}
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
          anim-step1-top
        "
      />

      {/* Khối tròn lớn trên 2 - Bước 1 */}
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
          anim-step1-top
        "
      />

      {/* Khối tròn dưới (Blur) từ dưới lên - Bước 1 */}
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
          anim-step1-bottom
        "
      />

      {/* Khối tròn chữ Chat từ dưới trồi lên mượt mà - Bước 2 */}
      <div
        className="
          absolute
          w-[300px] h-[300px]
          left-1/2 -translate-x-1/2
          top-[325px]
          z-20
          anim-step2-chat
        "
      >
        <img
          src="/planet-glass.png"
          alt="Crystal Sphere"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <Title
            level={2}
            className="
              !text-5xl
              !font-bold
              !text-white/40 !tracking-wider
              drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]
              !mb-0
            "
          >
            Chat
          </Title>
        </div>
      </div>
    </main>
  );
};

export default LandingView;