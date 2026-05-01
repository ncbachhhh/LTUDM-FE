import React, { useState } from 'react';

export default function FileManager({ onClose }) {
  // State quản lý xem Tab nào đang được chọn. Mặc định là 'Ảnh'
  const [activeTab, setActiveTab] = useState('Ảnh');
  
  // Danh sách các tab để render bằng vòng lặp map()
  const tabs = ['Ảnh', 'File', 'Link'];

  return (
    <div className="flex h-full w-full flex-col bg-white">
      
      {/* Header: Nút X và Tiêu đề */}
      <header className="flex items-center gap-3 p-4 pb-2">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {/* Icon X */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Quản lý file</h2>
      </header>

      {/* Khu vực Tabs (Ảnh / File / Link) */}
      <nav className="flex px-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-3 text-center text-[13px] font-bold transition-colors
              ${activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' // Đang active: Chữ xanh, viền dưới xanh
                : 'text-gray-500 hover:text-gray-700'        // Không active: Chữ xám
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Khu vực Nội dung bên dưới Tab */}
      <div className="flex-1 overflow-y-auto p-4">
        
        {/* Nút Lọc (Filter) "Người gửi" */}
        <div className="mb-4">
            <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-1.5 px-3 rounded-full transition-colors">
                Người gửi
                {/* Icon mũi tên xuống nhỏ */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>

   
        {activeTab === 'Ảnh' && (
            <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-gray-200 rounded-md"></div>
            ))}
            </div>
        )}

        {/* Nếu bấm qua Tab File hoặc Link thì tạm thời hiện chữ */}
        {activeTab !== 'Ảnh' && (
             <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                Chưa có {activeTab.toLowerCase()} nào.
             </div>
        )}

      </div>
    </div>
  );
}