import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';

export const useIndicatorBoard = () => {
  const isAdvancedChart = useNumericalGuidanceStore((state) => state.isAdvancedChart);
  const tabIndex = useNumericalGuidanceStore((state) => state.tabIndex);
  const { setIsAdvancedChart } = useNumericalGuidanceStore((state) => state.actions);
  const { setTabIndex } = useNumericalGuidanceStore((state) => state.actions);

  const transitionToCustomForecastTab = () => {
    setTabIndex(1);
  };

  return {
    tabIndex,
    isAdvancedChart,
    setIsAdvancedChart,
    setTabIndex,
    transitionToCustomForecastTab,
  };
};
