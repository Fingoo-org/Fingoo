import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { Interval } from './indicator-board.store';

type WorkspaceState = {
  boardId: string;
  selectedMetadataId: string | undefined;
  interval: Interval;
  tabIndex: string;
  selectedCustomForecastIndicatorId: string | undefined;
};

type WorkspaceAction = {
  selectMetadata: (MetadataId: string | undefined) => void;
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
  tabIndex: '2',
  selectedCustomForecastIndicatorId: undefined,
};

export const useWorkspaceStore = create<WorkspaceStore>()((set) => {
  storeResetFns.add(() => set(initialWorkspaceState));
  return {
    ...initialWorkspaceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
      setTabIndex: (tabIndex) => set({ tabIndex }),
      selectCustomForecastIndicatorById: (customForecastIndicatorId) =>
        set({ selectedCustomForecastIndicatorId: customForecastIndicatorId }),
      setInterval: (interval) => set({ interval }),
    },
  };
});
