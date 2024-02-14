import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useAlertDialog } from './use-alert-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import Button from '../../atom/button/button';
import { ButtonVariant, Color } from '@/app/utils/style';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type AlertDialogPositiveButtonProps = {
  color?: Color;
  variant?: ButtonVariant;
  onClick?: (payload: unknown) => void;
} & NativeButtonType;

export function AlertDialogPositiveButton({
  children,
  color = 'blue',
  variant = 'primary',
  onClick,
  ...props
}: React.PropsWithChildren<AlertDialogPositiveButtonProps>) {
  const dialogKey = useContext(AlertDialogContext);
  const { payload, closeDialog } = useAlertDialog(dialogKey as DialogKey);

  const handleClick = () => {
    if (onClick) {
      onClick(payload);
    }
    closeDialog();
  };

  return (
    <Button {...props} color={color} variant={variant} onClick={handleClick} aria-label="Confirm" type="button">
      {children}
    </Button>
  );
}
