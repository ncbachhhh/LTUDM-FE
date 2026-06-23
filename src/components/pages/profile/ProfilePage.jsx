import React, { useState, useEffect } from "react";
import { X, Edit, Eye, Image as ImageIcon } from "lucide-react";
import { DEFAULT_AVATAR, PROFILE_COVER } from "../../../constants/asset.constants.js";
import UpdateProfile from "./components/UpdateProfile";
import BackGround from "./components/BackGround"; 
import AvataChange from "./components/AvataChange.jsx";
import ChangeBg from "./components/ChangeBg";      
import { Modal, Image as AntdImage } from "antd";
import { useAuth } from "../../../contexts/auth.context.jsx";
import UserAPI from "../../../apis/user.api.jsx";
import FriendshipAPI from "../../../apis/friendship.api.jsx";

export default function ProfilePage({ isOpen, onClose, onOpenEdit }) {
  const { user, getProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Điều khiển menu Xem/Thay
  const [isSelectingBg, setIsSelectingBg] = useState(false); // Mở modal chọn ảnh
  const [isViewFull, setIsViewFull] = useState(false); // Xem full ảnh
  const [friendsCount, setFriendsCount] = useState(0);

  const [profile, setProfile] = useState({
    name: user?.displayName || user?.display_name || user?.username || "Người dùng",
    avatarUrl: user?.avatarUrl || user?.avatar_url || DEFAULT_AVATAR,
    bgUrl: user?.backgroundUrl || user?.background_url || PROFILE_COVER,
    gender: user?.gender || "Nam",
    dob: user?.dob || "2000-04-20", 
    phone: user?.phone || "",
    nickname: user?.nickname || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    if (!user) return undefined;

    const timerId = window.setTimeout(() => {
      setProfile({
        name: user.displayName || user.display_name || user.username || "Người dùng",
        avatarUrl: user.avatarUrl || user.avatar_url || DEFAULT_AVATAR,
        bgUrl: user.backgroundUrl || user.background_url || PROFILE_COVER,
        gender: user.gender || "Nam",
        dob: user.dob || "2000-04-20",
        phone: user.phone || "",
        nickname: user.nickname || "",
        bio: user.bio || "",
      });
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [user]);

  useEffect(() => {
    const fetchFriendsCount = async () => {
      const res = await FriendshipAPI.getFriends();
      if (res.isSuccess && Array.isArray(res.data)) {
        setFriendsCount(res.data.length);
      }
    };
    if (isOpen) {
      fetchFriendsCount();
    }
  }, [isOpen]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAvatarChange = async (localUrl, file) => {
    if (!file) return;
    setProfile((prev) => ({ ...prev, avatarUrl: localUrl }));
    const res = await UserAPI.uploadAvatar(file);
    if (res.isSuccess) {
      await getProfile();
    } else {
      console.error(res.message);
      setProfile((prev) => ({ ...prev, avatarUrl: user?.avatarUrl || user?.avatar_url || DEFAULT_AVATAR }));
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setIsEditing(false);
        onClose();
      }}
      footer={null}
      closeIcon={null}
      centered
      width={560}
      styles={{
        content: {
          borderRadius: 24,
          padding: 0,
          overflow: "hidden",
        }
      }}
    >
      <div 
        className="relative w-full flex flex-col p-6"
        style={{ height: 560 }}
      >
        {isEditing ? (
          <UpdateProfile 
            profileData={profile} 
            onBack={() => setIsEditing(false)}
            onSave={async (updatedData) => {
              const res = await UserAPI.updateProfile(updatedData);
              if (res.isSuccess) {
                await getProfile();
              } else {
                console.error(res.message);
              }
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <div
              className="relative flex items-center justify-center px-6 py-5 shrink-0 rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0033FF 0%, #6366F1 100%)" }}
            >
              <button 
                type="button" 
                onClick={onClose} 
                className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 border-none cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[3px] text-white/60">Chat App</p>
                <h2 className="text-xl font-black text-white m-0">Thông tin cá nhân</h2>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 mt-4">
              
              <div className="relative w-full cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                <BackGround bgUrl={profile.bgUrl} />
                
                {/* Menu lựa chọn hiện ra */}
                {showMenu && (
                  <div className="absolute top-16 right-4 w-48 bg-black/80 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl z-[60] border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setIsViewFull(true); setShowMenu(false); }}
                    >
                      <Eye size={18} className="text-gray-300" />
                      <span>Xem ảnh bìa</span>
                    </button>
                    
                    <div className="h-[1px] bg-white/10 my-1" />
                    
                    <button 
                      className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setIsSelectingBg(true); setShowMenu(false); }}
                    >
                      <ImageIcon size={18} className="text-gray-300" />
                      <span>Thay đổi ảnh</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Controlled Ant Design Image Preview for Cover Background */}
              <div style={{ display: "none" }}>
                <AntdImage
                  src={profile.bgUrl}
                  preview={{
                    visible: isViewFull,
                    onVisibleChange: (visible) => setIsViewFull(visible),
                  }}
                />
              </div>

              <div className="relative px-2 pb-4 pt-2 flex items-end gap-4">
                <AvataChange avatarUrl={profile.avatarUrl} onAvatarChange={handleAvatarChange} />

                <div className="mb-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-7 m-0">{profile.name}</h3>
                  <p className="text-[13px] text-gray-400 font-medium m-0">{friendsCount} Bạn bè</p>
                </div>
              </div>

              <div className="h-2 w-full bg-[#E8EEFB]/60 rounded-full my-2" />

              <div className="p-2">
                <h4 className="text-[16px] font-bold text-slate-800 mb-3 mt-0">Thông tin chi tiết</h4>
                <table className="w-full border-collapse text-[14px]">
                  <tbody>
                    <tr className="align-top">
                      <td className="w-24 py-2 text-slate-400 font-medium">Giới tính:</td>
                      <td className="py-2 text-slate-800 font-bold">{profile.gender}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="w-24 py-2 text-slate-400 font-medium">Ngày sinh:</td>
                      <td className="py-2 text-slate-800 font-bold">{formatDateDisplay(profile.dob)}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="w-24 py-2 text-slate-400 font-medium">Điện thoại:</td>
                      <td className="py-2 text-slate-800 font-bold">{profile.phone}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="w-24 py-2 text-slate-400 font-medium">Biệt danh:</td>
                      <td className="py-2 text-slate-500 font-bold tracking-wide">{profile.nickname}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="w-24 py-2 text-slate-400 font-medium">Mô tả:</td>
                      <td className="py-2 text-slate-500 font-bold tracking-wide break-all">{profile.bio}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-white pt-4 flex justify-center shrink-0">
              <button
                type="button"
                onClick={() => { setIsEditing(true); if (onOpenEdit) onOpenEdit(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[15px] font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-sm cursor-pointer bg-white"
              >
                Cập nhật
                <Edit size={16} />
              </button>
            </div>
          </>
        )}
        <ChangeBg 
          profile={profile}
          isViewFull={isViewFull}
          isSelectingBg={isSelectingBg}
          onClose={() => { setIsViewFull(false); setIsSelectingBg(false); }}
          onSelectBg={async (newBg, file) => {
            setIsSelectingBg(false);
            if (file) {
              const localUrl = URL.createObjectURL(file);
              setProfile(p => ({ ...p, bgUrl: localUrl }));

              const res = await UserAPI.uploadBackground(file);
              if (res.isSuccess) {
                await getProfile();
              } else {
                console.error(res.message);
                setProfile(p => ({ ...p, bgUrl: user?.backgroundUrl || user?.background_url || PROFILE_COVER }));
              }
            } else if (newBg) {
              setProfile(p => ({ ...p, bgUrl: newBg }));
              const res = await UserAPI.updateProfile({ backgroundUrl: newBg });
              if (res.isSuccess) {
                await getProfile();
              } else {
                console.error(res.message);
                setProfile(p => ({ ...p, bgUrl: user?.backgroundUrl || user?.background_url || PROFILE_COVER }));
              }
            }
          }}
        />
      </div>
    </Modal>
  );
}
