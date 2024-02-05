import { create } from 'zustand';

const storeResetFns = new Set<() => void>();

export const resetAllStore = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

type Interval = 'day' | 'week' | 'month' | 'year';

type NumericalGuidanceState = {
  boardId: string;
  selectedMetadataId: string | null;
  interval: Interval;
};

type NumericalGuidanceAction = {
  selectMetadata: (MetadataId: string | null) => void;
};

type NumericalGuidanceStore = NumericalGuidanceState & {
  actions: NumericalGuidanceAction;
};

const initialNumericalGuidanceState: NumericalGuidanceState = {
  boardId: 'test',
  selectedMetadataId: null,
  interval: 'day',
};

export const useNumericalGuidanceStore = create<NumericalGuidanceStore>()((set) => {
  storeResetFns.add(() => set(initialNumericalGuidanceState));
  return {
    ...initialNumericalGuidanceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
    },
  };
});
