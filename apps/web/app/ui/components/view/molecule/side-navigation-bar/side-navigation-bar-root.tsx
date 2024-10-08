import { ChevronDoubleLeftIcon } from '@heroicons/react/solid';
import IconButton from '../../atom/icons/icon-button';
import { Sidebar } from 'react-pro-sidebar';
import React, { useState, useCallback } from 'react';
import FingooLogoImage from '@/public/assets/images/fingoo-logo.png';
import Image from 'next/image';
import { SideNavigationBarContent } from './side-navigation-bar-content';
import { filterChildrenByType } from '@/app/utils/helper';
import { SideNavigationBarMenu } from './side-navigation-bar-menu';
import { useResponsive } from '@/app/utils/hooks/use-responsive.hook';
import { useControlled } from '@/app/utils/hooks/use-controlled.hook';

type SideNavigationBarRootProps = {
  defaultValue?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
};

const getSideNavigationBarContent = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarContent);
};

const getSideNavigationBarMenu = (children: React.ReactNode) => {
  return filterChildrenByType(children, SideNavigationBarMenu);
};

export function SideNavigationBarRoot({
  defaultValue,
  children,
  collapsed: controlledCollapsed,
  onCollapse,
}: React.PropsWithChildren<SideNavigationBarRootProps>) {
  const [collapsed, setCollapsed] = useControlled({
    valueProps: controlledCollapsed,
    defaultValue: false,
  });

  const [selected, setSelected] = useState<string | undefined>(defaultValue);

  const { isBigScreen } = useResponsive();

  const sideNavWidth = isBigScreen ? '350px' : '300px';

  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);

    if (!collapsed) {
      setSelected(undefined);
    }

    onCollapse?.(!collapsed);
  }, [collapsed, setCollapsed, onCollapse]);

  const handleMenuSelect = useCallback(
    (value: string) => {
      if (collapsed) {
        setCollapsed(false);
        onCollapse?.(false);
      }
      setSelected(value);
    },
    [collapsed, setCollapsed, onCollapse],
  );

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
        width={sideNavWidth}
        collapsed={collapsed}
        backgroundColor={'#fff'}
        className="h-screen shadow-sm"
      >
        <CloseButton collapsed={collapsed} onCollapse={handleCollapse} />
        <div className="flex h-[93vh] flex-col">{selectedNavigationBarContent}</div>
      </Sidebar>
    </div>
  );
}

function CloseButton({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: () => void }) {
  return (
    <div className="mr-6 flex h-[7vh] flex-col items-end justify-center">
      <IconButton
        data-collapsed={collapsed}
        className="transition-transform duration-200 data-[collapsed=true]:rotate-180"
        color={'gray'}
        icon={ChevronDoubleLeftIcon}
        onClick={onCollapse}
      />
    </div>
  );
}
