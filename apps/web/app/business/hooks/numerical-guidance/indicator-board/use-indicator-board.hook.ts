import {
  DateRange,
  Interval,
  useIndicatorBoardStore,
} from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { type SplitScreen } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

function maxIndicatorBoard(splitScreen: SplitScreen) {
  switch (splitScreen) {
    case 'full':
      return 1;
    case 'vertical':
      return 2;
    case 'square':
      return 4;
  }
}

export const useIndicatorBoard = (indicatorBoardMetadataId?: string) => {
  const indicatorBoardInfos = useIndicatorBoardStore((state) => state.indicatorBoardInfos);
  const indicatorBoardInfo = indicatorBoardInfos.find((info) => info.metadataId === indicatorBoardMetadataId);

  const numberOfMetadataInIndicatorBoard = useIndicatorBoardStore((state) => state.indicatorBoardInfos.length);
  const splitScreen = useIndicatorBoardStore((state) => state.splitScreen);
  const {
    addIndicatorBoardInfo,
    clearIndicatorBoardInfos,
    updateIndicatorBoardInfo,
    deleteIndicatorBoardInfo,
    checkMetadataInIndicatorBoard,
    setSplitScreen,
    sliceIndicatorBoardInfos,
    setIndicatorBoardInfos,
  } = useIndicatorBoardStore((state) => state.actions);
  const selectedMetadataId = useWorkspaceStore((state) => state.selectedMetadataId);
  const { selectMetadata } = useWorkspaceStore((state) => state.actions);

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

  function addMetadataToIndicatorBoard(metadataId: string) {
    if (splitScreen === 'full') {
      clearIndicatorBoardInfos();
      addIndicatorBoardInfo(metadataId);
      return true;
    }

    if (numberOfMetadataInIndicatorBoard < maxIndicatorBoard(splitScreen)) {
      addIndicatorBoardInfo(metadataId);
      return true;
    }
    return false;
  }

  function deleteMetadataFromIndicatorBoard(metadataId: string) {
    deleteIndicatorBoardInfo(metadataId);
  }

  function transitionSplitScreen(screenType: SplitScreen) {
    const slicedIndicatorBoardInfos = sliceIndicatorBoardInfos(maxIndicatorBoard(screenType));

    const selectedMetadata = slicedIndicatorBoardInfos.findIndex((info) => info.metadataId === selectedMetadataId);

    if (selectedMetadata === -1) {
      selectMetadata(undefined);
    }

    setIndicatorBoardInfos(slicedIndicatorBoardInfos);
    setSplitScreen(screenType);
  }

  function reorderIndicatorBoardInfos(metadataIds: string[]) {
    const newIndicatorBoardInfos = metadataIds.map((metadataId) => {
      return indicatorBoardInfos.find((info) => info.metadataId === metadataId)!;
    });

    setIndicatorBoardInfos(newIndicatorBoardInfos);
  }

  return {
    indicatorBoardInfos,
    splitScreen,
    indicatorBoardInfo,
    interval,
    isAdvancedChart,
    dateRange,
    setIsAdvancedChart,
    setInterval,
    checkMetadataInIndicatorBoard,
    addMetadataToIndicatorBoard,
    deleteMetadataFromIndicatorBoard,
    transitionSplitScreen,
    reorderIndicatorBoardInfos,
    updateDateRange,
  };
};
