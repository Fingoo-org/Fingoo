import { create } from 'zustand';
import { storeResetFns } from './reset-store';

type Interval = 'day' | 'week' | 'month' | 'year';

type NumericalGuidanceState = {
  boardId: string;
  selectedMetadataId: string | undefined;
  interval: Interval;
  isAdvancedChart: boolean;
  tabIndex: number;
};

type NumericalGuidanceAction = {
  selectMetadata: (MetadataId: string | undefined) => void;
  setIsAdvancedChart: (isAdvancedChart: boolean) => void;
  setTabIndex: (tabIndex: number) => void;
};

type NumericalGuidanceStore = NumericalGuidanceState & {
  actions: NumericalGuidanceAction;
};

const initialNumericalGuidanceState: NumericalGuidanceState = {
  boardId: 'test',
  selectedMetadataId: undefined,
  interval: 'day',
  isAdvancedChart: false,
  tabIndex: 2,
};

export const useNumericalGuidanceStore = create<NumericalGuidanceStore>()((set) => {
  storeResetFns.add(() => set(initialNumericalGuidanceState));
  return {
    ...initialNumericalGuidanceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
      setIsAdvancedChart: (isAdvancedChart) => set({ isAdvancedChart }),
      setTabIndex: (tabIndex) => set({ tabIndex }),
    },
  };
});
