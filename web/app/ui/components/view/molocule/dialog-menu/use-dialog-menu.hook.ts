import { useRef } from 'react';
import { useDialogStore } from '@/app/store/stores/dialog.store';
import { DialogKey } from '@/app/utils/keys/dialog-key';

export function useDialogMenu(key: DialogKey) {
  const action = useDialogStore((state) => state.action);
  const isOpen = useDialogStore((state) => state.isOpen[key]);
  const position = useDialogStore((state) => state.position);
  const ref = useRef<HTMLButtonElement>(null);

  const openDialogMenu = (payload?: unknown) => {
    const position = ref.current?.getBoundingClientRect();

    if (!position) {
      return;
    }

    const newPosition = {
      x: position.left,
      y: position.top + position.height / 2,
    };

    action.setPayload(payload);
    action.setPosition(newPosition);
    action.open(key);
  };

  const closeDialogMenu = () => {
    action.close(key);
  };

  return {
    ref,
    isOpen,
    position,
    openDialogMenu,
    closeDialogMenu,
  };
}
