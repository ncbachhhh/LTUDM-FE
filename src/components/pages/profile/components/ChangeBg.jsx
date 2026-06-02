import React, { useRef } from 'react';
import { Modal } from 'antd';
import { X, Upload } from 'lucide-react';

export default function ChangeBg({ profile, isViewFull, isSelectingBg, onClose, onSelectBg }) {
  const bgOptions = ["/bg1.gif", "/bg2.jpg", "/bg3.jpg", "/bg4.png", "/bg5.jpg"];
  const isOpen = isViewFull || isSelectingBg;
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSelectBg(null, file);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      centered
      width={isViewFull ? 640 : 400}
      styles={{
        content: {
          padding: 0,
          background: isViewFull ? "transparent" : "#fff",
          boxShadow: isViewFull ? "none" : undefined,
          borderRadius: 24,
          overflow: "hidden",
        }
      }}
    >
      <div className="relative flex flex-col items-center justify-center p-4">
        {/* Nút X để thoát */}
        <button 
          onClick={onClose} 
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors border-none cursor-pointer z-50 ${
            isViewFull ? 'text-white bg-black/40 hover:bg-black/60' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <X size={18} />
        </button>

        {/* Logic Xem ảnh full */}
        {isViewFull && (
          <img 
            src={profile.bgUrl} 
            alt="Full Background"
            className="max-w-full max-h-[75vh] rounded-xl shadow-2xl object-contain mt-8" 
          />
        )}

        {/* Logic Chọn ảnh */}
        {isSelectingBg && (
          <div className="w-full pt-8 pb-4 px-4 text-left">
            <h3 className="text-lg font-bold mb-5 text-center text-slate-800 m-0">Chọn ảnh nền</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Tải ảnh lên từ thiết bị */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()} 
                className="h-20 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#0029FF] transition-all cursor-pointer p-0 bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-[#0029FF]"
              >
                <Upload size={20} />
                <span className="text-xs font-semibold">Tải lên từ máy</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              {bgOptions.map((src, index) => (
                <button 
                  key={index} 
                  onClick={() => onSelectBg(src)} 
                  className="h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#0029FF] transition-all cursor-pointer p-0 bg-transparent"
                >
                  <img src={src} alt={`Background ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}