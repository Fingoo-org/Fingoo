'use client';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import AlertDialog from '../view/molocule/alert-dialog';

export default function MetadataDeleteDialog() {
  return (
    <AlertDialog dialogKey={DIALOG_KEY.METADATA_DELETE}>
      <AlertDialog.Title>Delete Metadata</AlertDialog.Title>
      <AlertDialog.Body>Are you sure you want to delete this metadata?</AlertDialog.Body>
      <AlertDialog.NegativeButton>Cancel</AlertDialog.NegativeButton>
      <AlertDialog.PositiveButton color={'red'}>Delete</AlertDialog.PositiveButton>
    </AlertDialog>
  );
}
