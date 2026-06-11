import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, Spin } from "antd";
import { ChevronDown, Filter, Search, UserRound, X } from "lucide-react";
import MessageAPI from "../../../../../../apis/message.api.jsx";
import { DEFAULT_AVATAR } from "../../../../../../constants/asset.constants.js";
import { formatMessageTimeFull } from "../../../../../../utils/date-format.util.js";
import { getAvatarUrl, getDisplayName, getMemberId } from "../../../../../../utils/identity.util.js";

const tabs = ["Ảnh", "File", "Link"];

const getAttachment = (message) => message?.attachment || {};

const getFileUrl = (message) =>
  getAttachment(message).file_url ||
  getAttachment(message).fileUrl ||
  message?.content ||
  "";

const getFileName = (message) =>
  getAttachment(message).file_name ||
  getAttachment(message).fileName ||
  getFileUrl(message).split("/").pop() ||
  "Tệp đính kèm";

const getFileSize = (message) => {
  const size = Number(getAttachment(message).file_size || getAttachment(message).fileSize || 0);
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getSenderId = (item) => item?.sender_id || item?.senderId;

export default function FileManager({ onClose, conversationId, members = [] }) {
  const [activeTab, setActiveTab] = useState("Ảnh");
  const [selectedSender, setSelectedSender] = useState(null);
  const [searchMemberQuery, setSearchMemberQuery] = useState("");
  const [itemsByTab, setItemsByTab] = useState({ "Ảnh": [], File: [], Link: [] });
  const [loading, setLoading] = useState(false);
  const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);

  const selectedSenderId = selectedSender ? getMemberId(selectedSender) : null;

  const filteredMembers = useMemo(() => {
    const query = searchMemberQuery.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) => getDisplayName(member).toLowerCase().includes(query));
  }, [members, searchMemberQuery]);

  const filteredItems = useMemo(() => {
    const items = itemsByTab[activeTab] || [];
    if (!selectedSenderId) return items;
    return items.filter((item) => String(getSenderId(item)) === String(selectedSenderId));
  }, [activeTab, itemsByTab, selectedSenderId]);

  useEffect(() => {
    if (!conversationId) return;

    const loadItems = async () => {
      setLoading(true);
      const result =
        activeTab === "Ảnh"
          ? await MessageAPI.getConversationImages(conversationId)
          : activeTab === "File"
            ? await MessageAPI.getConversationFiles(conversationId)
            : await MessageAPI.getConversationLinks(conversationId);
      setLoading(false);

      if (result.isSuccess) {
        setItemsByTab((previous) => ({ ...previous, [activeTab]: result.data || [] }));
      }
    };

    loadItems();
  }, [activeTab, conversationId]);

  const renderSenderFilter = () => (
    <Dropdown
      trigger={["click"]}
      placement="bottomLeft"
      open={senderDropdownOpen}
      onOpenChange={setSenderDropdownOpen}
      dropdownRender={() => (
        <div className="w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl space-y-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#F0F4FF] px-3 py-1.5 border border-[#6366F1]/10 focus-within:border-[#6366F1]/30">
            <Search className="h-4 w-4 shrink-0 text-[#6366F1]" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên"
              value={searchMemberQuery}
              onChange={(event) => setSearchMemberQuery(event.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder:text-[#6366F1]/60 outline-none"
            />
          </div>
          <div className="border-t border-gray-100" />
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const memberId = getMemberId(member);
                return (
                  <button
                    key={memberId}
                    type="button"
                    onClick={() => {
                      setSelectedSender(member);
                      setSearchMemberQuery("");
                      setSenderDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <img src={getAvatarUrl(member, DEFAULT_AVATAR)} alt="" className="h-6 w-6 rounded-full object-cover border border-gray-100" />
                    <span className="truncate flex-1">{getDisplayName(member)}</span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-gray-400 font-medium">Không tìm thấy thành viên</div>
            )}
          </div>
        </div>
      )}
    >
      {selectedSender ? (
        <div
          onClick={() => setSenderDropdownOpen(true)}
          className="flex cursor-pointer select-none items-center gap-1.5 rounded-full border border-[#0033FF]/20 bg-[#0033FF]/10 py-1.5 pl-3 pr-2 text-xs font-black text-[#0033FF] shadow-sm transition-colors hover:bg-[#0033FF]/15"
        >
          <UserRound className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-[130px] truncate">Người gửi: {getDisplayName(selectedSender)}</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedSender(null);
            }}
            className="p-0.5 hover:bg-[#0033FF]/20 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Bỏ lọc người gửi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="flex cursor-pointer select-none items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-gray-700 shadow-sm transition-colors hover:border-[#0033FF]/25 hover:bg-[#F0F4FF]"
        >
          <Filter className="h-3.5 w-3.5 text-[#0033FF]" />
          <span>Người gửi</span>
          <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${senderDropdownOpen ? "rotate-180" : ""}`} />
        </button>
      )}
    </Dropdown>
  );

  return (
    <div className="flex h-full w-full flex-col bg-white rounded-[15px] overflow-hidden">
      <header className="flex items-center gap-3 p-4 pb-2 shrink-0">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          ×
        </button>
        <h2 className="text-lg font-bold text-gray-800">Ảnh, file, link</h2>
      </header>

      <nav className="flex px-4 border-b border-gray-100 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-[14px] font-bold transition-colors cursor-pointer ${
              activeTab === tab ? "text-[#0033FF] border-b-2 border-[#0033FF]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="mb-4 flex items-center shrink-0">{renderSenderFilter()}</div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spin />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400 font-medium">
            Chưa có {activeTab.toLowerCase()} nào từ {selectedSender ? getDisplayName(selectedSender) : "tất cả mọi người"}.
          </div>
        ) : activeTab === "Ảnh" ? (
          <div className="grid grid-cols-3 gap-2">
            {filteredItems.map((message) => {
              const url = getFileUrl(message);
              return (
                <a key={message.id} href={url} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <img src={url} alt="Ảnh đã gửi" className="h-full w-full object-cover hover:scale-105 transition-transform" />
                </a>
              );
            })}
          </div>
        ) : activeTab === "File" ? (
          <div className="space-y-2">
            {filteredItems.map((message) => (
              <a key={message.id} href={getFileUrl(message)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3 hover:bg-[#F0F4FF]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[10px] font-black text-[#0033FF]">FILE</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{getFileName(message)}</p>
                  <p className="text-xs text-slate-400">{getFileSize(message) || formatMessageTimeFull(message.created_at || message.createdAt)}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((link, index) => (
              <a key={`${link.message_id || link.messageId}-${index}`} href={link.normalized_url || link.normalizedUrl || link.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:bg-slate-50">
                <p className="truncate text-sm font-black text-slate-900">{link.url}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{link.text}</p>
                <p className="mt-1 text-[11px] text-slate-400">{formatMessageTimeFull(link.created_at || link.createdAt)}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
