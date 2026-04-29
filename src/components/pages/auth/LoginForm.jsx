import React from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setView }) => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault(); 
    
        navigate('/chat');
  };
  return (
    <section className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-[600px] bg-[#E3E6EB] rounded-[30px] p-8 shadow-2xl">
      
      {/* Nút quay lại màn hình chính */}
      <button 
        onClick={() => setView('landing')} 
        className="absolute top-6 left-6 text-xl font-black text-black hover:text-gray-600 transition-colors"
      >
        &lt;
      </button>
      
      <h2 className="text-2xl font-bold text-black text-center mb-6">Đăng nhập</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Nhập Email" 
          className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" 
        />
        <input 
          type="password" 
          placeholder="Nhập mật khẩu" 
          className="w-full p-4 rounded-xl bg-[#C7D2FE] text-blue-900 font-semibold placeholder-blue-500/70 outline-none focus:ring-2 focus:ring-blue-600" 
        />
        
        {/* Nút Submit Đăng nhập */}
        <button 
          type="submit" 
          className="w-full p-4 mt-2 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Đăng nhập
        </button>
      </form>

      {/* Nút chuyển sang Quên mật khẩu */}
      <button 
        onClick={() => setView('forget')}
        className="text-center text-sm font-bold text-black mt-4 mb-6 cursor-pointer hover:underline">
        Quên mật khẩu ?
      </button>

      {/* Nút chuyển sang form Đăng ký */}
      <button 
        onClick={() => setView('register')} 
        className="w-full p-4 rounded-xl border border-blue-600 text-blue-800 font-bold hover:bg-blue-100 transition-colors"
      >
        Đăng ký tài khoản mới
      </button>
    </section>
  );
};

export default LoginForm;