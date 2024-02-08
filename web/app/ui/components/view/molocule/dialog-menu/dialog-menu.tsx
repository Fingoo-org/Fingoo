'use client';

import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';
import { Transition } from '@headlessui/react';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import React from 'react';

export default function DialogMenu() {
  const isOpen = useDialogMenuStore((state) => state.isOpen);
  const position = useDialogMenuStore((state) => state.position);
  const action = useDialogMenuStore((state) => state.action);

  return (
    <>
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
          <div
            onClick={() => {
              action.close();
            }}
            className="fixed top-0 left-0 w-screen h-screen"
          />
          <div style={{ left: position.x, top: position.y }} className="fixed w-56">
            <div
              role="dialog"
              className="relative bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto w-32 mt-2 origin-top-left ring-1 ring-black/5 focus:outline-none"
            >
              <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
              <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
              <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
              <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

type DialogMenuItemProps = {
  icon: React.ElementType;
};

function DialogMenuItem({ children, icon }: React.PropsWithChildren<DialogMenuItemProps>) {
  const Icon = icon;

  return (
    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white">
      <Icon className="w-5 h-5 mr-2 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}
