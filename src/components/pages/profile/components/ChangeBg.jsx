import React from 'react';

export default function ChangeBg({ profile, isViewFull, isSelectingBg, onClose, onSelectBg }) {
  const bgOptions = ["/bg1.gif", "/bg2.jpg", "/bg3.jpg", "/bg4.png", "/bg5.jpg"];

  if (!isViewFull && !isSelectingBg) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      {/* Nút X để thoát */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
      >
        ✕
      </button>

      {/* Logic Xem ảnh full */}
      {isViewFull && (
        <img 
          src={profile.bgUrl} 
          alt="Full Background"
          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" 
        />
      )}

      {/* Logic Chọn ảnh */}
      {isSelectingBg && (
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[400px] shadow-2xl">
          <h3 className="text-lg font-bold mb-4 text-center">Chọn ảnh nền</h3>
          <div className="grid grid-cols-2 gap-3">
            {bgOptions.map((src, index) => (
              <button 
                key={index} 
                onClick={() => onSelectBg(src)} 
                className="h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <img src={src} alt={`Background ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}