import { useState } from "react";
import SearchInput from "../../../../common/SearchInput.jsx";
import { DEFAULT_AVATAR } from "../../../../../constants/asset.constants.js";

export default function SearchBar({ contacts = { people: [], groups: [] } }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const peopleList = contacts?.people || [];

  const filteredFriends = peopleList.filter((person) =>
    person.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const closeSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full">
      <SearchInput
        value=""
        onFocus={() => setIsSearching(true)}
        placeholder="Tìm kiếm bạn bè"
        variant="friend"
      />

      {isSearching && (
        <div className="absolute left-[-16px] top-[-16px] z-[100] h-[100vh] w-[calc(100%+32px)] bg-[#E9ECF6] p-4 animate-in fade-in duration-200">
          <div className="mb-6 flex items-center gap-3">
            <SearchInput
              autoFocus
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm bạn bè"
              variant="friend"
              wrapperClassName="flex-1"
            />

            <button
              type="button"
              onClick={closeSearch}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L1 13M1 1L13 13"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="custom-search-scrollbar flex h-[calc(100vh-100px)] flex-col gap-8 overflow-y-auto px-1 pr-1">
            <section>
              <h3 className="mb-4 text-[14px] font-black uppercase tracking-wide text-black">
                {searchQuery ? "Kết quả tìm kiếm" : "Nội dung tìm kiếm mới đây"}
              </h3>

              <div className="flex flex-col gap-5">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((person) => (
                    <div
                      key={person.id}
                      className="group flex cursor-pointer items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={person.avatar}
                          className="h-10 w-10 rounded-full bg-[#D9D9D9] object-cover"
                          alt=""
                          onError={(event) => {
                            event.currentTarget.src = DEFAULT_AVATAR;
                          }}
                        />
                        <span className="text-[14px] font-bold text-gray-800">
                          {person.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-gray-400 hover:text-black"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M13 1L1 13M1 1L13 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm italic text-gray-500">
                    Không tìm thấy kết quả phù hợp...
                  </div>
                )}
              </div>
            </section>

            {!searchQuery && (
              <section>
                <h3 className="mb-4 text-[14px] font-black uppercase tracking-wide text-black">
                  Danh bạ của bạn
                </h3>
                <div className="flex flex-col gap-5">
                  {peopleList.slice(0, 3).map((person) => (
                    <div
                      key={`contact-${person.id}`}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <img
                        src={person.avatar}
                        className="h-10 w-10 rounded-full bg-[#D9D9D9] object-cover"
                        alt=""
                      />
                      <span className="text-[14px] font-bold text-gray-800">
                        {person.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-search-scrollbar::-webkit-scrollbar { width: 14px; }
        .custom-search-scrollbar::-webkit-scrollbar-thumb {
          background: #A8A8A8;
          border: 4px solid #F3F5F9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
