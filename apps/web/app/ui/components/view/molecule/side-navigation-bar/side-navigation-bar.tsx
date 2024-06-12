import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../atom/icons/icon-button';
import { Sidebar } from 'react-pro-sidebar';
import { useState } from 'react';
import FingooLogoImage from '@/public/assets/images/fingoo-logo.png';
import Image from 'next/image';
import { DashboardIcon } from '@radix-ui/react-icons';

export default function SideNavigationBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState('dashboard');

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="h-screen w-20 bg-fingoo-gray-6">
        <div id="logo" className="my-8 flex justify-center">
          <Image src={FingooLogoImage} alt="Fingoo Logo" width={50} height={50} />
        </div>
        <div id="menu" className="my-20 flex flex-col items-center">
          <MenuIcon onClick={handleMenuSelect} value="dashboard" active={selected === 'dashboard'} />
          <MenuIcon onClick={handleMenuSelect} value="name" active={selected === 'name'} />
        </div>
      </div>
      <Sidebar collapsedWidth="10px" width="350px" collapsed={collapsed} className="h-screen">
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

type MenuIcon = {
  value: string;
  active: boolean;
  onClick?: (value: string) => void;
};

function MenuIcon({ value, active, onClick }: MenuIcon) {
  const handleClick = () => {
    onClick?.(value);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-16 w-16 items-center justify-center rounded-full transition-colors ease-in-out hover:bg-[#575757]"
    >
      <DashboardIcon className="h-8 w-8 text-white" />
    </button>
  );
}
