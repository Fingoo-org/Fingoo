import { Interval, useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useShallow } from 'zustand/react/shallow';
import { type SplitScreen } from '@/app/store/stores/numerical-guidance/indicator-board.store';

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
  const indicatorBoardInfo = useIndicatorBoardStore(
    useShallow((state) => state.indicatorBoardInfos.find((info) => info.metadataId === indicatorBoardMetadataId)),
  );
  const numberOfMetadataInIndicatorBoard = useIndicatorBoardStore((state) => state.indicatorBoardInfos.length);
  const splitScreen = useIndicatorBoardStore((state) => state.splitScreen);
  const {
    addIndicatorBoardInfo,
    clearIndicatorBoardInfos,
    updateIndicatorBoardInfo,
    deleteIndicatorBoardInfo,
    checkMetadataInIndicatorBoard,
    setSplitScreen,
  } = useIndicatorBoardStore((state) => state.actions);

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

  return {
    splitScreen,
    indicatorBoardInfo,
    interval,
    isAdvancedChart,
    setIsAdvancedChart,
    setInterval,
    checkMetadataInIndicatorBoard,
    addMetadataToIndicatorBoard,
    deleteMetadataFromIndicatorBoard,
    setSplitScreen,
  };
};
