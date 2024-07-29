import { addIndicatorsToMetadata, getIndicatorValue } from '../../services/linguistic-guidance/indicator.service';
import { getIndicatorBySymbolAPIFirst } from '../../services/linguistic-guidance/search-symbol.service';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';
import { Indicator } from '../../services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { useIndicatorBoardMetadataList } from '../numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '../numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useSplitIndicatorBoard } from '../numerical-guidance/indicator-board/use-split-indicator-board.hook';

export default function useDrawMetadata() {
  const {
    metadataList,
    createIndicatorBoardMetadata: createMetadata,
    revalidateIndicatorBoardMetadataList,
  } = useIndicatorBoardMetadataList();

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

    return id;
  };

  const drawMetadataHandler = async (symbols: string[]) => {
    // 1. 심볼로 아이디 가져오기
    const indicators = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const indicator = await getIndicatorBySymbolAPIFirst(symbol);

          if (!indicator) return;

          return createIndicator(indicator);
        }),
      )
    ).filter((indicator) => indicator !== undefined) as Indicator[];
    // 2. 메타데이터 만들기
    const metadataId = await createIndicatorBoardMetadata('Fingoo가 분석한 지표들');

    // 3. 메타데이터에 지표 추가
    await addIndicatorsToMetadata(metadataId, indicators);
    await revalidateIndicatorBoardMetadataList();

    // 4. 값 가져오기
    const indicatorsValue = await Promise.all(
      indicators.map(async (indicator) => {
        return await getIndicatorValue(indicator);
      }),
    );

    // 5. 메타데이터 선택
    displayIndicatorBoardMetadata(metadataId);

    return `
    생성된 지표들: ${JSON.stringify(symbols)}
    `;
  };
  return {
    drawMetadataHandler,
  };
}
