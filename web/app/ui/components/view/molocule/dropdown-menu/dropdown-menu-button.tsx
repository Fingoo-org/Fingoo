import { Menu } from '@headlessui/react';
import React from 'react';

export default function DropdownMenuButton({ children }: React.PropsWithChildren) {
  return <Menu.Button as={React.Fragment}>{children}</Menu.Button>;
}
