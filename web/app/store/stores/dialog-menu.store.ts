import { create } from 'zustand';
import { storeResetFns } from './reset-store';

type Position = {
  x: number;
  y: number;
};

type DialogMenuState = {
  isOpen: {
    [key: string]: boolean | undefined;
  };
  position: Position;
  payload: unknown;
};

type DialogMenuAction = {
  close: (key: string) => void;
  open: (key: string) => void;
  setPosition: (position: Position) => void;
  setPayload: (payload: unknown) => void;
};

type DialogMenuStore = DialogMenuState & {
  action: DialogMenuAction;
};

const initialDialogMenuState: DialogMenuState = {
  isOpen: {},
  position: { x: 0, y: 0 },
  payload: undefined,
};

export const useDialogMenuStore = create<DialogMenuStore>((set) => {
  storeResetFns.add(() => set(initialDialogMenuState));
  return {
    ...initialDialogMenuState,
    action: {
      close: (key: string) =>
        set((state) => ({
          ...state,
          isOpen: {
            ...state.isOpen,
            [key]: false,
          },
        })),
      open: (key: string) =>
        set((state) => ({
          ...state,
          isOpen: {
            ...state.isOpen,
            [key]: true,
          },
        })),
      setPosition: (position: Position) => set({ position }),
      setPayload: (payload: unknown) => set({ payload }),
    },
  };
});
