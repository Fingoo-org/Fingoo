import { Dialog } from '@headlessui/react';

export function AlertDialogTitle({ children }: React.PropsWithChildren) {
  return (
    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
      {children}
    </Dialog.Title>
  );
}
