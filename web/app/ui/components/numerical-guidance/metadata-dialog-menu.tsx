'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { useMetadataDialogMenu } from './hooks/use-metadata-dialog-menu.hook';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function MetadataDialogMenu() {
  const { isOpen, position, closeDialogMenu } = useMetadataDialogMenu();

  return (
    <DialogMenu isOpen={isOpen || false} position={position} onClose={closeDialogMenu}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
    </DialogMenu>
  );
}
