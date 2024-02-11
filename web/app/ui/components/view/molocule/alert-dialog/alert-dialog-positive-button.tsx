import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useAlertDialog } from './use-alert-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import Button from '../../atom/button/button';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type AlertDialogPositiveButtonProps = {
  onClick?: () => void;
} & NativeButtonType;

export function AlertDialogPositiveButton({
  children,
  onClick,
  ...props
}: React.PropsWithChildren<AlertDialogPositiveButtonProps>) {
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
    <Button {...props} color={'blue'} onClick={handleClick} aria-label="Confirm" type="button">
      {children}
    </Button>
  );
}
