import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

export const splitScreens = ['full', 'vertical', 'square'] as const;
export type SplitScreen = (typeof splitScreens)[number];

export const intervals = ['day', 'week', 'month', 'year'] as const;
export type Interval = (typeof intervals)[number];

export const dateRange = ['default', '1Y', '5Y', '10Y', 'MAX'] as const;
export type DateRange = (typeof dateRange)[number];

type IndicatorBoardInfo = {
  metadataId: string;
  interval: Interval;
  isAdvancedChart: boolean;
  dateRange: DateRange;
};

type IndicatorBoardState = {
  splitScreen: SplitScreen;
  indicatorBoardInfos: IndicatorBoardInfo[];
  activeDragMetadataId: string | null;
};

type IndicatorBoardAction = {
  setSplitScreen: (splitScreen: SplitScreen) => void;
  addIndicatorBoardInfo: (metadataId: string) => void;
  deleteIndicatorBoardInfo: (metadataId: string) => void;
  updateIndicatorBoardInfo: (metadataId: string, newData: Partial<IndicatorBoardInfo>) => void;
  checkMetadataInIndicatorBoard: (metadataId: string) => boolean;
  clearIndicatorBoardInfos: () => void;
  sliceIndicatorBoardInfos: (length: number) => IndicatorBoardInfo[];
  setIndicatorBoardInfos: (infos: IndicatorBoardInfo[]) => void;
  setActiveDragMetadataId: (metadataId: string | null) => void;
};

type IndicatorBoardStore = IndicatorBoardState & {
  actions: IndicatorBoardAction;
};

const initialIndicatorBoardState: IndicatorBoardState = {
  splitScreen: 'full',
  indicatorBoardInfos: [],
  activeDragMetadataId: null,
};

export const useIndicatorBoardStore = create<IndicatorBoardStore>((set, get) => {
  storeResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
    actions: {
      setSplitScreen: (splitScreen) => set({ splitScreen }),
      addIndicatorBoardInfo: (metadataId) => {
        set((state) => ({
          indicatorBoardInfos: [
            ...state.indicatorBoardInfos,
            { metadataId, interval: 'week', isAdvancedChart: false, dateRange: 'default' },
          ],
        }));
      },
      deleteIndicatorBoardInfo: (metadataId) => {
        set((state) => ({
          indicatorBoardInfos: state.indicatorBoardInfos.filter((info) => info.metadataId !== metadataId),
        }));
      },
      updateIndicatorBoardInfo: (metadataId, newData) => {
        set((state) => ({
          indicatorBoardInfos: state.indicatorBoardInfos.map((info) =>
            info.metadataId === metadataId ? { ...info, ...newData } : info,
          ),
        }));
      },
      checkMetadataInIndicatorBoard: (metadataId) => {
        return get().indicatorBoardInfos.some((info) => info.metadataId === metadataId);
      },
      clearIndicatorBoardInfos: () => set({ indicatorBoardInfos: [] }),
      sliceIndicatorBoardInfos: (length) => get().indicatorBoardInfos.slice(0, length),
      setIndicatorBoardInfos: (infos) => set({ indicatorBoardInfos: infos }),
      setActiveDragMetadataId: (metadataId) => set({ activeDragMetadataId: metadataId }),
    },
  };
});
