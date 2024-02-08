import { create } from 'zustand';

type DialogMenuState = {
  isOpen: boolean;
};

type DialogMenuAction = {
  close: () => void;
  open: () => void;
};

type DialogMenuStore = DialogMenuState & {
  action: DialogMenuAction;
};

const initialDialogMenuState: DialogMenuState = {
  isOpen: false,
};

export const useDialogMenuStore = create<DialogMenuStore>((set) => {
  return {
    ...initialDialogMenuState,
    action: {
      close: () => set({ isOpen: false }),
      open: () => set({ isOpen: true }),
    },
  };
});
