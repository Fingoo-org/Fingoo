import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../atom/icons/icon-button';
import { Sidebar } from 'react-pro-sidebar';
import { useState } from 'react';

export default function SideNavigationBar() {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="h-screen bg-white">
      <Sidebar collapsedWidth="120px" width="400px" collapsed={collapsed} className="h-screen">
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
        <div className="flex h-screen flex-col">
          <SideNavHeader />
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
