import { addIndicatorsToMetadata } from '../../services/linguistic-guidance/indicator.service';
import { getIndicatorIdBySymbolToAPI } from '../../services/linguistic-guidance/search-symbol.service';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';
import { Indicator } from '../../services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { useIndicatorBoardMetadataList } from '../numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useIndicatorBoard } from '../numerical-guidance/indicator-board/use-indicator-board.hook';

export default function useRecommendIndicator() {
  const { createIndicatorBoardMetadata, revalidateIndicatorBoardMetadataList } = useIndicatorBoardMetadataList();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { addMetadataToIndicatorBoard } = useIndicatorBoard();

  const displayIndicatorBoardMetadata = (metadataId: string) => {
    const isSuccess = addMetadataToIndicatorBoard(metadataId);

    if (isSuccess) {
      selectMetadataById(metadataId);
    }
  };

  const recommendIndicatorHandler = async (symbols: string[]) => {
    const indicators = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const indicator = await getIndicatorIdBySymbolToAPI(symbol);

          if (!indicator) return;

          return createIndicator(indicator);
        }),
      )
    ).filter((indicator) => indicator !== undefined) as Indicator[];

    // 2. 메타데이터 만들기
    const metadataId = await createIndicatorBoardMetadata('Fingoo가 추천한 지표들');

    // 3. 메타데이터에 지표 추가
    await addIndicatorsToMetadata(metadataId, indicators);
    await revalidateIndicatorBoardMetadataList();

    // 5. 메타데이터 선택
    displayIndicatorBoardMetadata(metadataId);

    return JSON.stringify(
      `
        추천 심볼 리스트: ${JSON.stringify(symbols)}
        
        - 왜 해당 심볼을 추천하는지에 대한 이유를 설명해야합니다.
        - 각각의 심볼에 대한 개요를 설명해야합니다.
        `,
    );
  };

  return { recommendIndicatorHandler };
}
