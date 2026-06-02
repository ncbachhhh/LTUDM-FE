import { useEffect, useRef, useState } from "react";
import { FaArchive, FaCog, FaRegUserCircle, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants/asset.constants.js";
import { useAuth } from "../../contexts/auth.context.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";

const navItems = [
  {
    path: "/chat",
    label: "Tin nhắn",
    Icon: BsChatDotsFill,
  },
  {
    path: "/contacts",
    label: "Danh bạ",
    Icon: FaRegUserCircle,
  },
  {
    path: "/storages",
    label: "Lưu trữ",
    Icon: FaArchive,
  },
];

const NAV_ITEM_HEIGHT = 64;
const NAV_ITEM_GAP = 16;

function ActiveCurve() {
  return (
    <>
      <div className="absolute -top-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] transition-colors duration-300 before:absolute before:inset-0 before:rounded-br-[25px] before:bg-[#0029FF] before:content-['']" />
      <div className="absolute -bottom-[25px] right-0 h-[25px] w-[25px] bg-[#E8EEFB] transition-colors duration-300 before:absolute before:inset-0 before:rounded-tr-[25px] before:bg-[#0029FF] before:content-['']" />
    </>
  );
}

function ActiveIndicator({ index }) {
  if (index < 0) return null;

  return (
    <div
      className="absolute right-0 top-0 h-16 w-[calc(100%-12px)] rounded-l-[29px] bg-[#E8EEFB] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transform: `translateY(${index * (NAV_ITEM_HEIGHT + NAV_ITEM_GAP)}px)`,
      }}
    >
      <ActiveCurve />
    </div>
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.label}
      className={`relative z-10 flex h-16 w-[calc(100%-12px)] items-center justify-center rounded-l-[29px] transition-opacity duration-300 ease-out ${
        active ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
    >
      <Icon
        className={`relative z-10 h-7 w-7 transition-[color,transform] duration-300 ease-out ${
          active ? "text-[#0029FF]" : "text-white"
        }`}
      />
    </button>
  );
}

export default function SideNav() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);
  const isSettingsActive = location.pathname === "/settings";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative flex h-full w-20 shrink-0 flex-col items-end bg-[#0029FF] py-6">
        {/* Khu vực 3 nút chính phía trên */}
        <div className="relative flex w-full flex-1 flex-col items-end gap-4">
          <ActiveIndicator index={activeIndex} />

          {navItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* Khu vực Đáy: Giữ nguyên gap-10 chuẩn chỉnh của bạn */}
        <div className="mt-8 flex w-full flex-col items-center gap-10" ref={profileRef}>
          
          {/* Nút Cài đặt: Giữ nguyên h-8 w-8 tuyệt đối */}
          <div className="relative flex h-8 w-full items-center justify-center">
            {/* Vùng thụt lề nền trượt mượt mà cho Cài đặt ăn khớp sang mép phải */}
            {isSettingsActive && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-[calc(100%-12px)] rounded-l-[29px] bg-[#E8EEFB] z-0 animate-in fade-in duration-200">
                <ActiveCurve />
              </div>
            )}
            
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false); // Đóng menu avatar nếu đang mở
                navigate("/settings");
              }}
              className={`relative z-10 flex h-8 w-8 items-center justify-center transition-all active:scale-95 ${
                isSettingsActive ? "text-[#0029FF] opacity-100" : "text-white opacity-80 hover:opacity-100"
              }`}
              aria-label="Cài đặt"
            >
              <FaCog className="h-7 w-7" />
            </button>
          </div>

          {/* Avatar người dùng giữ nguyên */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 object-cover shadow-md transition-all hover:scale-105 active:scale-95"
              aria-label="Menu tài khoản"
            >
              <img
                src={user?.avatarUrl || user?.avatar_url || DEFAULT_AVATAR}
                alt="Avatar người dùng"
                className="h-full w-full rounded-full object-cover"
              />
            </button>

            {/* Menu Popup chuẩn tỷ lệ w-210px của bạn */}
            {showProfileMenu && (
              <div className="absolute bottom-2 left-[55px] z-[999] w-[210px] rounded-[16px] border border-gray-100 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsProfileOpen(true); // Mở Modal Profile lớp phủ anime
                  }}
                  className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaUserAlt className="h-4 w-4 text-gray-500" />
                  Tài khoản
                </button>
                
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setShowProfileMenu(false);
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] font-bold text-red-500 transition-colors hover:bg-red-50"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lớp phủ thông tin cá nhân dạng Modal hoành tráng */}
      <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}