import { useState } from "react";

export default function UnreadFilter({ initialEnabled = false }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setEnabled(!enabled);
    setIsAnimating(true);
    // Vòng halo biến mất sau khi trượt xong (300ms)
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors duration-300 ease-in-out focus:outline-none overflow-visible
        ${enabled ? "bg-[#0033ff]/30" : "bg-[#D9D9D9]"}
      `}
    >
      {/* 
        KHỐI ĐỒNG TÂM: 
      */}
      <div
        className={`
          absolute left-0 flex h-8 w-8 items-center justify-center transition-transform duration-300 ease-out pointer-events-none
          ${enabled ? "translate-x-[16px]" : "translate-x-[-4px]"}
        `}
      >
        {/* 
          Vòng sáng (Halo): 
        */}
        <span
          className={`
            absolute h-8 w-8 rounded-full bg-white/40 transition-all duration-300
            ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-100"}
          `}
        />

        {/* 
          Nút tròn trắng chính (Thumb): 
        */}
        <span
          className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
        >
          <svg 
            className={`h-3 w-3 text-black transition-opacity duration-200 ${enabled ? "opacity-100" : "opacity-0"}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </div>
    </button>
  );
}