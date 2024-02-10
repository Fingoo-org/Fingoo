'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { DIALOG_MENU_KEY } from '@/app/utils/keys/dialog-menu-key';

export default function MetadataDialogMenu() {
  return (
    <DialogMenu dialogKey={DIALOG_MENU_KEY.metadataEditMenu}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Delete</DialogMenu.Item>
    </DialogMenu>
  );
}
