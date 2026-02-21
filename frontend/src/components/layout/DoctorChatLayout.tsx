import { Outlet } from 'react-router-dom';
import { SidebarChats } from './SidebarChats';
import { TopBar } from './TopBar';

export function DoctorChatLayout() {
  return (
    <div className="h-screen flex bg-slate-100">
      <SidebarChats />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
