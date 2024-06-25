'use client';
import IndicatorBoardToolbar from './indicator-board-toolbar';
import { useLogger } from '@/app/logging/use-logger.hook';
import SideNavigationBar from '@/app/ui/components/view/molecule/side-navigation-bar';
import { DashboardIcon } from '@radix-ui/react-icons';
import MetadataListContainer from './metadata-list-container';

export default function SideNav() {
  const logger = useLogger();

  const handleCollapsedChange = (collapsed: boolean) => {
    if (collapsed === true) {
      logger.track('close_sidebar', { date: new Date() });
    } else {
      logger.track('open_sidebar', { date: new Date() });
    }
  };

  return (
    <SideNavigationBar defaultValue="dashboard" onCollapsed={handleCollapsedChange}>
      <SideNavigationBar.Menu value="dashboard" icon={DashboardIcon} />
      <SideNavigationBar.Content value="dashboard">
        <div className="mx-4 grid h-full grid-rows-[1fr_2fr]">
          <MetadataListContainer />
          <IndicatorBoardToolbar />
        </div>
      </SideNavigationBar.Content>
    </SideNavigationBar>
  );
}
