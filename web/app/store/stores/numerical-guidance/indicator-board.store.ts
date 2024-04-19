import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

export const splitScreens = ['full', 'vertical', 'square'] as const;
export type SplitScreen = (typeof splitScreens)[number];

type IndicatorBoardState = {
  splitScreen: SplitScreen;
  viewedIndicatorBoardMetadataIds: string[];
};

type IndicatorBoardAction = {
  setSplitScreen: (splitScreen: SplitScreen) => void;
};

type IndicatorBoardStore = IndicatorBoardState & {
  actions: IndicatorBoardAction;
};

const initialIndicatorBoardState: IndicatorBoardState = {
  splitScreen: 'full',
  viewedIndicatorBoardMetadataIds: [],
};

export const useIndicatorBoardStore = create<IndicatorBoardStore>((set) => {
  storeResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
    actions: {
      setSplitScreen: (splitScreen) => set({ splitScreen }),
    },
  };
});
