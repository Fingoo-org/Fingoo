import { useDialogStore } from '@/app/store/stores/dialog.store';
import { DialogKey } from '@/app/utils/keys/dialog-key';

export function useAlertDialog(key: DialogKey) {
  const action = useDialogStore((state) => state.action);
  const isOpen = useDialogStore((state) => state.isOpen[key]);
  const payload = useDialogStore((state) => state.payload);

  const openDialogWithPayload = (payload?: unknown) => {
    action.setPayload(payload);
    action.open(key);
  };

  const closeDialog = () => {
    action.close(key);
  };

  return {
    isOpen,
    payload,
    openDialogWithPayload,
    closeDialog,
  };
}
