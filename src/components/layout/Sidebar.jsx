import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context.jsx";

export default function SideNav() {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex h-full w-20 shrink-0 flex-col items-end bg-[#0029FF] py-6">
      <div className="flex w-full flex-1 flex-col items-end gap-4">
        <div
          onClick={() => navigate("/chat")}
          className={`relative mt-2 flex w-[calc(100%-12px)] items-center justify-center cursor-pointer ${
            location.pathname === "/chat"
              ? "rounded-l-[29px] bg-[#E8EEFB] py-4"
              : "py-2 w-full opacity-80"
          }`}
        >
          {location.pathname === "/chat" && (
            <>
              <div
                className="absolute -top-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB]
              before:absolute before:inset-0 before:rounded-br-[25px] before:bg-[#0029FF] before:content-['']"
              />
              <div
                className="absolute -bottom-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB]
              before:absolute before:inset-0 before:rounded-tr-[25px] before:bg-[#0029FF] before:content-['']"
              />
            </>
          )}

          <div className="relative z-10 flex h-6 w-8 items-center justify-center">
            <img
              src="/tin-nhan-xanh.svg"
              alt="Tin nhắn"
              className="h-7 w-7 object-contain"
            />
          </div>
        </div>

        {/* NÚT DANH BẠ */}
        <div
          onClick={() => navigate("/contacts")}
          className={`relative mt-4 flex w-[calc(100%-12px)] items-center justify-center cursor-pointer ${
            location.pathname === "/contacts"
              ? "rounded-l-[29px] bg-[#E8EEFB] py-4"
              : "py-2 w-full opacity-80"
          }`}
        >
          {location.pathname === "/contacts" && (
            <>
              <div className="absolute -top-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] before:absolute before:inset-0 before:rounded-br-[25px] before:bg-[#0029FF] before:content-['']" />
              <div className="absolute -bottom-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] before:absolute before:inset-0 before:rounded-tr-[25px] before:bg-[#0029FF] before:content-['']" />
            </>
          )}
          <div className="relative z-10 flex h-7 w-7 items-center justify-center">
            <img
              src="/danh-ba.svg"
              alt="Danh bạ"
              className="h-7 w-7 object-contain"
            />
          </div>
        </div>

        {/* NÚT LƯU TRỮ */}
        <div
          onClick={() => navigate("/storages")}
          className={`relative mt-4 flex w-[calc(100%-12px)] items-center justify-center cursor-pointer ${
            location.pathname === "/storages"
              ? "rounded-l-[29px] bg-[#E8EEFB] py-4"
              : "py-2 w-full opacity-80"
          }`}
        >
          {location.pathname === "/storages" && (
            <>
              <div className="absolute -top-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] before:absolute before:inset-0 before:rounded-br-[25px] before:bg-[#0029FF] before:content-['']" />
              <div className="absolute -bottom-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] before:absolute before:inset-0 before:rounded-tr-[25px] before:bg-[#0029FF] before:content-['']" />
            </>
          )}
          <div className="relative z-10 flex h-7 w-7 items-center justify-center">
            <img
              src="/luu-tru.svg"
              alt="Lưu trữ"
              className="h-7 w-7 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-10">
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex h-8 w-8 items-center justify-center opacity-80 hover:opacity-100 transition-all active:scale-95"
          >
            <img
              src="/cai-dat.svg"
              alt="Cài đặt"
              className="h-7 w-7 object-contain"
            />
          </button>

          {/* Popup Menu Đăng xuất */}
          {showSettings && (
            <div className="absolute left-[50px] bottom-0 z-[999] w-[180px] rounded-[16px] bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={async () => {
                  await logout();
                  setShowSettings(false);
                  navigate("/"); // Điều hướng về trang chủ sau khi đăng xuất
                }}
                className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <img
          src="/avatar-mac-dinh.jpg"
          alt="Avatar người dùng"
          className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-md"
        />
      </div>
    </div>
  );
}
