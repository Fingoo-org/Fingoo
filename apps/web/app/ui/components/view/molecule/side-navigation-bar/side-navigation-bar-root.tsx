import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../atom/icons/icon-button';
import { Sidebar } from 'react-pro-sidebar';
import { useState } from 'react';
import FingooLogoImage from '@/public/assets/images/fingoo-logo.png';
import Image from 'next/image';
import { SideNavigationBarContent } from './side-navigation-bar-content';
import { filterChildrenByType } from '@/app/utils/helper';
import React from 'react';
import { SideNavigationBarMenu } from './side-navigation-bar-menu';

type SideNavigationBarRootProps = {
  defaultValue?: string;
};

const getSideNavigationBarContent = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarContent);
};

const getSideNavigationBarMenu = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarMenu);
};

export function SideNavigationBarRoot({ defaultValue, children }: React.PropsWithChildren<SideNavigationBarRootProps>) {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(defaultValue);

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

  const navigationBarContents = getSideNavigationBarContent(children);

  const selectedNavigationBarContent = navigationBarContents.find(
    (c) => React.isValidElement(c) && c.props.value === selected,
  );

  const navigationBarMenus = getSideNavigationBarMenu(children).map((menu) => {
    if (!React.isValidElement(menu)) {
      return;
    }

    return React.cloneElement(menu as React.ReactElement, {
      onClick: handleMenuSelect,
      selected: selected === menu.props.value,
    });
  });

  return (
    <div className="flex h-screen bg-white">
      <div id="navigation" className="h-screen w-20 bg-fingoo-gray-6">
        <div id="logo" className="my-8 flex justify-center">
          <Image src={FingooLogoImage} alt="Fingoo Logo" width={50} height={50} />
        </div>
        <div id="menu" className="my-20 ml-3 flex flex-col space-y-6">
          {navigationBarMenus}
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
