'use client';
import IndicatorBoardToolbar from './indicator-board-toolbar';
import { useLogger } from '@/app/logging/use-logger.hook';
import SideNavigationBar from '@/app/ui/components/view/molecule/side-navigation-bar';
import { DashboardIcon } from '@radix-ui/react-icons';
import MetadataListContainer from './metadata-list-container';
import { useRef } from 'react';

export default function SideNav() {
  const logger = useLogger();
  const timestamp = useRef(Date.now());

  const handleCollapsedChange = (collapsed: boolean) => {
    if (collapsed === true) {
      timestamp.current = Date.now();
      logger.track('close_sidebar', { date: new Date() });
    } else {
      const millis = Date.now() - timestamp.current;
      logger.track('open_sidebar', { date: new Date(), duration: Math.floor(millis / 1000) });
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
