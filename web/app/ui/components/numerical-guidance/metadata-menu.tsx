'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function MetadataMenu() {
  const isOpen = useDialogMenuStore((state) => state.isOpen);
  const position = useDialogMenuStore((state) => state.position);
  const action = useDialogMenuStore((state) => state.action);
  console.log(isOpen);

  return (
    <DialogMenu isOpen={isOpen} position={position} onClose={action.close}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
    </DialogMenu>
  );
}
