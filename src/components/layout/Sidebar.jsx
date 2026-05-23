import { useEffect, useRef, useState } from "react";
import { FaArchive, FaCog, FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants/asset.constants.js";
import { useAuth } from "../../contexts/auth.context.jsx";

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
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const activeIndex = Math.max(
    navItems.findIndex((item) => item.path === location.pathname),
    0
  );

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

      <div className="mt-8 flex w-full flex-col items-center gap-10">
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex h-8 w-8 items-center justify-center text-white opacity-80 transition-all hover:opacity-100 active:scale-95"
            aria-label="Cài đặt"
          >
            <FaCog className="h-7 w-7" />
          </button>

          {showSettings && (
            <div className="absolute bottom-0 left-[50px] z-[999] w-[180px] rounded-[16px] border border-gray-50 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setShowSettings(false);
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] font-bold text-red-500 transition-colors hover:bg-red-50"
              >
                <FaSignOutAlt className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <img
          src={DEFAULT_AVATAR}
          alt="Avatar người dùng"
          className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-md"
        />
      </div>
    </div>
  );
}
