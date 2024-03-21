import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

export const intervals = ['day', 'week', 'month', 'year'] as const;
export type Interval = (typeof intervals)[number];

type WorkspaceState = {
  boardId: string;
  selectedMetadataId: string | undefined;
  interval: Interval;
  isAdvancedChart: boolean;
  tabIndex: string;
  selectedCustomForecastIndicatorId: string | undefined;
};

type WorkspaceAction = {
  selectMetadata: (MetadataId: string | undefined) => void;
  setIsAdvancedChart: (isAdvancedChart: boolean) => void;
  setTabIndex: (tabIndex: string) => void;
  selectCustomForecastIndicatorById: (customForecastIndicatorId: string | undefined) => void;
  setInterval: (interval: Interval) => void;
};

type WorkspaceStore = WorkspaceState & {
  actions: WorkspaceAction;
};

const initialWorkspaceState: WorkspaceState = {
  boardId: 'test',
  selectedMetadataId: undefined,
  interval: 'day',
  isAdvancedChart: false,
  tabIndex: '2',
  selectedCustomForecastIndicatorId: undefined,
};

export const useWorkspaceStore = create<WorkspaceStore>()((set) => {
  storeResetFns.add(() => set(initialWorkspaceState));
  return {
    ...initialWorkspaceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
      setIsAdvancedChart: (isAdvancedChart) => set({ isAdvancedChart }),
      setTabIndex: (tabIndex) => set({ tabIndex }),
      selectCustomForecastIndicatorById: (customForecastIndicatorId) =>
        set({ selectedCustomForecastIndicatorId: customForecastIndicatorId }),
      setInterval: (interval) => set({ interval }),
    },
  };
});
