import React, { useContext } from 'react';
import { AlertDialogContext } from './alert-dialog-context';
import { useDialog } from '../../../../../utils/hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import AchromaticButton from '../../atom/button/achromatic-button';

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
  const { closeDialog } = useDialog(dialogKey as DialogKey);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDialog();
  };

  return (
    <AchromaticButton {...props} variant={'ghost'} onClick={handleClick} type="button" aria-label="Cancel">
      {children}
    </AchromaticButton>
  );
}
