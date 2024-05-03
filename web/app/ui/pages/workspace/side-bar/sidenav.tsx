'use client';
import { useState } from 'react';
import IndicatorBoardToolbar from './indicator-board-toolbar';
import { Sidebar } from 'react-pro-sidebar';
import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../../components/view/atom/icons/icon-button';
import ChatCard from '@/app/ui/components/view/molecule/chat-card';
import Chat from '@/app/ui/components/linguistic-guidance/chat';

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="h-full bg-white">
      <Sidebar collapsedWidth="120px" width="400px" collapsed={collapsed} className="h-full">
        <div className="relative">
          <div className="absolute right-0">
            <IconButton
              data-collapsed={collapsed}
              className="transition-transform duration-200 data-[collapsed=true]:rotate-180"
              color={'gray'}
              icon={ChevronDoubleLeftIcon}
              onClick={handleCollapse}
            />
          </div>
        </div>
        <div className="flex h-full flex-col">
          <SideNavHeader />
          <div className="flex-auto">
            <div className="flex h-full flex-col">
              {!collapsed ? (
                <div className="grow">
                  <IndicatorBoardToolbar />
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex h-[500px] flex-col justify-end pb-6">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

function SideNavHeader() {
  return (
    <div className="ml-8 flex h-[10%] items-center">
      <div className="mr-8 h-14 w-14 min-w-14 rounded-lg bg-gray-300"></div>
      <p className="truncate text-xl">Fingoo</p>
    </div>
  );
}
