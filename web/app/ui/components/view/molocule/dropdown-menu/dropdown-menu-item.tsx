import { Menu } from '@headlessui/react';
import React from 'react';

type DropdownMenuItemProps = {
  icon: React.ElementType;
};

export function DropdownMenuItem({ children, icon }: React.PropsWithChildren<DropdownMenuItemProps>) {
  const Icon = icon;
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? 'bg-violet-500 text-white' : 'text-gray-900'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {active ? (
            <Icon className="mr-2 h-5 w-5 text-violet-300" aria-hidden="true" />
          ) : (
            <Icon className="mr-2 h-5 w-5 text-violet-400" aria-hidden="true" />
          )}
          {children}
        </button>
      )}
    </Menu.Item>
  );
}
