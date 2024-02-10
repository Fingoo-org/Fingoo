'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { useMetadataMenu } from './hooks/use-metadata-menu.hook';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function MetadataMenu() {
  const { isOpen, position, closeDialogMenu } = useMetadataMenu();

  return (
    <DialogMenu isOpen={isOpen || false} position={position} onClose={closeDialogMenu}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
    </DialogMenu>
  );
}
