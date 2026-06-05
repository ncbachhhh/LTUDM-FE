import React, { useState, useMemo } from 'react';
import { Dropdown } from 'antd';

export default function FileManager({ onClose, members = [] }) {
  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState('Ảnh');
  const tabs = ['Ảnh', 'File', 'Link'];

  // State quản lý thành viên đang chọn để lọc và từ khóa tìm kiếm tên
  const [selectedSender, setSelectedSender] = useState(null);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  // Hàm chuẩn hóa trường dữ liệu tránh lỗi cấu trúc từ backend
  const getMemberId = (m) => m?.userId || m?.user_id || m?.id || m?._id;
  const getMemberName = (m) => m?.name || m?.displayName || m?.display_name || "Thành viên";
  const getMemberAvatar = (m) => m?.avatar || m?.avatarUrl || m?.avatar_url || "https://via.placeholder.com/150";

  // Lọc danh sách thành viên trong dropdown khi gõ tìm kiếm
  const filteredMembers = useMemo(() => {
    const query = searchMemberQuery.trim().toLowerCase();
    if (!query) return members;
    return members.filter((m) => getMemberName(m).toLowerCase().includes(query));
  }, [members, searchMemberQuery]);

  return (
    <div className="flex h-full w-full flex-col bg-white rounded-[15px] overflow-hidden">
      
      {/* ── Header: Nút X và Tiêu đề ─────────────────────────────────── */}
      <header className="flex items-center gap-3 p-4 pb-2 shrink-0">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Quản lý file</h2>
      </header>

      {/* ── Khu vực Tabs (Ảnh / File / Link) ─────────────────────────── */}
      <nav className="flex px-4 border-b border-gray-100 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-[14px] font-bold transition-colors cursor-pointer ${
              activeTab === tab 
                ? 'text-[#0033FF] border-b-2 border-[#0033FF]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ── Khu vực Nội dung bên dưới Tab ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        
        {/* Nút Lọc "Người gửi" kèm Dropdown */}
        <div className="mb-4 flex items-center shrink-0">
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            open={selectedSender ? false : undefined} 
            dropdownRender={() => (
              <div className="w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl space-y-2">
                
                {/* 1. Ô nhập Tìm kiếm theo tên (Màu tím nhạt) */}
                <div className="flex items-center gap-2 rounded-xl bg-[#F0F4FF] px-3 py-1.5 border border-[#6366F1]/10 focus-within:border-[#6366F1]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#6366F1]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchMemberQuery}
                    onChange={(e) => setSearchMemberQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder:text-[#6366F1]/60 outline-none"
                  />
                </div>

                {/* Vạch chia nhẹ */}
                <div className="border-t border-gray-100"></div>

                {/* 2. Danh sách thành viên (Dữ liệu thật) */}
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => {
                      const memberId = getMemberId(member);
                      const isSelected = selectedSender && getMemberId(selectedSender) === memberId;
                      return (
                        <button
                          key={memberId}
                          onClick={() => {
                            setSelectedSender(member);
                            setSearchMemberQuery(''); // Xóa text tìm kiếm sau khi chọn thành viên
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                            isSelected 
                              ? 'bg-[#F0F4FF] text-[#0033FF] font-bold' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <img src={getMemberAvatar(member)} alt="" className="h-6 w-6 rounded-full object-cover border border-gray-100" />
                          <span className="truncate flex-1">{getMemberName(member)}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs text-gray-400 font-medium">
                      Không tìm thấy thành viên
                    </div>
                  )}
                </div>
              </div>
            )}
          >
            {/* Logic hiển thị nút: Đổi màu xanh #0033FF kèm nút X khi đã chọn người lọc */}
            {selectedSender ? (
              <div className="flex items-center gap-1.5 bg-[#0033FF]/10 text-[#0033FF] border border-[#0033FF]/20 text-xs font-black py-1.5 pl-3 pr-2 rounded-full shadow-sm">
                <span className="max-w-[130px] truncate">
                  Người gửi: {getMemberName(selectedSender)}
                </span>
                {/* Nút X bấm vào để xóa bộ lọc quay về tất cả mọi người */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn mở lại menu Dropdown khi click nút X
                    setSelectedSender(null);
                  }}
                  className="p-0.5 hover:bg-[#0033FF]/20 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-1.5 px-3 rounded-full transition-colors cursor-pointer select-none">
                Người gửi
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </Dropdown>
        </div>

        {/* Khu vực hiển thị danh sách Media / Files */}
        <div className="flex-1 min-h-0">
          {activeTab === 'Ảnh' && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-gray-200 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"></div>
              ))}
            </div>
          )}

          {activeTab !== 'Ảnh' && (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400 font-medium">
              Chưa có {activeTab.toLowerCase()} nào từ {selectedSender ? getMemberName(selectedSender) : 'tất cả mọi người'}.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}