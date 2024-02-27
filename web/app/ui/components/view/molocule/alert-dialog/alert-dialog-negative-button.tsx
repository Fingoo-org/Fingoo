import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useDialog } from '../../hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import Button from '../../atom/button/button';
import { ButtonVariant, Color } from '@/app/utils/style';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type AlertDialogNegativeButtonProps = {
  color?: Color;
  variant?: ButtonVariant;
  onClick?: () => void;
} & NativeButtonType;

export function AlertDialogNegativeButton({
  children,
  color = 'blue',
  variant = 'secondary',
  onClick,
  ...props
}: React.PropsWithChildren<AlertDialogNegativeButtonProps>) {
  const dialogKey = useContext(AlertDialogContext);
  const { closeDialog } = useDialog(dialogKey as DialogKey);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDialog();
  };

  return (
    <Button {...props} color={color} variant={variant} onClick={handleClick} type="button" aria-label="Cancel">
      {children}
    </Button>
  );
}
