import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';
import { useDialogMenu } from '@/app/ui/components/view/hooks/use-dialog-menu.hook';

const KEY = 'metadata-menu';

export function useMetadataMenu() {
  const position = useDialogMenuStore((state) => state.position);
  const { ref, isOpen, openDialogMenu, closeDialogMenu } = useDialogMenu(KEY);

  return {
    ref,
    isOpen,
    position,
    openDialogMenu,
    closeDialogMenu,
  };
}
