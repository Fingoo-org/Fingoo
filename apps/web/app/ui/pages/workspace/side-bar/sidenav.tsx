'use client';
import IndicatorBoardToolbar from './indicator-board-toolbar';
import { useLogger } from '@/app/logging/logging-context';
import SideNavigationBar from '@/app/ui/components/view/molecule/side-navigation-bar';
import { DashboardIcon } from '@radix-ui/react-icons';
import MetadataListContainer from './metadata-list-container';

export default function SideNav() {
  const logger = useLogger();

  const handleCollapsed = (collapsed: boolean) => {
    logger.track('click_sidebar_toggle', { sidebar_state: collapsed ? 'close' : 'open', date: new Date() });
  };

  return (
    <SideNavigationBar defaultValue="dashboard" onCollapsed={handleCollapsed}>
      <SideNavigationBar.Menu value="dashboard" icon={DashboardIcon} />
      <SideNavigationBar.Content value="dashboard">
        <div className="mx-6 grid h-full grid-rows-[1fr_2fr]">
          <MetadataListContainer />
          <IndicatorBoardToolbar />
        </div>
      </SideNavigationBar.Content>
    </SideNavigationBar>
  );
}
