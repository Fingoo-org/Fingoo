import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { Interval } from './indicator-board.store';

type WorkspaceState = {
  selectedMetadataId: string | undefined;
  tabIndex: string;
  selectedCustomForecastIndicatorId: string | undefined;
};

type WorkspaceAction = {
  selectMetadata: (MetadataId: string | undefined) => void;
  setTabIndex: (tabIndex: string) => void;
  selectCustomForecastIndicatorById: (customForecastIndicatorId: string | undefined) => void;
};

type WorkspaceStore = WorkspaceState & {
  actions: WorkspaceAction;
};

const initialWorkspaceState: WorkspaceState = {
  selectedMetadataId: undefined,
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
    },
  };
});
