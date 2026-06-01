import { useRef } from "react";
import { FaCamera } from "react-icons/fa";

export default function AvataChange({ avatarUrl, onAvatarChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onAvatarChange(localUrl, file);
    }
  };

  return (
    <div className="relative h-24 w-24 -mt-12 ml-6">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
        aria-label="Tải ảnh đại diện lên"
      >
        <FaCamera className="h-3.5 w-3.5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}