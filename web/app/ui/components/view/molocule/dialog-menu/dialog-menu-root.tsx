'use client';
import React from 'react';
import { Transition } from '@headlessui/react';
import { DialogMenuItem } from './dialog-menu-item';
import { DialogMenuContext } from './dialog-menu.context';

type DialogMenuProps = {
  isOpen: boolean;
  position?: { x: number; y: number };
  onClose: () => void;
};

const getDialogMenuItems = (children: React.ReactNode) => {
  const childArray = React.Children.toArray(children);
  return childArray.filter((child) => {
    return React.isValidElement(child) && child.type === DialogMenuItem;
  });
};

export function DialogMenuRoot({ children, isOpen, position, onClose }: React.PropsWithChildren<DialogMenuProps>) {
  const dialogMenuItems = getDialogMenuItems(children);

  const handleOnClick = () => {
    onClose();
  };

  return (
    <DialogMenuContext.Provider
      value={{
        onClose,
      }}
    >
      <Transition
        as={React.Fragment}
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="relative pointer-events-auto z-0">
          <div onClick={handleOnClick} className="fixed top-0 left-0 w-screen h-screen" />
          <div style={position && { left: position.x, top: position.y }} className="fixed w-56">
            <div
              role="dialog"
              className="relative bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto w-32 mt-2 origin-top-left ring-1 ring-black/5 focus:outline-none"
            >
              {dialogMenuItems}
            </div>
          </div>
        </div>
      </Transition>
    </DialogMenuContext.Provider>
  );
}
