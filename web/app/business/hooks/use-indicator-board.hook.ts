import { Interval, useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useShallow } from 'zustand/react/shallow';

export const useIndicatorBoard = (indicatorBoardMetadataId?: string) => {
  const indicatorBoardInfo = useIndicatorBoardStore(
    useShallow((state) => state.indicatorBoardInfos.find((info) => info.metadataId === indicatorBoardMetadataId)),
  );
  const { addIndicatorBoardInfo, updateIndicatorBoardInfo, checkMetadataInIndicatorBoard } = useIndicatorBoardStore(
    (state) => state.actions,
  );

  const isAdvancedChart = indicatorBoardInfo?.isAdvancedChart ?? false;
  const interval = indicatorBoardInfo?.interval ?? 'day';

  function setIsAdvancedChart(isAdvancedChart: boolean) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { isAdvancedChart });
  }

  function setInterval(interval: Interval) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { interval });
  }

  return {
    indicatorBoardInfo,
    interval,
    isAdvancedChart,
    addIndicatorBoardInfo,
    setIsAdvancedChart,
    setInterval,
    checkMetadataInIndicatorBoard,
  };
};
