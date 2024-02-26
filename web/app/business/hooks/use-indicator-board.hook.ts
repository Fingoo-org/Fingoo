import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';

export const useIndicatorBoard = () => {
  const isAdvancedChart = useNumericalGuidanceStore((state) => state.isAdvancedChart);
  const { setIsAdvancedChart } = useNumericalGuidanceStore((state) => state.actions);

  return {
    isAdvancedChart,
    setIsAdvancedChart,
  };
};
