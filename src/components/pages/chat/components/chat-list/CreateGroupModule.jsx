import React, { useState, useEffect } from 'react';

const friendsList = [
  { id: 1, name: 'Nguyễn Quốc Cường', email: 'cuong@gmail.com', avatar: 'https://i.pravatar.cc/150?u=c' },
  { id: 2, name: 'Ninh Hoa Cải', email: 'ninh@gmail.com', avatar: 'https://i.pravatar.cc/150?u=n' },
  { id: 3, name: 'Nguyễn Trung Chính', email: 'chinh@gmail.com', avatar: 'https://i.pravatar.cc/150?u=ch' },
  { id: 4, name: 'Đỗ Duy Lợi', email: 'loi@gmail.com', avatar: 'https://i.pravatar.cc/150?u=l' },
];

export default function CreateGroupModule({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Lọc theo Tên hoặc Email và loại trừ người đã chọn[cite: 1]
  useEffect(() => {
    const query = memberInput.trim().toLowerCase();
    if (query === '') {
      setSuggestions([]);
    } else {
      const filtered = friendsList.filter(user =>
        (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) &&
        !selectedMembers.find(m => m.id === user.id)
      );
      setSuggestions(filtered);
    }
  }, [memberInput, selectedMembers]);

  if (!isOpen) return null;

  const handleAddMember = (user) => {
    setSelectedMembers([...selectedMembers, user]);
    setMemberInput('');
    setSuggestions([]);
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleAddMember(suggestions[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="w-[480px] rounded-[24px] bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all">
        
        {/* Header chuẩn thiết kế[cite: 1] */}
        <div className="relative flex items-center justify-center border-b border-gray-100 py-6">
          <h2 className="text-[24px] font-bold text-black">Tạo nhóm</h2>
          <button onClick={onClose} className="absolute right-6 p-1 hover:bg-gray-100 rounded-full transition-all">
            <svg className="h-7 w-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Nhập tên nhóm[cite: 1] */}
          <div className="mb-6 flex items-center gap-4">
            <button className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[#BCCCFB] bg-white text-[#BCCCFB] hover:bg-blue-50 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Nhập tên nhóm"
              className="flex-1 rounded-[12px] bg-[#DCE4FF] p-4 text-[15px] font-semibold text-black placeholder:text-[#818CF8] focus:outline-none"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Thêm thành viên[cite: 1] */}
          <div className="mb-6 relative">
            <h3 className="mb-3 text-[18px] font-bold text-black">Thêm thành viên</h3>
            <input
              type="text"
              placeholder="Nhập tên bạn bè, email"
              className="w-full rounded-[12px] bg-[#DCE4FF] p-4 text-[15px] font-semibold text-black placeholder:text-[#818CF8] focus:outline-none mb-4"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Gợi ý Dropdown[cite: 1] */}
            {suggestions.length > 0 && (
              <div className="absolute z-[110] left-0 right-0 top-[95px] max-h-[160px] overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-2xl">
                {suggestions.map((user) => (
                  <div key={user.id} onClick={() => handleAddMember(user)} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                    <img src={user.avatar} className="h-9 w-9 rounded-full object-cover" alt="" />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-black">{user.name}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Danh sách Card thành viên - ĐÃ XÓA VIỀN XANH[cite: 1] */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2">
              {selectedMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2 rounded-full bg-[#E5E7EB] pl-1 pr-3 py-1 shrink-0 animate-in zoom-in-95">
                  <img src={member.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                  <span className="text-[13px] font-bold text-black whitespace-nowrap">{member.name}</span>
                  <button onClick={() => handleRemoveMember(member.id)} className="text-black hover:text-red-500 transition-colors">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat gần đây[cite: 1] */}
          <div className="mb-8">
            <h3 className="mb-4 text-[18px] font-bold text-black">Chat gần đây</h3>
            <div className="space-y-4">
              {friendsList.slice(0, 3).map(friend => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                    <span className="text-[15px] font-bold text-black">{friend.name}</span>
                  </div>
                  <button className="text-black hover:opacity-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons[cite: 1, 2] */}
          <div className="flex gap-5 pt-2">
            <button onClick={onClose} className="flex-1 rounded-[16px] bg-[#F3F4F1] py-4 text-[18px] font-bold text-black hover:bg-gray-200 transition-all active:scale-95">
              Hủy
            </button>
            <button className="flex-1 rounded-[16px] bg-[#BCCCFB] py-4 text-[18px] font-bold text-black hover:bg-[#A5B9F9] transition-all active:scale-95">
              Tạo nhóm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}