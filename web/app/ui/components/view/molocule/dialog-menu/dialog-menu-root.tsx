'use client';
import React from 'react';
import { Transition } from '@headlessui/react';
import { DialogMenuItem } from './dialog-menu-item';
import { DialogMenuContext } from './dialog-menu.context';
import { DialogMenuHeader } from './dialog-menu-header';
import { useDialogMenu } from './use-dialog-menu.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import { filterChildrenByType } from '@/app/utils/helper';
import { Size } from '@/app/utils/style';
import { DialogMenuSize } from './dialog-menu.style';
import { twMerge } from 'tailwind-merge';

type DialogMenuProps = {
  dialogKey: DialogKey;
  size?: Size;
};

const getDialogMenuHeader = (children: React.ReactNode) => {
  return filterChildrenByType(children, DialogMenuHeader);
};

const getDialogMenuItems = (children: React.ReactNode) => {
  return filterChildrenByType(children, DialogMenuItem);
};

export function DialogMenuRoot({ children, dialogKey, size = 'xs' }: React.PropsWithChildren<DialogMenuProps>) {
  const { isOpen, position, closeDialogMenu } = useDialogMenu(dialogKey);
  const dialogMenuHeader = getDialogMenuHeader(children);
  const dialogMenuItems = getDialogMenuItems(children);

  const dialogSize = DialogMenuSize[size];

  const handleOnClick = () => {
    closeDialogMenu();
  };

  return (
    <DialogMenuContext.Provider value={dialogKey}>
      <div className="fixed inset-0 pointer-events-none	overflow-hidden	z-50">
        <Transition as={React.Fragment} show={isOpen || false}>
          <div className="relative pointer-events-auto z-0">
            <div onClick={handleOnClick} className="fixed top-0 left-0 w-screen h-screen" />
            <div style={{ left: position.x, top: position.y }} className="fixed">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div
                  role="dialog"
                  className={twMerge(
                    'relative bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto mt-2 origin-top-left ring-1 ring-black/5 focus:outline-none',
                    dialogSize,
                  )}
                >
                  <div className="p-4">{dialogMenuHeader}</div>
                  {dialogMenuItems}
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition>
      </div>
    </DialogMenuContext.Provider>
  );
}
