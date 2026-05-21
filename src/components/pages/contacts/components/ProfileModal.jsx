import React from "react";
import { X, ChevronLeft, Phone, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ user, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative h-40 bg-gradient-to-tr from-blue-600 to-indigo-400">
          <img
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
            alt=""
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute -bottom-12 left-8">
            <img
              src={user?.avatar}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              alt=""
            />
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500 text-sm mb-6">12 Bạn bè chung</p>

          <div className="flex gap-3 mb-8">
            <button className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors">
              Bạn bè
            </button>
            <button
              onClick={() => navigate(`/chat?userId=${user.id}`)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-colors shadow-lg shadow-blue-200"
            >
              Nhắn tin
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <UserCircle size={20} /> Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-3 gap-y-3 text-[15px]">
              <span className="text-gray-400">Giới tính:</span>{" "}
              <span className="col-span-2 font-medium">{user?.gender}</span>
              <span className="text-gray-400">Ngày sinh:</span>{" "}
              <span className="col-span-2 font-medium">{user?.dob}</span>
              <span className="text-gray-400">Điện thoại:</span>{" "}
              <span className="col-span-2 font-medium">{user?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
