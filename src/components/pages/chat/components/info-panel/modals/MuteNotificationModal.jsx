import React, { useState } from 'react';
import ModalWrapper from '../../../../../common/ModalWrapper'; 
const MuteNotificationModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedOption, setSelectedOption] = useState('30m');
    const options = [
        { id: '30m', label: 'Trong 30 phút' },
        { id: '1h', label: 'Trong 1 giờ' },
        { id: '24h', label: 'Trong 24 giờ' },
         { id: '8am', label: 'Tới 8 giờ sáng mai' },
        { id: 'forever', label: 'Đến khi tôi bật lại' },
    ];

    const handleMute = () => {
        if(onConfirm){
        onConfirm(selectedOption);
        }
        onClose(); 
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Tắt thông báo">
        <div className="flex flex-col gap-3">
            {/* Duyệt qua mảng options để render các thẻ input radio */}
            {options.map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="muteDuration"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-gray-700 font-medium">{option.label}</span>
          </label>
        ))}

        <p className="text-sm text-gray-500 mt-2 mb-4">
          Bạn sẽ không nhận được thông báo.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleMute}
            className="flex-1 py-2 px-4 rounded-xl font-semibold text-blue-700 bg-blue-200 hover:bg-blue-300 transition-colors"
          >
            Tắt thông báo
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default MuteNotificationModal;