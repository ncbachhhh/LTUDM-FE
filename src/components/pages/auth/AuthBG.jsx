import React from "react"

const AuthBG = ({View})=>{
    if (View === 'landing') {
        return null; 
    }
    return(
        <>
        {/* Khối Style quản lý Timeline 3 bước chuẩn chỉ: BG chạy -> Chiếu đèn -> Form tự rõ dần tại vị trí gốc */}
        <style>{`
            /* ==========================================================================
               BƯỚC 1: Cả 3 vòng lướt từ dưới lên, tụ tại điểm vòng bé nhất (top-[55%]), khựng lại.
               Sau đó vòng 1 (to nhất) lùi về mốc 70% trước, rồi vòng 2 (vừa) lùi về mốc 60% sau.
               (Chạy từ 0s -> 3.3s)
               ========================================================================== */
            @keyframes authVortex3Move {
                0% { margin-top: 500px; opacity: 0; }
                40% { margin-top: 0px; opacity: 1; }
                100% { margin-top: 0px; opacity: 1; }
            }
            @keyframes authVortex2Move {
                0% { margin-top: 500px; opacity: 0; }
                40% { margin-top: -40px; opacity: 1; }  /* Lao lên tụ cùng vị trí vòng bé nhất */
                70% { margin-top: -40px; opacity: 1; }  /* Khựng lại giữ nhịp */
                100% { margin-top: 0px; opacity: 1; }   /* Lùi về đúng vị trí gốc ban đầu */
            }
            @keyframes authVortex1Move {
                0% { margin-top: 500px; opacity: 0; }
                40% { margin-top: -110px; opacity: 0.5; } /* Lao lên tụ cùng vị trí vòng bé nhất */
                55% { margin-top: -110px; opacity: 0.5; } /* Khựng lại nhịp ngắn hơn */
                85% { margin-top: 0px; opacity: 0.5; }     /* Chủ động lùi về vị trí gốc trước vòng 2 */
                100% { margin-top: 0px; opacity: 0.5; }
            }

            /* ==========================================================================
               BƯỚC 2: Dải đèn màu xanh Subtract dần rực sáng lên tại đúng vị trí top-[40%]
               (Bắt đầu chạy từ giây thứ 3.3s và kết thúc rực sáng ở giây thứ 4.5s)
               ========================================================================== */
            @keyframes authSubtractGlow {
                0% { opacity: 0; filter: brightness(0) blur(10px); }
                100% { opacity: 0.9; filter: brightness(1) blur(0); }
            }

            /* ==========================================================================
               BƯỚC 3: SAU KHI MÀU XANH HIỆN HẾT (Từ giây thứ 4.5s trở đi), 
               Form đăng ký/đăng nhập mới từ từ rõ dần lên (Fade In).
               GIỮ NGUYÊN 100% LAYOUT GỐC, KHÔNG ĐỔI CSS VỊ TRÍ CỦA SẾP.
               ========================================================================== */
            @keyframes authFormFadeIn {
                0% { opacity: 0; filter: blur(4px); }
                100% { opacity: 1; filter: blur(0); }
            }

            /* Mở lại tương tác chuột (click, gõ chữ) ngay khi Form đã hiện lên rõ hoàn toàn */
            @keyframes authEnableClicks {
                to { pointer-events: auto !important; }
            }

            /* Gán hiệu ứng chuyển động vào các khối nền */
            .anim-auth-vortex-1 { animation: authVortex1Move 3.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
            .anim-auth-vortex-2 { animation: authVortex2Move 3.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
            .anim-auth-vortex-3 { animation: authVortex3Move 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
            .anim-auth-subtract { animation: authSubtractGlow 1.2s cubic-bezier(0.25, 1, 0.5, 1) 3.3s forwards; }

            /* SELECTOR ĐỈNH CAO: Tóm các component Form nằm cùng cấp trong <main> của LoginPage.
               - Mới đầu vào ép ẩn hoàn toàn (opacity: 0) và khóa tương tác chuột.
               - Đúng đến giây thứ 4.5 (Khi dải màu xanh đã hiện xong xuôi), Form mới từ từ rõ dần lên tại vị trí gốc.
               - Đến giây thứ 5.5, mở lại chuột để sếp click nhập liệu bình thường. */
            main > div:not(.pointer-events-none),
            main > form {
                opacity: 0 !important;
                pointer-events: none !important;
                animation: authFormFadeIn 1s cubic-bezier(0.25, 1, 0.5, 1) 4.5s forwards !important,
                           authEnableClicks 0s linear 5.5s forwards !important;
            }
        `}</style>

        {/* Vòng 1 (To nhất, h-[500px], z-10) - Giữ nguyên 100% class gốc */}
        <div className="absolute top-[70%] bottom-[0px] left-1/2 -translate-x-1/2 w-full h-[500px] z-10 pointer-events-none anim-auth-vortex-1">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-50" 
          />
        </div>

        {/* Vòng 2 (Vừa, w-[600px], z-20) - Giữ nguyên 100% class gốc */}
        <div className="absolute top-[60%] bottom-[0px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] z-20 pointer-events-none anim-auth-vortex-2">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-70" 
          />
        </div>

        {/* Vòng 3 (Bé nhất, cao nhất, w-[400px], z-30) - Giữ nguyên 100% class gốc */}
        <div className="absolute top-[55%] bottom-[0px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] z-30 pointer-events-none anim-auth-vortex-3">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-100" 
          />
        </div>

        {/* Dải đèn chiếu sáng Subtract.png (w-[400px] h-[400px] top-[40%]) - Giữ nguyên 100% class gốc */}
        <div className="absolute top-[40%] bottom-[0px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] z-0 pointer-events-none opacity-0 anim-auth-subtract">
          <img 
            src="/Subtract.png" 
         alt="Subtract Background" 
            className="w-full h-full object-cover mix-blend-screen opacity-90 translate-y-[20px]" 
          />
        </div>
        </>
    );
};

export default AuthBG;