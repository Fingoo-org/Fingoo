import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../atom/icons/icon-button';
import { Sidebar } from 'react-pro-sidebar';
import { useState } from 'react';
import FingooLogoImage from '@/public/assets/images/fingoo-logo.png';
import Image from 'next/image';
import { DashboardIcon } from '@radix-ui/react-icons';
import { cn } from '@/app/utils/style';
import { SideNavigationBarContent } from './side-navigation-bar-content';
import { filterChildrenByType } from '@/app/utils/helper';
import React from 'react';
import { SideNavigationBarMenu } from './side-navigation-bar-menu';

type SideNavigationBarRootProps = {};

const getSideNavigationBarContent = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarContent);
};

const getSideNavigationBarMenu = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarMenu);
};

export function SideNavigationBarRoot({ children }: React.PropsWithChildren<SideNavigationBarRootProps>) {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<string | undefined>('dashboard');

  const navigationBarContents = getSideNavigationBarContent(children);

  const navigationBarMenus = getSideNavigationBarMenu(children);

  const selectedNavigationBarContent = navigationBarContents.find(
    (c) => React.isValidElement(c) && c.props.value === selected,
  );

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed === true) {
      setSelected(undefined);
    }
  };

  const handleMenuSelect = (value: string) => {
    if (collapsed === true) {
      setCollapsed(false);
    }
    setSelected(value);
  };

  return (
    <div className="flex h-screen bg-white">
      <div id="navigator" className="h-screen w-20 bg-fingoo-gray-6">
        <div id="logo" className="my-8 flex justify-center">
          <Image src={FingooLogoImage} alt="Fingoo Logo" width={50} height={50} />
        </div>
        <div id="menu" className="my-20 ml-3 flex flex-col space-y-6">
          {navigationBarMenus.map((menu) => {
            if (!React.isValidElement(menu)) {
              return;
            }

            return React.cloneElement(menu as React.ReactElement, {
              onClick: handleMenuSelect,
              selected: selected === menu.props.value,
            });
          })}
        </div>
      </div>
      <Sidebar
        transitionDuration={500}
        collapsedWidth="0"
        width="350px"
        collapsed={collapsed}
        backgroundColor={'#fff'}
        className="h-screen "
      >
        <CloseButton collapsed={collapsed} onCollapse={handleCollapse} />
        <div className="flex h-screen flex-col">{selectedNavigationBarContent}</div>
      </Sidebar>
    </div>
  );
}

function CloseButton({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: () => void }) {
  return (
    <div className="relative">
      <div className="absolute right-0">
        <IconButton
          data-collapsed={collapsed}
          className="transition-transform duration-200 data-[collapsed=true]:rotate-180"
          color={'gray'}
          icon={ChevronDoubleLeftIcon}
          onClick={onCollapse}
        />
      </div>
    </div>
  );
}

type MenuIcon = {
  value: string;
  selected: boolean;
  icon: React.ElementType;
  onClick?: (value: string) => void;
};

function MenuIcon({ value, selected, icon, onClick }: MenuIcon) {
  const Icon = icon;

  const handleClick = () => {
    onClick?.(value);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'h-14 w-14  transition-all duration-200 ease-in-out	',
        selected ? 'w-full rounded-l-lg rounded-r-none bg-white ' : '',
      )}
    >
      <div
        className={cn(
          'transition-color flex h-14 w-14 items-center rounded-full ease-in-out ',
          selected ? 'hover:bg-transparent' : ' hover:bg-[#575757]',
        )}
      >
        <Icon className={cn('ml-3 h-8 w-8 ', selected ? 'text-black' : 'text-white')} />
      </div>
    </button>
  );
}
