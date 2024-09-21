import {
  DateRange,
  Interval,
  useIndicatorBoardStore,
} from '@/app/store/stores/numerical-guidance/indicator-board.store';

export const useIndicatorBoard = (indicatorBoardMetadataId?: string) => {
  const indicatorBoardInfos = useIndicatorBoardStore((state) => state.indicatorBoardInfos);
  const indicatorBoardInfo = indicatorBoardInfos.find((info) => info.metadataId === indicatorBoardMetadataId);

  const { updateIndicatorBoardInfo, deleteIndicatorBoardInfo, checkMetadataInIndicatorBoard } = useIndicatorBoardStore(
    (state) => state.actions,
  );

  const isAdvancedChart = indicatorBoardInfo?.isAdvancedChart ?? false;
  const interval = indicatorBoardInfo?.interval ?? 'day';
  const dateRange = indicatorBoardInfo?.dateRange ?? 'default';

  function setIsAdvancedChart(isAdvancedChart: boolean) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { isAdvancedChart });
  }

  function setInterval(interval: Interval) {
    if (!indicatorBoardMetadataId) return;
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { interval });
  }

  function updateDateRange(dateRange: DateRange) {
    if (!indicatorBoardMetadataId) return;
    if (dateRange === 'MAX') {
      updateIndicatorBoardInfo(indicatorBoardMetadataId, { dateRange, interval: 'month' });
      return;
    }
    updateIndicatorBoardInfo(indicatorBoardMetadataId, { dateRange });
  }

  return {
    indicatorBoardInfos,
    indicatorBoardInfo,
    interval,
    isAdvancedChart,
    dateRange,
    setIsAdvancedChart,
    setInterval,
    checkMetadataInIndicatorBoard,
    updateDateRange,
  };
};
