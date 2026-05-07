import ContactItem from "./ContactItem.jsx";
import SearchBar from "./SearchBar.jsx";
import { useMemo, useState } from "react";

export default function ChatList({
                                     contacts = { people: [], groups: [] },
                                     loading = false,
                                     currentConvoId,
                                     onSelect,
                                 }) {
    const [keyword, setKeyword] = useState("");

    const people = contacts?.people || [];
    const groups = contacts?.groups || [];

    const filterContacts = (items) => {
        if (!keyword.trim()) return items;

        return items.filter((item) =>
            item.name?.toLowerCase().includes(keyword.trim().toLowerCase())
        );
    };

    const filteredPeople = useMemo(
        () => filterContacts(people),
        [people, keyword]
    );

    const filteredGroups = useMemo(
        () => filterContacts(groups),
        [groups, keyword]
    );

    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-hidden pl-0 pr-0">
            <div className="flex items-center">
                <SearchBar value={keyword} onChange={setKeyword} />
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

                    <img
                        src="/Icon-peolpe.svg"
                        className="h-6 w-6"
                        alt="Biểu tượng danh bạ"
                    />
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                    {loading ? (
                        <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                            Đang tải hội thoại...
                        </p>
                    ) : filteredPeople.length > 0 ? (
                        filteredPeople.map((contact) => (
                            <ContactItem
                                key={contact.id}
                                {...contact}
                                isSelected={currentConvoId === contact.id}
                                onSelect={onSelect}
                            />
                        ))
                    ) : (
                        <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                            Không có hội thoại cá nhân
                        </p>
                    )}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-black">GROUP</h2>

                    <img
                        src="/Icon-group.svg"
                        className="h-6 w-6"
                        alt="Biểu tượng nhóm"
                    />
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                    {loading ? (
                        <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                            Đang tải nhóm...
                        </p>
                    ) : filteredGroups.length > 0 ? (
                        filteredGroups.map((contact) => (
                            <ContactItem
                                key={contact.id}
                                {...contact}
                                isSelected={currentConvoId === contact.id}
                                onSelect={onSelect}
                            />
                        ))
                    ) : (
                        <p className="mt-6 text-center text-xs font-semibold text-gray-400">
                            Không có nhóm chat
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}