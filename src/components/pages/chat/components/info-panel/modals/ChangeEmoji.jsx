import React from 'react';
import ModalWrapper from '../../../../../common/ModalWrapper'; 
import EmojiPicker from 'emoji-picker-react';


export default function ChangeEmojiModal({ isOpen, onClose, onSelectEmoji }) {
    const handleEmojiClick = (emojiObject) => {

    console.log("Dữ liệu thư viện trả về:", emojiObject);
    
    onSelectEmoji(emojiObject.emoji); 
    onClose(); 
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Thay đổi biểu tượng cảm xúc">
      <div className="mt-4 flex justify-center w-full">
        <EmojiPicker 
          onEmojiClick={handleEmojiClick}
          searchPlaceHolder="Tìm kiếm emoji..." 
          width="100%" 
          height={400} 
        />
      </div>
    </ModalWrapper>
  );
}