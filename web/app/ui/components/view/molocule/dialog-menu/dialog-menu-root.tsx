'use client';
import React from 'react';
import { Transition } from '@headlessui/react';
import { DialogMenuItem } from './dialog-menu-item';
import { DialogMenuContext } from './dialog-menu.context';
import { DialogMenuHeader } from './dialog-menu-header';
import { useDialog } from '../../hooks/use-dialog.hook';
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
  const { isOpen, position, closeDialog } = useDialog(dialogKey);
  const dialogMenuHeader = getDialogMenuHeader(children);
  const dialogMenuItems = getDialogMenuItems(children);

  const dialogSize = DialogMenuSize[size];

  const handleOnClick = () => {
    closeDialog();
  };

  return (
    <DialogMenuContext.Provider value={dialogKey}>
      <div className="pointer-events-none fixed inset-0	z-50	overflow-hidden">
        <Transition as={React.Fragment} show={isOpen || false}>
          <div className="pointer-events-auto relative z-0">
            <div onClick={handleOnClick} className="fixed left-0 top-0 h-screen w-screen" />
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
                    'pointer-events-auto relative mt-2 origin-top-left overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none',
                    dialogSize,
                  )}
                >
                  {dialogMenuHeader.length !== 0 ? <div className="px-3 pb-1 pt-4">{dialogMenuHeader}</div> : null}
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
