import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useIndicatorBoard = () => {
  const isAdvancedChart = useWorkspaceStore((state) => state.isAdvancedChart);
  const tabIndex = useWorkspaceStore((state) => state.tabIndex);
  const { setIsAdvancedChart } = useWorkspaceStore((state) => state.actions);
  const { setTabIndex } = useWorkspaceStore((state) => state.actions);

  const transitionToCustomForecastTab = () => {
    setTabIndex('1');
  };

  return {
    tabIndex,
    isAdvancedChart,
    setIsAdvancedChart,
    setTabIndex,
    transitionToCustomForecastTab,
  };
};
