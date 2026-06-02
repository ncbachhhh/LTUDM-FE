import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input, Radio, Button } from "antd";

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

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isChanged) {
      onSave(formData);
    }
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      
      {/* ── HEADER GRADIENT ── */}
      <div
        className="relative flex items-center justify-center px-6 py-5 shrink-0 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0033FF 0%, #6366F1 100%)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 border-none cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-white/60 m-0">Chat App</p>
          <h2 className="text-xl font-black text-white m-0">Cập nhật thông tin</h2>
        </div>
      </div>

      {/* ── THÂN FORM NHẬP LIỆU CUỘN ── */}
      <div className="flex-1 overflow-y-auto mt-4 px-2 pb-2 space-y-4 text-left">
        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Tên hiển thị</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-xl py-2 font-bold text-[#0033FF] bg-[#F0F4FF] hover:bg-[#F0F4FF] focus:bg-[#F0F4FF]"
            placeholder="Nhập tên hiển thị"
            required
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Giới tính</label>
          <Radio.Group 
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="flex gap-4 px-1"
          >
            <Radio value="Nam" className="font-bold text-slate-700">Nam</Radio>
            <Radio value="Nữ" className="font-bold text-slate-700">Nữ</Radio>
          </Radio.Group>
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Ngày sinh</label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            className="w-full rounded-xl py-2 text-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Điện thoại</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full rounded-xl py-2 text-slate-800 font-semibold"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Biệt danh</label>
          <Input
            value={formData.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            className="w-full rounded-xl py-2 text-slate-600 font-semibold"
            placeholder="Nhập biệt danh"
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Mô tả bản thân</label>
          <Input.TextArea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={2}
            className="w-full rounded-xl py-2 text-slate-600 font-semibold resize-none"
            placeholder="Giới thiệu bản thân..."
          />
        </div>
      </div>

      {/* ── FOOTER BUTTON NẰM TRONG LỀ TRẮNG ── */}
      <div className="border-t border-gray-100 bg-white pt-4 flex shrink-0">
        <Button
          type="primary"
          disabled={!isChanged}
          onClick={handleSubmit}
          className="w-full rounded-xl py-5 text-[15px] font-bold flex items-center justify-center"
        >
          Lưu thay đổi
        </Button>
      </div>

    </div>
  );
}