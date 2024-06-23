import { SplitScreen, useIndicatorBoardStore } from '@/app/store/stores/numerical-guidance/indicator-board.store';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useSplitIndicatorBoard = () => {
  const indicatorBoardInfos = useIndicatorBoardStore((state) => state.indicatorBoardInfos);
  const splitScreen = useIndicatorBoardStore((state) => state.splitScreen);
  const numberOfMetadataInIndicatorBoard = useIndicatorBoardStore((state) => state.indicatorBoardInfos.length);

  const {
    addIndicatorBoardInfo,
    clearIndicatorBoardInfos,
    setIndicatorBoardInfos,
    sliceIndicatorBoardInfos,
    setSplitScreen,
  } = useIndicatorBoardStore((state) => state.actions);

  const selectedMetadataId = useWorkspaceStore((state) => state.selectedMetadataId);
  const { selectMetadata } = useWorkspaceStore((state) => state.actions);

  const draggableIndicatorBoardContextValue = indicatorBoardInfos.reduce<{
    [key: string]: string[];
  }>((acc, info, index) => {
    return {
      ...acc,
      [`${index}`]: [info.metadataId],
    };
  }, {});

  function reorderIndicatorBoardInfos(metadataIds: string[]) {
    const newIndicatorBoardInfos = metadataIds.map((metadataId) => {
      return indicatorBoardInfos.find((info) => info.metadataId === metadataId)!;
    });

    setIndicatorBoardInfos(newIndicatorBoardInfos);
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

  return {
    splitScreen,
    indicatorBoardInfos,
    draggableIndicatorBoardContextValue,
    reorderIndicatorBoardInfos,
    transitionSplitScreen,
    addMetadataToIndicatorBoard,
  };
};

export function maxIndicatorBoard(splitScreen: SplitScreen) {
  switch (splitScreen) {
    case 'full':
      return 1;
    case 'vertical':
      return 2;
    case 'square':
      return 4;
  }
}
