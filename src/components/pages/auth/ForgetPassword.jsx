import React from "react";

const ForgetPassword = ({ setView }) => {
    const handleResetPassword = (e) => {
    e.preventDefault(); 
    
    setView('verify-otp');
  };


    return (
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      
      {/* Nút Back quay lại màn hình Login */}
      <button 
        onClick={() => setView('login')} 
        className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
      >
        &lt;
      </button>
      
      <h2 className="text-2xl font-bold text-black text-center mb-2">Khôi phục mật khẩu</h2>
      
      <p className="text-center text-sm text-gray-600 font-medium mb-6 px-4">
        Vui lòng nhập Email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận (OTP) cho bạn.
      </p>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        
        <div>
          <label className="block text-sm font-bold text-black mb-1">Email</label>
          <input 
            required 
            type="tel" 
            placeholder="Nhập Email của bạn" 
            className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>
        
        {/* Nút Submit */}
        <button 
          type="submit" 
          className="w-full p-4 mt-2 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Gửi mã xác nhận
        </button>
        
      </form>

    </section>
  );
};

export default ForgetPassword;