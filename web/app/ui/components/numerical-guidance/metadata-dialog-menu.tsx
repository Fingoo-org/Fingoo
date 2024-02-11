'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useAlertDialog } from '../view/molocule/alert-dialog/use-alert-dialog.hook';

export default function MetadataDialogMenu() {
  const { openDialog } = useAlertDialog(DIALOG_KEY.METADATA_DELETE);

  return (
    <DialogMenu dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Item role={'menuitem'} aria-label="Delete" onClick={openDialog} icon={DotsHorizontalIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}
