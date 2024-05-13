import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useWorkspace = () => {
  const tabIndex = useWorkspaceStore((state) => state.tabIndex);
  const { setTabIndex } = useWorkspaceStore((state) => state.actions);

  const transitionToCustomForecastTab = () => {
    setTabIndex('1');
  };

  return {
    tabIndex,
    setTabIndex,
    transitionToCustomForecastTab,
  };
};
