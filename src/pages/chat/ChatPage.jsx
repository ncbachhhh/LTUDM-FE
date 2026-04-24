import ChatWindow from "../../components/chat/ChatWindow.jsx";
import InfoPanel from "../../components/info-panel/InfoPanel.jsx";
import SideNav from "../../components/layout/SideNav.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";

export default function ChatPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-200">
      <div className="flex h-full w-full bg-[#E8EEFB] lg:gap-4">
        <aside className="h-full shrink-0">
          <SideNav />
        </aside>

        <section className="hidden h-full min-w-0 w-full max-w-[380px] shrink-0 md:flex md:basis-[320px] lg:basis-[360px] xl:basis-[380px] xl:flex-col">
          <Sidebar />
        </section>

        <main className="flex h-full min-w-0 flex-1 flex-col px-4 py-4 lg:px-0">
          <ChatWindow />
        </main>

        <aside className="hidden h-full min-w-0 w-full max-w-[320px] shrink-0 xl:flex xl:basis-[320px] xl:flex-col">
          <InfoPanel />
        </aside>
      </div>
    </div>
  );
}
