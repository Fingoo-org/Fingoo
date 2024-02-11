import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useAlertDialog } from './use-alert-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import Button from '../../atom/button/button';

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
    <Button {...props} color={'red'} variant={'secondary'} onClick={handleClick} type="button" aria-label="Cancel">
      {children}
    </Button>
  );
}
