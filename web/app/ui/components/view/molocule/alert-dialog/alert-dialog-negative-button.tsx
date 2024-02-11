import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useAlertDialog } from './use-alert-dialog.hook';
import { DialogMenuKey } from '@/app/utils/keys/dialog-menu-key';

type AlertDialogNegativeButtonProps = {
  onClick?: () => void;
};

export function AlertDialogNegativeButton({
  children,
  onClick,
}: React.PropsWithChildren<AlertDialogNegativeButtonProps>) {
  const dialogKey = useContext(AlertDialogContext);
  const { closeDialog } = useAlertDialog(dialogKey as DialogMenuKey);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDialog();
  };

  // Refactor: 버튼 디자인 시스템화
  return (
    <button
      onClick={handleClick}
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
