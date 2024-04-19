import { Interval, useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useShallow } from 'zustand/react/shallow';

export const useIndicatorBoard = (indicatorBoardMetadataId?: string) => {
  const indicatorBoardInfos = useIndicatorBoardStore(
    useShallow((state) => state.indicatorBoardInfos.find((info) => info.metadataId === indicatorBoardMetadataId)),
  );
  const { updateIndicatorBoardInfo } = useIndicatorBoardStore((state) => state.actions);

  const isAdvancedChart = indicatorBoardInfos?.isAdvancedChart ?? false;
  const interval = indicatorBoardInfos?.interval ?? 'day';

  function setIsAdvancedChart(isAdvancedChart: boolean) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { isAdvancedChart });
  }

  function setInterval(interval: Interval) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { interval });
  }
  return {
    interval,
    isAdvancedChart,
    setIsAdvancedChart,
    setInterval,
  };
};
