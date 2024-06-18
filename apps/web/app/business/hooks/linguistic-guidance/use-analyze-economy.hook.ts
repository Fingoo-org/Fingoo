import { addIndicatorsToMetadata, getIndicatorValue } from '../../services/linguistic-guidance/indicator.service';
import { getIndicatorBySymbol } from '../../services/linguistic-guidance/search-symbol.service';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';
import { useIndicatorBoardMetadataList } from '../numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useIndicatorBoard } from '../numerical-guidance/indicator-board/use-indicator-board.hook';

export default function useAnalyzeEconomy() {
  const { createIndicatorBoardMetadata, revalidateIndicatorBoardMetadataList } = useIndicatorBoardMetadataList();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { addMetadataToIndicatorBoard } = useIndicatorBoard();

  const displayIndicatorBoardMetadata = (metadataId: string) => {
    const isSuccess = addMetadataToIndicatorBoard(metadataId);

    if (isSuccess) {
      selectMetadataById(metadataId);
    }
  };

  const analyzeEconomicHandler = async (symbols: string[]) => {
    // 1. 심볼로 아이디 가져오기
    const indicators = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const indicator = await getIndicatorBySymbol(symbol);

          if (!indicator) return;

          return createIndicator(indicator);
        }),
      )
    ).filter((indicator) => indicator !== undefined);

    // 2. 메타데이터 만들기
    const metadataId = await createIndicatorBoardMetadata('Fingoo가 분석한 지표들');

    // 3. 메타데이터에 지표 추가
    await addIndicatorsToMetadata(metadataId, indicators);
    await revalidateIndicatorBoardMetadataList();

    // 4. 값 가져오기
    const values = await Promise.all(
      indicators.map(async (indicator) => {
        return await getIndicatorValue(indicator);
      }),
    );

    // 5. 메타데이터 선택
    displayIndicatorBoardMetadata(metadataId);

    // 6. GPT에 분석 요청
    return undefined;
  };

  return {
    analyzeEconomicHandler,
  };
}
