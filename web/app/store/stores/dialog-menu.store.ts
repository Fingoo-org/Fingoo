// Refactor: DiagloagMenu가 아닌 도메인 컴포넌트 이름으로
import { create } from 'zustand';

type Position = {
  x: number;
  y: number;
};

type DialogMenuState = {
  isOpen: boolean;
  position: Position;
  payload: unknown;
};

type DialogMenuAction = {
  close: () => void;
  open: () => void;
  setPosition: (position: Position) => void;
  setPayload: (payload: unknown) => void;
};

type DialogMenuStore = DialogMenuState & {
  action: DialogMenuAction;
};

const initialDialogMenuState: DialogMenuState = {
  isOpen: false,
  position: { x: 0, y: 0 },
  payload: undefined,
};

export const useDialogMenuStore = create<DialogMenuStore>((set) => {
  return {
    ...initialDialogMenuState,
    action: {
      close: () => set({ isOpen: false }),
      open: () => set({ isOpen: true }),
      setPosition: (position: Position) => set({ position }),
      setPayload: (payload: unknown) => set({ payload }),
    },
  };
});
