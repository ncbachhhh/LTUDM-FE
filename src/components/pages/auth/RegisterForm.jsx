import React from "react";

const RegisterForm = ({ setView }) => {
    
  return (
    <section className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      
      {/* Nút Back quay lại màn hình Login  */}
      <button 
        onClick={() => setView('login')} 
        className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
      >
        &lt;
      </button>
      
      <h2 className="text-2xl font-bold text-black text-center mb-6">Đăng ký</h2>

      <form className="flex flex-col gap-4">
        {/* Tên */}
        <div>
          <label className="block text-sm font-bold text-black mb-1">Tên</label>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Họ" className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="Tên" className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block text-sm font-bold text-black mb-1">Ngày sinh</label>
          <div className="grid grid-cols-3 gap-3">
            <select className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-700 font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600">
              <option value="">Ngày</option><option value="01">01</option><option value="02">02</option>
            </select>
            <select className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-700 font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600">
              <option value="">Tháng</option><option value="01">01</option><option value="02">02</option>
            </select>
            <select className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-700 font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600">
              <option value="">Năm</option><option value="2000">2000</option><option value="2001">2001</option>
            </select>
          </div>
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm font-bold text-black mb-1">Giới tính</label>
          <select className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-700 font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600">
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-black mb-1">Email</label>
          <input type="tel" placeholder="Nhập Email" className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-bold text-black mb-1">Mật khẩu</label>
          <input 
            required 
            type="password" 
            placeholder="Tạo mật khẩu (Ít nhất 8 ký tự)" 
            className="w-full p-3 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>

        {/* Chính sách (Checkbox) */}
        <div className="flex items-start gap-2 mt-1">
          <input 
            required 
            type="checkbox" 
            id="terms" 
            className="mt-1 w-4 h-4 cursor-pointer accent-blue-600" 
          />
          <label htmlFor="terms" className="text-xs text-black font-medium cursor-pointer leading-relaxed">
            Tôi đã đọc và đồng ý với các <a href="#" className="text-blue-700 font-bold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-700 font-bold hover:underline">Chính sách bảo mật</a> của ứng dụng Chat.
          </label>
        </div>

        {/* NÚT SUBMIT ĐĂNG KÝ */}
        <button 
            onClick={() => setView('login')}
            type="submit" 
            className="w-full p-4 mt-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Tạo tài khoản
        </button>

      </form>
    </section>
  );
};

export default RegisterForm;