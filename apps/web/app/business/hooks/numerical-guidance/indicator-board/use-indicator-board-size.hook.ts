import { SplitScreen, useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { getViewport } from '@/app/utils/helper';

type Props = {
  indicatorBoardMetadataId?: string;
};

function getAvailableHeight(splitScreen: SplitScreen) {
  const { viewportHeight } = getViewport();

  if (splitScreen === 'square') {
    return viewportHeight / 2 - 150;
  }

  return viewportHeight - 180;
}

function getChartHeight(chartCount: number, splitScreen: SplitScreen) {
  if (chartCount === 1 && splitScreen === 'square') {
    return 200;
  }

  return chartCount === 1 ? 320 : Math.min(320, getAvailableHeight(splitScreen) / chartCount);
}

export const useIndicatorBoardSize = ({ indicatorBoardMetadataId }: Props) => {
  const splitScreen = useIndicatorBoardStore((state) => state.splitScreen);
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const chartCount = Object.keys(indicatorBoardMetadata?.indicatorIdsWithSectionIds ?? [0]).length;

  const chartHeight = getChartHeight(chartCount, splitScreen);

  return {
    chartHeight,
  };
};
