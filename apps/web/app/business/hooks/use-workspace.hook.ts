import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useWorkspace = () => {
  const tabIndex = useWorkspaceStore((state) => state.tabIndex);
  const { setTabIndex } = useWorkspaceStore((state) => state.actions);

  const transitionToCustomForecastTab = () => {
    setTabIndex('1');
  };

  const activeTab = () => {
    if (tabIndex === '2') {
      return setTabIndex('0');
    }
  };

  return {
    tabIndex,
    setTabIndex,
    transitionToCustomForecastTab,
    activeTab,
  };
};
