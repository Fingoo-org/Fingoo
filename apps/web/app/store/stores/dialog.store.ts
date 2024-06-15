import { create } from 'zustand';
import { storeResetFns } from './reset-store';

export type Position = {
  left: number;
  top: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
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
  position: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  },
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
