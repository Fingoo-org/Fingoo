'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';
import { useState } from 'react';
import { cn } from '@/app/utils/style';
import IconButton from '../../components/view/atom/icons/icon-button';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { useResponsive } from '@/app/utils/hooks/use-responsive.hook';

export default function ChatAiNavigator() {
  const [collpase, setCollpase] = useState(false);
  const { isBigScreen } = useResponsive();

  const handleCollpase = () => {
    setCollpase(!collpase);
  };

  const sidebarWidth = isBigScreen ? 400 : 300;

  const closeIconRight = collpase ? 'right-[8px]' : `right-[${sidebarWidth - 12}px]`;

  return (
    <div className="relatvie">
      <IconButton
        size={'xs'}
        data-collapsed={collpase}
        className={cn(
          'absolute top-[3vh] z-10 rounded-full bg-fingoo-gray-1.5 drop-shadow-fingoo transition-transform duration-200 data-[collapsed=true]:rotate-180',
          closeIconRight,
        )}
        color={'gray'}
        onClick={handleCollpase}
        icon={ChevronRightIcon}
      />
      <Sidebar
        collapsed={collpase}
        transitionDuration={0}
        collapsedWidth="20px"
        width={`${sidebarWidth}px`}
        backgroundColor={'#fff'}
        className="h-full shadow-sm"
      >
        {!collpase ? (
          <>
            <div className="h-[13vh] w-full bg-gray-300"></div>
            <div className="h-[3vh] w-full border"></div>
            <div className="h-[84vh]">
              <Chat />
            </div>
          </>
        ) : null}
      </Sidebar>
    </div>
  );
}
