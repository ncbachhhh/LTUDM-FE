import React, { useState } from 'react';
import LandingView from './LandingView';
import LoginForm from './LoginForm';
import AuthBG from './AuthBG';
import RegisterForm from './RegisterForm';
import ForgetPassword from './ForgetPassword';
import VerifyOTP from './VerifyOTP';


const LoginPage=()=>{
  const [View, setView]= useState('landing'); //Có 3 trạng thái trong LoginPage là 'landing'-trang chủ, 'login'- đăng nhập, 'register'- đăng ký
  return (
    <main className="relative block w-full min-h-screen bg-black overflow-hidden px-4">
      <AuthBG View={View} />
      {View === 'landing' && <LandingView setView={setView} />}
      {View === 'login' && <LoginForm setView={setView} />}
      {View === 'register'&& <RegisterForm setView={setView} />}
      {View === 'forget'&& <ForgetPassword setView={setView} />}
      {View === 'verify-otp' && <VerifyOTP setView={setView} />}
    
      
    </main>
  )
}
export default LoginPage;