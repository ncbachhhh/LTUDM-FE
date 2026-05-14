import React, { useState } from 'react';
import LandingView from './LandingView';
import LoginForm from './LoginForm';
import AuthBG from './AuthBG';
import RegisterForm from './RegisterForm';
import ForgetPassword from './ForgetPassword';
import VerifyOTP from './VerifyOTP';
import ResetPasswordForm from './ResetPasswordForm';

const LoginPage=()=>{
  const [View, setView]= useState('landing'); //Có 3 trạng thái trong LoginPage là 'landing'-trang chủ, 'login'- đăng nhập, 'register'- đăng ký
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  return (
    <main className="relative block w-full min-h-screen bg-black overflow-hidden px-4">
      <AuthBG View={View} />
      {View === 'landing' && <LandingView setView={setView} />}
      {View === 'login' && <LoginForm setView={setView} />}
      {View === 'register'&& <RegisterForm setView={setView} />}
      {View === 'forget'&& <ForgetPassword setView={setView} setResetEmail={setResetEmail} />}
      {View === 'verify-otp' && <VerifyOTP setView={setView} resetEmail={resetEmail} setResetToken={setResetToken} />}
      {View === 'reset-password' && <ResetPasswordForm setView={setView} resetToken={resetToken} />}
    </main>
  )
}
export default LoginPage;