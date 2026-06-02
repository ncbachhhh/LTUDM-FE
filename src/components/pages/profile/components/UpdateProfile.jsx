import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function UpdateProfile({ profileData, onBack, onSave }) {
  const initialData = profileData || {
    name: "",
    gender: "Nam",
    dob: "",
    phone: "",
    nickname: "",
    bio: ""
  };

  const [formData, setFormData] = useState({ ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isChanged) {
      onSave(formData);
    }
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    // KHUNG NGOÀI: ĐỒNG BỘ 100% CẤU TRÚC VỚI PROFILEPAGE (CÓ P-6, BO GÓC rounded-[24px])
    <div 
      className="relative w-full max-w-[560px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col p-6 animate-in zoom-in-95 duration-200"
      style={{ height: 560 }}
    >
      
      {/* ── HEADER GRADIENT: GIỮ NGUYÊN VUÔNG VẮN THEO LỀ TRẮNG LỌT LÒNG ── */}
      <div
        className="relative flex items-center justify-center px-6 py-5 shrink-0"
        style={{
          background: "linear-gradient(135deg, #0033FF 0%, #6366F1 100%)",
        }}
      >
        <button
          type="button"
          onClick={onBack} // Gọi callback để quay về màn hình xem Profile
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-white/60">Chat App</p>
          <h2 className="text-xl font-black text-white">Cập nhật thông tin</h2>
        </div>
      </div>

      {/* ── THÂN FORM NHẬP LIỆU CUỘN ── */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto mt-4 px-2 pb-2 space-y-4">
        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Tên hiển thị</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-[14px] bg-[#F0F4FF] px-4 py-2.5 text-[#0033FF] font-bold focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Thông tin cá nhân</label>
          <div className="flex gap-8 px-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={formData.gender === "Nam"}
                onChange={handleChange}
                className="h-4 w-4 text-[#0033FF]"
              />
              Nam
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={formData.gender === "Nữ"}
                onChange={handleChange}
                className="h-4 w-4 text-[#0033FF]"
              />
              Nữ
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full rounded-[14px] border border-gray-200 px-4 py-2 text-slate-800 font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-[14px] border border-gray-200 px-4 py-2 text-slate-800 font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Biệt danh</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full rounded-[14px] border border-gray-200 px-4 py-2 text-slate-600 font-semibold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Mô tả bản thân</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-[14px] border border-gray-200 px-4 py-2 text-slate-600 font-semibold focus:outline-none resize-none"
          />
        </div>
      </form>

      {/* ── FOOTER BUTTON NẰM TRONG LỀ TRẮNG ── */}
      <div className="border-t border-gray-100 bg-white pt-4 flex shrink-0">
        <button
          type="submit"
          disabled={!isChanged}
          onClick={handleSubmit}
          className={`w-full rounded-xl py-3 text-[15px] font-bold transition-all shadow-sm ${
            isChanged
              ? "bg-[#0033FF] text-white hover:opacity-90 active:scale-[0.99]" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed" 
          }`}
        >
          Lưu thay đổi
        </button>
      </div>

    </div>
  );
}