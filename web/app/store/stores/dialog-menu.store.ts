// Refactor: DiagloagMenu가 아닌 도메인 컴포넌트 이름으로
import { create } from 'zustand';

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
  enroll: (key: string) => void;
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
  return {
    ...initialDialogMenuState,
    action: {
      enroll: (key: string) => {
        set((state) => ({
          ...state,
          isOpen: {
            ...state.isOpen,
            [key]: false,
          },
        }));
      },
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
