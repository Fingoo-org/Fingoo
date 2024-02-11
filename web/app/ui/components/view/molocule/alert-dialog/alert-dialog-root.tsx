'use client';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import { Dialog, Transition } from '@headlessui/react';
import { useAlertDialog } from './use-alert-dialog.hook';
import React from 'react';
import { AlertDialogTitle } from './alert-dialog-title';
import { filterChildrenByType } from '@/app/utils/helper';
import { AlertDialogBody } from './alert-dialog-body';
import { AlertDialogPositiveButton } from './alert-dialog-positive-button';
import { AlertDialogNegativeButton } from './alert-dialog-negative-button';
import { AlertDialogContext } from './alert-dialog-context';

type DialogProps = {
  dialogKey: DialogKey;
};

const getAlertDialogTitle = (children: React.ReactNode) => {
  return filterChildrenByType(children, AlertDialogTitle).slice(0, 1);
};
const getAlertDialogBody = (children: React.ReactNode) => {
  return filterChildrenByType(children, AlertDialogBody);
};
const getAlertDialogPositiveButton = (children: React.ReactNode) => {
  return filterChildrenByType(children, AlertDialogPositiveButton).slice(0, 1);
};
const getAlertDialogNegativeButton = (children: React.ReactNode) => {
  return filterChildrenByType(children, AlertDialogNegativeButton).slice(0, 1);
};

export function AlertDialogRoot({ children, dialogKey }: React.PropsWithChildren<DialogProps>) {
  const { isOpen, closeDialog } = useAlertDialog(dialogKey);
  const alertDialogTitle = getAlertDialogTitle(children);
  const alertDialogBody = getAlertDialogBody(children);
  const alertDialogPositiveButton = getAlertDialogPositiveButton(children);
  const alertDialogNegativeButton = getAlertDialogNegativeButton(children);

  const handleClose = () => {
    closeDialog();
  };

  return (
    <AlertDialogContext.Provider value={dialogKey}>
      <Transition show={isOpen || false} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {alertDialogTitle}
                  {alertDialogBody}

                  <div className="flex mt-4 flex-row-reverse gap-1">
                    {alertDialogPositiveButton}
                    {alertDialogNegativeButton}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AlertDialogContext.Provider>
  );
}
