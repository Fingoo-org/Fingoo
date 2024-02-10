'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function MetadataDialogMenu() {
  return (
    <DialogMenu dialogKey={'metadata'}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
    </DialogMenu>
  );
}
