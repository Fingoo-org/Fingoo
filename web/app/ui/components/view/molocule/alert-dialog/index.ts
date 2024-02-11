import { AlertDialogRoot } from './alert-dialog-root';
import { AlertDialogTitle } from './alert-dialog-title';
import { AlertDialogBody } from './alert-dialog-body';
import { AlertDialogPositiveButton } from './alert-dialog-positive-button';
import { AlertDialogNegativeButton } from './alert-dialog-negative-button';

const AlertDialog = Object.assign(AlertDialogRoot, {
  Title: AlertDialogTitle,
  Body: AlertDialogBody,
  PositiveButton: AlertDialogPositiveButton,
  NegativeButton: AlertDialogNegativeButton,
});

export default AlertDialog;
