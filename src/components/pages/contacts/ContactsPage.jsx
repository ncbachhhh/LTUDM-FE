import React, { useState } from "react";
import { contacts } from "../../../helpers/chatData";
import FriendList from "./components/FriendList";
import GroupList from "./components/GroupList";
import FriendRequestModule from "./components/FriendRequestModule";
import { Search, UserRound, Users, UserPlus } from "lucide-react";

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("REQUESTS");

  return (
    <div className="flex h-full bg-[#Eef1f6] p-4 gap-4 overflow-hidden">
      {/* BÊN TRÁI: Chia thành 2 khối trắng tách biệt */}
      <div className="w-[320px] flex flex-col gap-4 shrink-0 h-full">
        {/* Khối tìm kiếm riêng */}
        <div className="bg-white rounded-[16px] p-2 px-4 flex items-center shadow-sm h-[60px] shrink-0">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè"
            className="w-full bg-transparent outline-none text-[15px] font-medium"
          />
        </div>

        {/* Khối Menu riêng, bo góc cực lớn */}
        <div className="bg-white rounded-[32px] flex-1 p-6 shadow-sm flex flex-col overflow-hidden">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("FRIENDS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === "FRIENDS" ? "bg-[#F1F4FF] text-black font-bold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <UserRound size={22} />
              <span className="text-[16px]">Danh sách bạn bè</span>
            </button>
            <button
              onClick={() => setActiveTab("GROUPS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === "GROUPS" ? "bg-[#F1F4FF] text-black font-bold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <Users size={22} />
              <span className="text-[16px]">Danh sách nhóm</span>
            </button>
            <button
              onClick={() => setActiveTab("REQUESTS")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[16px] transition-all ${activeTab === "REQUESTS" ? "bg-gradient-to-r from-[#E9EAFF] to-[#F2F4FF] text-black font-bold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <UserPlus size={22} />
              <span className="text-[16px]">Lời mời kết bạn</span>
            </button>
          </nav>
        </div>
      </div>

      {/* BÊN PHẢI: Header và Nội dung */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-white rounded-[16px] px-8 h-[60px] flex items-center gap-4 shadow-sm shrink-0">
          <UserPlus size={22} className="text-black" />
          <h1 className="font-bold text-[17px]">Lời mời kết bạn</h1>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "FRIENDS" && <FriendList people={contacts.people} />}
          {activeTab === "GROUPS" && <GroupList groups={contacts.groups} />}
          {activeTab === "REQUESTS" && <FriendRequestModule />}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
