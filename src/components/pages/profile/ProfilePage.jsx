import React, { useRef, useState } from "react";
import { X, Edit, Eye, Image } from "lucide-react";
import { DEFAULT_AVATAR } from "../../../constants/asset.constants.js";
import UpdateProfile from "./components/UpdateProfile";
import BackGround from "./components/BackGround"; 
import AvataChange from "./components/AvataChange.jsx";
import ChangeBg from "./components/ChangeBg";      

export default function ProfilePage({ isOpen, onClose, profileData, onOpenEdit, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Điều khiển menu Xem/Thay
  const [isSelectingBg, setIsSelectingBg] = useState(false); // Mở modal chọn ảnh
  const [isViewFull, setIsViewFull] = useState(false); // Xem full ảnh

  const [profile, setProfile] = useState(profileData || {
    name: "Nguyễn Quốc Cường",
    avatarUrl: DEFAULT_AVATAR,
    bgUrl: "/bg4.png",
    gender: "Nam",
    dob: "2000-04-20", 
    phone: "0123456789",
    nickname: "xxxxxxxxxx",
    bio: "xxxxxxxxxx",
    friendsCount: 12,
  });

  if (!isOpen) return null;

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAvatarChange = (localUrl) => {
    setProfile((prev) => ({ ...prev, avatarUrl: localUrl }));
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <UpdateProfile 
          profileData={profile} 
          onBack={() => setIsEditing(false)}
          onSave={(updatedData) => {
            const mergedData = { ...profile, ...updatedData };
            setProfile(mergedData);
            if (onSave) onSave(mergedData);
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[560px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200 flex flex-col p-6"
        style={{ height: 560 }}
      >
        
        <div
          className="relative flex items-center justify-center px-6 py-5 shrink-0"
          style={{ background: "linear-gradient(135deg, #0033FF 0%, #6366F1 100%)" }}
        >
          <button type="button" onClick={onClose} className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
            <X size={18} />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-white/60">Chat App</p>
            <h2 className="text-xl font-black text-white">Thông tin cá nhân</h2>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 mt-4">
          
          <div className="relative w-full cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
          <BackGround bgUrl={profile.bgUrl} />
          
          {/* Menu lựa chọn hiện ra */}
          {showMenu && (
              <div className="absolute top-16 right-4 w-48 bg-black/80 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl z-[60] border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all"
                    onClick={(e) => { e.stopPropagation(); setIsViewFull(true); setShowMenu(false); }}
                  >
                    <Eye size={18} className="text-gray-300" />
                    <span>Xem ảnh bìa</span>
                  </button>
                  
                  <div className="h-[1px] bg-white/10 my-1" />
                  
                  <button 
                    className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all"
                    onClick={(e) => { e.stopPropagation(); setIsSelectingBg(true); setShowMenu(false); }}
                  >
                    <Image size={18} className="text-gray-300" />
                    <span>Thay đổi ảnh</span>
                  </button>
                </div>
          )}
        </div>

          <div className="relative px-2 pb-4 pt-2 flex items-end gap-4">
            {/* Đã sửa tên component ở đây thành AvataChange */}
            <AvataChange avatarUrl={profile.avatarUrl} onAvatarChange={handleAvatarChange} />

            <div className="mb-1">
              <h3 className="text-lg font-bold text-gray-900 leading-7">{profile.name}</h3>
              <p className="text-[13px] text-gray-400 font-medium">{profile.friendsCount} Bạn bè</p>
            </div>
          </div>

          <div className="h-2 w-full bg-[#E8EEFB]/60 rounded-full my-2" />

          <div className="p-2">
            <h4 className="text-[16px] font-bold text-slate-800 mb-3">Thông tin chi tiết</h4>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[15px] font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            Cập nhật
            <Edit size={16} />
          </button>
        </div>
        <ChangeBg 
          profile={profile}
          isViewFull={isViewFull}
          isSelectingBg={isSelectingBg}
          onClose={() => { setIsViewFull(false); setIsSelectingBg(false); }}
          onSelectBg={(newBg) => {
            setProfile(p => ({ ...p, bgUrl: newBg }));
            setIsSelectingBg(false);
          }}
        />
      </div>
    </div>
  );
}