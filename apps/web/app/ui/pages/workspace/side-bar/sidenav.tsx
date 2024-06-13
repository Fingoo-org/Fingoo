'use client';
import IndicatorBoardToolbar from './indicator-board-toolbar';
import Chat from '@/app/ui/components/domain/linguistic-guidance/chat';
import { useLogger } from '@/app/logging/logging-context';
import SideNavigationBar from '@/app/ui/components/view/molecule/side-navigation-bar';
import { DashboardIcon } from '@radix-ui/react-icons';

export default function SideNav() {
  const logger = useLogger();

  const handleCollapsed = (collapsed: boolean) => {
    logger.track('click_sidebar_toggle', { sidebar_state: collapsed ? 'close' : 'open', date: new Date() });
  };

  return (
    <SideNavigationBar defaultValue='dashboard' onCollapsed={handleCollapsed}>
      <SideNavigationBar.Menu value="dashboard" icon={DashboardIcon} />
      <SideNavigationBar.Content value="dashboard">
        <div className="flex h-screen flex-col">
          <div className="grid h-full grid-rows-[5fr_7fr]">
            <IndicatorBoardToolbar />
            <div className="flex flex-col justify-center">
              <Chat />
            </div>
          </div>
        </div>
      </SideNavigationBar.Content>
    </SideNavigationBar>
  );
}