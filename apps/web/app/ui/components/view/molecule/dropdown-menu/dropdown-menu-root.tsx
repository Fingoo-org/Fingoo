import { Menu, Transition } from '@headlessui/react';
import React from 'react';
import { DropdownMenuButton } from './dropdown-menu-button';
import { DropdownMenuItem } from './dropdown-menu-item';
import { filterChildrenByType } from '@/app/utils/helper';

function getDropdownMenuButton(children: React.ReactNode) {
  return filterChildrenByType(children, DropdownMenuButton);
}

function getDropdownMenuItems(children: React.ReactNode) {
  return filterChildrenByType(children, DropdownMenuItem);
}

export function DropdownMenuRoot({ children }: React.PropsWithChildren) {
  const dropdownMenuButton = getDropdownMenuButton(children);
  const dropdownMenuItems = getDropdownMenuItems(children);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {dropdownMenuButton}
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-2 w-32 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          {dropdownMenuItems}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
