'use client';
import DialogMenu from '../../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useAlertDialog } from '../../view/molocule/alert-dialog/use-alert-dialog.hook';
import TinyInput from '../../view/atom/tiny-input/tiny-input';

export default function MetadataDialogMenu() {
  const { openDialogWithPayload } = useAlertDialog(DIALOG_KEY.METADATA_DELETE);

  return (
    <DialogMenu size={'md'} dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Header>
        <TinyInput />
      </DialogMenu.Header>
      <DialogMenu.Item role={'menuitem'} aria-label="Delete" onClick={openDialogWithPayload} icon={DotsHorizontalIcon}>
        Delete
      </DialogMenu.Item>
    </DialogMenu>
  );
}
