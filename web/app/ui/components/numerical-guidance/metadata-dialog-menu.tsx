'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-menu-key';
import { useAlertDialog } from '../view/molocule/alert-dialog/use-alert-dialog.hook';

export default function MetadataDialogMenu() {
  const { openDialog } = useAlertDialog(DIALOG_KEY.METADATA_DELETE);

  return (
    <DialogMenu dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Item onClick={openDialog} icon={DotsHorizontalIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}
