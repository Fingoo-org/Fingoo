'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';
import { useState } from 'react';
import { cn } from '@/app/utils/style';
import IconButton from '../../components/view/atom/icons/icon-button';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { useResponsive } from '@/app/utils/hooks/use-responsive.hook';
import AdBanner from './ad-banner';

export default function ChatAiNavigator() {
  const [collapsed, setCollapsed] = useState(false);
  const { isBigScreen } = useResponsive();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const sidebarWidth = isBigScreen ? 400 : 300;

  return (
    <div className="relative">
      <IconButton
        size={'xs'}
        data-collapsed={collapsed}
        className={cn(
          'absolute top-[3vh] z-10 rounded-full bg-fingoo-gray-1.5 drop-shadow-fingoo transition-transform duration-200 data-[collapsed=true]:rotate-180',
          collapsed ? 'right-[8px]' : isBigScreen ? 'right-[388px]' : 'right-[288px]',
        )}
        color={'gray'}
        onClick={handleCollapse}
        icon={ChevronRightIcon}
      />
      <Sidebar
        collapsed={collapsed}
        transitionDuration={0}
        collapsedWidth="20px"
        width={`${sidebarWidth}px`}
        backgroundColor={'#fff'}
        className="h-full shadow-sm"
      >
        {!collapsed ? (
          <>
            <div className="h-[100px] w-full bg-gray-300">
              <AdBanner />
            </div>
            <div className="h-6 w-full border"></div>
            <div
              style={{
                height: 'calc(100% - 124px)',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Chat />
            </div>
          </>
        ) : null}
      </Sidebar>
    </div>
  );
}
