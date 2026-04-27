import ContactItem from "./ContactItem.jsx";
import SearchBar from "./SearchBar.jsx";
import { contacts } from "../../../../../helpers/chatData.js";

export default function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden pl-0 pr-0">
      <div className="flex items-center">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 px-1">
        <span className="text-[14px] font-black">Chưa đọc</span>
        <div className="relative h-5 w-10 rounded-full bg-blue-500/30">
          <div className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] shadow-sm">
            <img
              src="/icon-chua-doc.svg"
              className="h-3 w-3"
              alt="Biểu tượng chưa đọc"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-[1.55] flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black">PEOPLE</h2>
          <img src="/Icon-peolpe.svg" className="h-6 w-6" alt="Biểu tượng danh bạ" />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {contacts.people.map((contact) => (
            <ContactItem key={contact.id} {...contact} />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black">GROUP</h2>
          <img src="/Icon-group.svg" className="h-6 w-6" alt="Biểu tượng nhóm" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.groups.map((contact) => (
            <ContactItem key={contact.id} {...contact} />
          ))}
        </div>
      </div>
    </div>
  );
}
