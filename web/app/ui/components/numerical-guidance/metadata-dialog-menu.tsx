'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-menu-key';

export default function MetadataDialogMenu() {
  return (
    <DialogMenu dialogKey={DIALOG_KEY.METADATA_EDIT_MENU}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Delete</DialogMenu.Item>
    </DialogMenu>
  );
}
