import React, { useState } from 'react';
import UserAPI from "../../../../../apis/user.api.jsx";

export default function AddFriendModule({ onClose, onSearchSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!email.trim() || loading) return;
    setLoading(true);
    const res = await UserAPI.searchByEmail(email.trim());
    setLoading(false);
    
    if (res.isSuccess) {
      setError(false);
      onSearchSuccess(res.data);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex h-[90%] max-h-[800px] w-[60%] min-w-[500px] flex-col rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
      <div className="shrink-0 px-8 py-6 border-b border-gray-50">
        <div className="relative flex items-center justify-center">
          <h2 className="text-[24px] font-bold text-black">Thêm bạn</h2>
          <button onClick={onClose} className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-all">
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        {/* Input Container */}
        <div className={`mb-4 flex items-center gap-4 rounded-[20px] px-5 py-4 border-2 transition-all ${
          error ? 'bg-red-50 border-red-400' : 'bg-[#E0E7FF] border-transparent'
        }`}>
          <svg className={`h-7 w-7 shrink-0 ${error ? 'text-red-500' : 'text-[#4F46E5]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input 
            type="text" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Nhập email tài khoản" 
            /* 
              - !bg-transparent: Ép trong suốt tuyệt đối.
              - appearance-none: Xóa style mặc định hệ thống.
              - autofill:... : Chặn màu nền vàng/trắng khi trình duyệt tự gợi ý email.
            */
            className="w-full !bg-transparent text-[18px] font-semibold outline-none border-none p-0 placeholder:text-[#818CF8] focus:ring-0 shadow-none appearance-none
                       autofill:bg-transparent autofill:text-[#4F46E5] [transition:background-color_9999s_ease-in-out_0s]"
          />
        </div>

        {error && (
          <p className="mb-6 px-4 text-[16px] font-bold text-red-500 animate-pulse">
            ⚠️ Tài khoản không tồn tại!
          </p>
        )}

        <h3 className="mb-4 text-[18px] font-bold text-black">Lịch sử tìm kiếm</h3>
        <div className="space-y-4">
          {[1].map((item) => (
            <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-[20px] transition-all cursor-pointer">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                 <img src="https://via.placeholder.com/150" alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-black">Đỗ Minh Vương</p>
                <p className="text-[14px] text-gray-400 font-bold italic">vuong@gmail.com</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex gap-5 px-8 py-6 border-t border-gray-100">
        <button onClick={onClose} className="flex-1 rounded-[20px] bg-[#F3F4F1] py-4 text-[18px] font-bold text-black hover:bg-gray-200 transition-all">
          Hủy
        </button>
        <button disabled={loading} onClick={handleSearch} className="flex-1 rounded-[20px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-[#1E293B] hover:bg-[#A5B9F9] transition-all disabled:opacity-50">
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>
    </div>
  );
}