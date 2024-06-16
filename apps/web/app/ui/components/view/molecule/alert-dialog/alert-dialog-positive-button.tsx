import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useDialog } from '../../../../../utils/hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import AchromaticButton from '../../atom/button/achromatic-button';

type NativeButtonType = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

type AlertDialogPositiveButtonProps = {
  variant?: 'default' | 'destructive';
  onClick?: (payload: unknown) => void;
} & NativeButtonType;

export function AlertDialogPositiveButton({
  children,
  variant = 'default',
  onClick,
  ...props
}: React.PropsWithChildren<AlertDialogPositiveButtonProps>) {
  const dialogKey = useContext(AlertDialogContext);
  const { payload, closeDialog } = useDialog(dialogKey as DialogKey);

  const handleClick = () => {
    if (onClick) {
      onClick(payload);
    }
    closeDialog();
  };

  return (
    <AchromaticButton {...props} variant={variant} onClick={handleClick} aria-label="Confirm" type="button">
      {children}
    </AchromaticButton>
  );
}
