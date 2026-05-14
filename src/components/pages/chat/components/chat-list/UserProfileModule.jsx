import React, { useState } from 'react';
import FriendshipAPI from "../../../../../apis/friendship.api.jsx";

export default function UserProfileModule({ onClose, onBack, user, onMessageClick }) {
  // Lấy trạng thái kết bạn từ api tìm kiếm user, mặc định là NONE
  const [friendshipStatus, setFriendshipStatus] = useState(user?.friendship_status || 'NONE');
  const [loading, setLoading] = useState(false);

  // Tránh render nếu không có user
  if (!user) return null;

  const handleFriendAction = async () => {
    if (friendshipStatus === 'NONE' || friendshipStatus === 'DECLINED') {
      setLoading(true);
      const res = await FriendshipAPI.sendRequest(user.id);
      setLoading(false);
      
      if (res.isSuccess) {
         setFriendshipStatus('PENDING'); // Cập nhật trạng thái thành đang chờ
      } else {
         alert(res.message);
      }
    }
  };

  const getFriendButtonLabel = () => {
     if (loading) return "Đang gửi...";
     if (friendshipStatus === 'ACCEPTED') return "Bạn bè";
     if (friendshipStatus === 'PENDING') return "Đã gửi lời mời";
     return "Kết bạn";
  }

  // Khóa nút nếu đang loading, đã là bạn bè hoặc đang chờ đồng ý
  const isFriendActionDisabled = loading || friendshipStatus === 'ACCEPTED' || friendshipStatus === 'PENDING';

  return (
    <div className="flex h-[90%] max-h-[800px] w-[60%] min-w-[500px] flex-col rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 px-8 py-6 border-b border-gray-50 bg-white z-20">
        <div className="relative flex items-center justify-center">
          <button onClick={onBack} className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-all">
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[24px] font-bold text-black">Thông tin cá nhân</h2>
          <button onClick={onClose} className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-all">
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Vùng cuộn */}
      <div className="flex-1 overflow-y-auto bg-white pr-1
        [&::-webkit-scrollbar]:w-1.5 
        [&::-webkit-scrollbar-track]:my-6 
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-300 
        [&::-webkit-scrollbar-thumb]:rounded-full">
        
        <div className="flex flex-col">
          
          {/* PHẦN TRÊN */}
          <div className="relative min-h-[450px] flex flex-col">
            {/* Ảnh bìa */}
            <div className="h-[200px] w-full overflow-hidden bg-slate-200">
              <img 
                src="https://via.placeholder.com/1200x400" 
                className="h-full w-full object-cover" 
                alt="Cover" 
              />
            </div>

            {/* Avatar & Tên */}
            <div className="px-12 -mt-10 flex items-end gap-6 text-left">
              <div className="h-32 w-32 shrink-0 rounded-full border-[5px] border-white shadow-lg overflow-hidden bg-white">
                <img src={user.avatar_url || "https://via.placeholder.com/200"} className="h-full w-full object-cover" alt="Avatar" />
              </div>
              <div className="mb-2">
                <h1 className="text-[26px] font-black text-black leading-tight">{user.display_name}</h1>
                <p className="text-[16px] font-bold text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Nút bấm */}
            <div className="mt-8 flex gap-4 px-12 pb-10">
              {friendshipStatus === 'ACCEPTED' ? (
                <>
                  <button 
                    disabled 
                    className="flex-1 rounded-[20px] bg-gray-100 text-gray-500 py-4 text-[18px] font-bold cursor-not-allowed"
                  >
                    Bạn bè
                  </button>
                  <button 
                    onClick={() => onMessageClick && onMessageClick(user.id)}
                    className="flex-1 rounded-[20px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-[#1E293B] hover:bg-[#A5B9F9] transition-all active:scale-[0.98]"
                  >
                    Nhắn tin
                  </button>
                </>
              ) : (
                <button 
                  disabled={isFriendActionDisabled} 
                  onClick={handleFriendAction} 
                  className={`w-full rounded-[20px] py-4 text-[18px] font-bold transition-all ${
                    isFriendActionDisabled 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#F3F4F1] text-black hover:bg-gray-200 active:scale-[0.98]'
                  }`}
                >
                  {getFriendButtonLabel()}
                </button>
              )}
            </div>
          </div>

          {/* Dải phân cách */}
          <div className="h-[10px] w-full bg-[#F8F9FC]"></div>

          {/* PHẦN DƯỚI: Thông tin chi tiết */}
          <div className="px-14 py-10">
            <h3 className="mb-8 text-[24px] font-bold text-black text-left">Thông tin tài khoản</h3>
            
            <div className="flex flex-col gap-6 pb-20">
               {[
                 { label: "Email:", value: user.email },
                 { label: "Tên đăng nhập:", value: user.username },
                 { label: "Mô tả:", value: "Chưa có mô tả...", isItalic: true }
               ].map((item, index) => (
                 <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-5">
                    <span className="text-[19px] font-semibold text-slate-400 italic">{item.label}</span>
                    <span className={`text-[19px] font-bold text-black ${item.isItalic ? 'italic opacity-60' : ''}`}>
                      {item.value}
                    </span>
                 </div>
               ))}
            </div>
          </div>

        </div> 
      </div>
    </div>
  );
}