'use client';
import { Sidebar } from 'react-pro-sidebar';
import Chat from '../../components/domain/linguistic-guidance/chat';
import { useState } from 'react';
import { cn } from '@/app/utils/style';
import IconButton from '../../components/view/atom/icons/icon-button';
import { ChevronRightIcon } from '@heroicons/react/solid';

export default function ChatAiNavigator() {
  const [collpase, setCollpase] = useState(false);

  const handleCollpase = () => {
    setCollpase(!collpase);
  };

  return (
    <div className="relatvie">
      <IconButton
        size={'xs'}
        data-collapsed={collpase}
        className={cn(
          'drop-shadow-fingoo absolute top-[3vh] z-10 rounded-full bg-fingoo-gray-1.5 transition-transform duration-200 data-[collapsed=true]:rotate-180',
          collpase ? 'right-[8px]' : 'right-[388px]',
        )}
        color={'gray'}
        onClick={handleCollpase}
        icon={ChevronRightIcon}
      />
      <Sidebar
        collapsed={collpase}
        transitionDuration={0}
        collapsedWidth="20px"
        width="400px"
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
