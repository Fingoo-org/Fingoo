import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useAlertDialog } from './use-alert-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type AlertDialogNegativeButtonProps = {
  onClick?: () => void;
} & NativeButtonType;

export function AlertDialogNegativeButton({
  children,
  onClick,
  ...props
}: React.PropsWithChildren<AlertDialogNegativeButtonProps>) {
  const dialogKey = useContext(AlertDialogContext);
  const { closeDialog } = useAlertDialog(dialogKey as DialogKey);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDialog();
  };

  // Refactor: 버튼 디자인 시스템화
  return (
    <button
      {...props}
      onClick={handleClick}
      type="button"
      aria-label="Cancel"
      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
