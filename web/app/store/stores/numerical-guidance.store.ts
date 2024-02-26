import { create } from 'zustand';
import { storeResetFns } from './reset-store';

type Interval = 'day' | 'week' | 'month' | 'year';

type NumericalGuidanceState = {
  boardId: string;
  selectedMetadataId: string | undefined;
  interval: Interval;
  isAdvancedChart: boolean;
};

type NumericalGuidanceAction = {
  selectMetadata: (MetadataId: string | undefined) => void;
  setIsAdvancedChart: (isAdvancedChart: boolean) => void;
};

type NumericalGuidanceStore = NumericalGuidanceState & {
  actions: NumericalGuidanceAction;
};

const initialNumericalGuidanceState: NumericalGuidanceState = {
  boardId: 'test',
  selectedMetadataId: undefined,
  interval: 'day',
  isAdvancedChart: false,
};

export const useNumericalGuidanceStore = create<NumericalGuidanceStore>()((set) => {
  storeResetFns.add(() => set(initialNumericalGuidanceState));
  return {
    ...initialNumericalGuidanceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
      setIsAdvancedChart: (isAdvancedChart) => set({ isAdvancedChart }),
    },
  };
});
