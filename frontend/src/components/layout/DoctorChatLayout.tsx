import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '../../stores/layoutStore';
import { SidebarChats } from './SidebarChats';
import { TopBar } from './TopBar';
import { ReportPanelSidebar } from './ReportPanelSidebar';

export function DoctorChatLayout() {
  const leftPanelOpen = useLayoutStore((s) => s.leftPanelOpen);
  const rightPanelOpen = useLayoutStore((s) => s.rightPanelOpen);

  return (
    <div className="h-screen flex bg-slate-100">
      {leftPanelOpen && <SidebarChats />}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      {rightPanelOpen && <ReportPanelSidebar />}
    </div>
  );
}
