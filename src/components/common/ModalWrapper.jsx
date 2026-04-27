import React from 'react';

// Nhận vào isOpen để biết có hiển thị hay không, onClose để đóng, và children là nội dung bên trong
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  // Nếu isOpen là false thì không render gì cả 
  if (!isOpen) return null;

  return (
    // Lớp overlay (nền mờ đen) bao phủ toàn màn hình
    // z-50 đảm bảo nó nằm trên cùng, fixed để đứng yên khi cuộn
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose} // Click ra ngoài để đóng modal
    >
      {/* Hộp thoại Modal chính */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in"
      >
        {/* Header của Modal */}
        <div className="flex items-center justify-center relative">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Nội dung */}
        <div className="mt-2">
            {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;