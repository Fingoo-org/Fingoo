import { create } from 'zustand';
import { storeResetFns } from './reset-store';

type Position = {
  x: number;
  y: number;
};

type DialogState = {
  isOpen: {
    [key: string]: boolean | undefined;
  };
  position: Position;
  payload: unknown;
};

type DialogAction = {
  close: (key: string) => void;
  open: (key: string) => void;
  setPosition: (position: Position) => void;
  setPayload: (payload: unknown) => void;
};

type DialogStore = DialogState & {
  action: DialogAction;
};

const initialDialogState: DialogState = {
  isOpen: {},
  position: { x: 0, y: 0 },
  payload: undefined,
};

export const useDialogStore = create<DialogStore>((set) => {
  storeResetFns.add(() => set(initialDialogState));
  return {
    ...initialDialogState,
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
