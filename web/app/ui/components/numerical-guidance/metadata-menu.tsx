'use client';
import DialogMenu from '../view/molocule/dialog-menu';
import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';
import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function MetadataMenu() {
  // Refactor: hook으로 교체 필요-> 비즈니스 훅은 아닌데 어디로 가야하는가? 비즈니스 훅인가?
  const isOpen = useDialogMenuStore((state) => state.isOpen);
  const position = useDialogMenuStore((state) => state.position);
  const action = useDialogMenuStore((state) => state.action);

  return (
    <DialogMenu isOpen={isOpen} position={position} onClose={action.close}>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
      <DialogMenu.Item icon={DotsHorizontalIcon}>Edit</DialogMenu.Item>
    </DialogMenu>
  );
}
