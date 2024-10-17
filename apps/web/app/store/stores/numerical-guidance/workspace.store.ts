import { create } from 'zustand';
import { storeResetFns } from '../reset-store';

// state
type WorkspaceState = {
  selectedMetadataId: string | undefined;
  selectedPostId: string | undefined;
  tabIndex: string;
  selectedCustomForecastIndicatorId: string | undefined;
};

// action
type WorkspaceAction = {
  selectMetadata: (metadataId: string | undefined) => void;
  selectPost: (postId: string | undefined) => void;
  setTabIndex: (tabIndex: string) => void;
  selectCustomForecastIndicatorById: (customForecastIndicatorId: string | undefined) => void;
};

type WorkspaceStore = WorkspaceState & {
  actions: WorkspaceAction;
};

const initialWorkspaceState: WorkspaceState = {
  selectedMetadataId: undefined,
  selectedPostId: undefined,
  tabIndex: '2',
  selectedCustomForecastIndicatorId: undefined,
};

export const useWorkspaceStore = create<WorkspaceStore>()((set) => {
  storeResetFns.add(() => set(initialWorkspaceState));
  return {
    ...initialWorkspaceState,
    actions: {
      selectMetadata: (metadataId) => set({ selectedMetadataId: metadataId }),
      selectPost: (postId) => set({ selectedPostId: postId }),
      setTabIndex: (tabIndex) => set({ tabIndex }),
      selectCustomForecastIndicatorById: (customForecastIndicatorId) =>
        set({ selectedCustomForecastIndicatorId: customForecastIndicatorId }),
    },
  };
});
