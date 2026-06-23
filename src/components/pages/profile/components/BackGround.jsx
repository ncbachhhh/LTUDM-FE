import { PROFILE_COVER } from "../../../../constants/asset.constants.js";

export default function BackGround({ bgUrl }) {
  return (
    // Sửa rounded-t-[24px] thành rounded-[24px] để bo tròn cả 4 góc
    <div className="relative h-40 w-full overflow-hidden rounded-[24px]">
      <img
        src={bgUrl || PROFILE_COVER}
        alt="Profile Background"
        // Thêm rounded-[24px] ở đây để đồng bộ
        className="h-full w-full object-cover rounded-[24px]"
      />
      {/* Overlay cũng cần bo góc để không bị thừa */}
      <div className="absolute inset-0 bg-black/10 rounded-[24px]" />
    </div>
  );
}
