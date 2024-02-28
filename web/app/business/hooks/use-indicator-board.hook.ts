import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';

export const useIndicatorBoard = () => {
  const isAdvancedChart = useNumericalGuidanceStore((state) => state.isAdvancedChart);
  const { setIsAdvancedChart } = useNumericalGuidanceStore((state) => state.actions);
  const { setTabIndex } = useNumericalGuidanceStore((state) => state.actions);

  const transitionToCustomForecastTab = () => {
    setTabIndex(1);
  };

  return {
    isAdvancedChart,
    setIsAdvancedChart,
    transitionToCustomForecastTab,
  };
};
