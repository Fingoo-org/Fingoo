import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useIndicatorBoard = () => {
  const isAdvancedChart = useWorkspaceStore((state) => state.isAdvancedChart);
  const { setIsAdvancedChart } = useWorkspaceStore((state) => state.actions);

  return {
    isAdvancedChart,
    setIsAdvancedChart,
  };
};
