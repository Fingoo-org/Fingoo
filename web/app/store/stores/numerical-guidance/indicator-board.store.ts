import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

export const splitScreens = ['full', 'vertical', 'square'] as const;
export type SplitScreen = (typeof splitScreens)[number];

export const intervals = ['day', 'week', 'month', 'year'] as const;
export type Interval = (typeof intervals)[number];

type IndicatorBoardInfo = {
  metadataId: string;
  interval: Interval;
  isAdvancedChart: boolean;
};

type IndicatorBoardState = {
  splitScreen: SplitScreen;
  indicatorBoardInfos: IndicatorBoardInfo[];
};

type IndicatorBoardAction = {
  setSplitScreen: (splitScreen: SplitScreen) => void;
  addIndicatorBoardInfo: (metadataId: string) => void;
  deleteIndicatorBoardInfo: (metadataId: string) => void;
  updateIndicatorBoardInfo: (newData: Partial<IndicatorBoardInfo>) => void;
};

type IndicatorBoardStore = IndicatorBoardState & {
  actions: IndicatorBoardAction;
};

const initialIndicatorBoardState: IndicatorBoardState = {
  splitScreen: 'full',
  indicatorBoardInfos: [],
};

export const useIndicatorBoardStore = create<IndicatorBoardStore>((set) => {
  storeResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
    actions: {
      setSplitScreen: (splitScreen) => set({ splitScreen }),
      addIndicatorBoardInfo: (metadataId) => {
        set((state) => ({
          indicatorBoardInfos: [...state.indicatorBoardInfos, { metadataId, interval: 'day', isAdvancedChart: false }],
        }));
      },
      deleteIndicatorBoardInfo: (metadataId) => {
        set((state) => ({
          indicatorBoardInfos: state.indicatorBoardInfos.filter((info) => info.metadataId !== metadataId),
        }));
      },
      updateIndicatorBoardInfo: (newData) => {
        set((state) => ({
          indicatorBoardInfos: state.indicatorBoardInfos.map((info) =>
            info.metadataId === newData.metadataId ? { ...info, ...newData } : info,
          ),
        }));
      },
    },
  };
});
