// Refactor: DiagloagMenu가 아닌 도메인 컴포넌트 이름으로
import { create } from 'zustand';

type Position = {
  x: number;
  y: number;
};

type DialogMenuState = {
  isOpen: boolean;
  position: Position;
};

type DialogMenuAction = {
  close: () => void;
  open: () => void;
  setPosition: (position: Position) => void;
};

type DialogMenuStore = DialogMenuState & {
  action: DialogMenuAction;
};

const initialDialogMenuState: DialogMenuState = {
  isOpen: false,
  position: { x: 0, y: 0 },
};

export const useDialogMenuStore = create<DialogMenuStore>((set) => {
  return {
    ...initialDialogMenuState,
    action: {
      close: () => set({ isOpen: false }),
      open: () => set({ isOpen: true }),
      setPosition: (position: Position) => set({ position: { ...position } }),
    },
  };
});
