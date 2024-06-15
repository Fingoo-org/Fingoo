import { useRef } from 'react';
import { useDialogStore } from '@/app/store/stores/dialog.store';
import { DialogKey } from '@/app/utils/keys/dialog-key';

export function useDialog(key: DialogKey) {
  const action = useDialogStore((state) => state.action);
  const payload = useDialogStore((state) => state.payload);
  const isOpen = useDialogStore((state) => state.isOpen[key]);
  const position = useDialogStore((state) => state.position);
  const dialogPositionRef = useRef<HTMLButtonElement>(null);

  const openDialogWithPayload = (payload?: unknown) => {
    if (dialogPositionRef.current) {
      const position = dialogPositionRef.current?.getBoundingClientRect();

      if (position) {
        action.setPosition(position);
      }
    }

    action.setPayload(payload);
    action.open(key);
  };

  const closeDialog = () => {
    action.close(key);
  };

  return {
    dialogPositionRef,
    isOpen,
    position,
    payload,
    openDialogWithPayload,
    closeDialog,
  };
}
