import { useLogger } from '@/app/logging/use-logger.hook';
import { useIndicatorBoardMetadataList } from '../numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useSplitIndicatorBoard } from '../numerical-guidance/indicator-board/use-split-indicator-board.hook';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export default function useDrawMetadata() {
  const { metadataList, createIndicatorBoardMetadata: createMetadata } = useIndicatorBoardMetadataList();
  const logger = useLogger();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const { addMetadataToIndicatorBoard } = useSplitIndicatorBoard();

  const displayIndicatorBoardMetadata = (metadataId: string) => {
    const isSuccess = addMetadataToIndicatorBoard(metadataId);

    if (isSuccess) {
      selectMetadataById(metadataId);
    }
  };

  const createIndicatorBoardMetadata = async (title: string) => {
    const id = await createMetadata(title);
    logger.track('GPT_create_metadata', { metadata_item_count: metadataList?.length ?? -1 });

    return id;
  };

  const drawMetadataHandler = async () => {
    const metadataId = await createIndicatorBoardMetadata('생성된 메타데이터');
    displayIndicatorBoardMetadata(metadataId);

    return '메타데이터 생성 완료';
  };

  return { drawMetadataHandler };
}
