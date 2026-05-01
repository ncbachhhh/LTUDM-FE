import React, { useState } from 'react';
import ModalWrapper from '../../../../../common/ModalWrapper'; 

export default function EditNickname({ isOpen, onClose }) {
  const [members, setMembers] = useState([
    { 
      id: 1, 
      name: 'Nguyễn Quốc Cường', 
      nickname: '', // Chưa có biệt danh
      avatar: 'https://i.pravatar.cc/150?u=1' // Ảnh random
    },
    { 
      id: 2, 
      name: 'Ninh Hoa Cải', 
      nickname: 'Ninh Khánh Xuân', // Đã có biệt danh
      avatar: 'https://i.pravatar.cc/150?u=2' 
    }
  ]);

  // State lưu ID của người đang được chỉnh sửa (Mặc định là null)
  const [editingUserId, setEditingUserId] = useState(null);
  
  //  State lưu giá trị đang gõ trong ô Input
  const [editValue, setEditValue] = useState('');

  // Hàm khi bấm vào icon Bút chì (sửa biệt danh)
  const handleEditClick = (member) => {
    setEditingUserId(member.id); // Bật chế độ edit cho người này
    // Lấy biệt danh hiện tại đưa vào ô input. Nếu chưa có thì lấy tên thật
    setEditValue(member.nickname || member.name); 
  };

  // Hàm khi bấm vào icon Dấu Tick (Lưu)
  const handleSaveClick = (id) => {
    // Cập nhật lại mảng members
    const updatedMembers = members.map(member => {
      if (member.id === id) {
        return { ...member, nickname: editValue }; // Ghi đè biệt danh mới
      }
      return member;
    });
    
    setMembers(updatedMembers); 
    setEditingUserId(null);     // Tắt chế độ edit (Trở về null)
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Chỉnh sửa biệt danh">
      <div className="flex flex-col gap-4 mt-2">
        {/* Duyệt qua từng thành viên để render */}
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3">
            
            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />

            {editingUserId === member.id ? (
              <>
                <div className="flex-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                {/* Nút Lưu (Dấu Tick) */}
                <button onClick={() => handleSaveClick(member.id)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-gray-900">
                    {/* Ưu tiên hiện Biệt danh, nếu không có mới hiện Tên thật */}
                    {member.nickname || member.name} 
                  </h4>
                  <p className="text-[12px] text-gray-500">
                    {/* Dòng chữ phụ ở dưới */}
                    {member.nickname ? member.name : "Đặt biệt danh"}
                  </p>
                </div>
                {/* Nút Edit (Bút chì) */}
                <button onClick={() => handleEditClick(member)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </>
            )}

          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}