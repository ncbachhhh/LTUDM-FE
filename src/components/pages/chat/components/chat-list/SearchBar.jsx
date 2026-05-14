import { useState } from "react";

export default function SearchBar({ contacts = { people: [], groups: [] } }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const peopleList = contacts?.people || [];

  // Logic lọc bạn bè từ props API
  const filteredFriends = peopleList.filter(person =>
    person.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {/* --- TRẠNG THÁI 1: GIỮ NGUYÊN FORM CŨ --- */}
      <div className="w-full">
        <div className="relative w-full">
          <input
            type="text"
            onFocus={() => setIsSearching(true)}
            placeholder="Tìm kiếm bạn bè"
            className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-sm font-bold text-gray-500 outline-none shadow-sm transition-all"
          />
          <img
            src="/icon-tim-kiem.svg"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
            alt=""
          />
        </div>
      </div>

      {/* --- TRẠNG THÁI 2: OVERLAY ĐÈ LÊN --- */}
      {isSearching && (
        <div className="absolute left-[-16px] top-[-16px] z-[100] h-[100vh] w-[calc(100%+32px)] bg-[#E9ECF6] p-4 animate-in fade-in duration-200">
          
          {/* Thanh Search ở trang 2 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bạn bè"
                className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-sm font-bold text-black outline-none shadow-sm"
              />
              <img 
                src="/icon-tim-kiem.svg" 
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80" 
                alt=""
              />
            </div>

            {/* Nút X tròn trắng chuẩn thiết kế của ông */}
            <button 
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1L13 13" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Nội dung kết quả tìm kiếm */}
          <div className="flex flex-col gap-8 overflow-y-auto h-[calc(100vh-100px)] custom-search-scrollbar pr-1 px-1">
            
            {/* Hiển thị danh sách kết quả */}
            <section>
              <h3 className="mb-4 text-[14px] font-black text-black uppercase tracking-wide">
                {searchQuery ? "Kết quả tìm kiếm" : "Nội dung tìm kiếm mới đây"}
              </h3>
              <div className="flex flex-col gap-5">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((person) => (
                    <div key={person.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        {/* Load avatar từ data hoặc fallback nếu lỗi */}
                        <img 
                          src={person.avatar} 
                          className="h-10 w-10 rounded-full object-cover bg-[#D9D9D9]" 
                          alt="" 
                          onError={(e) => e.target.src="https://via.placeholder.com/150"}
                        />
                        <span className="text-[14px] font-bold text-gray-800">{person.name}</span>
                      </div>
                      
                      {/* Nút xóa item (nếu là lịch sử) hoặc icon khác tùy ông */}
                      <button className="text-gray-400 hover:text-black">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">Không tìm thấy kết quả phù hợp...</div>
                )}
              </div>
            </section>

            {/* Mục Danh bạ của bạn (hiển thị khi chưa search) */}
            {!searchQuery && (
              <section>
                <h3 className="mb-4 text-[14px] font-black text-black uppercase tracking-wide">Danh bạ của bạn</h3>
                <div className="flex flex-col gap-5">
                  {peopleList.slice(0, 3).map(person => (
                    <div key={`contact-${person.id}`} className="flex items-center gap-3 cursor-pointer">
                      <img src={person.avatar} className="h-10 w-10 rounded-full object-cover bg-[#D9D9D9]" alt="" />
                      <span className="text-[14px] font-bold text-gray-800">{person.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Style giữ nguyên như cũ của ông */}
      <style jsx>{`
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
