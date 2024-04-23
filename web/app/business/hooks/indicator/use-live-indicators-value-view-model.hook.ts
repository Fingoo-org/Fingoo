import { useMemo } from 'react';
import { useFetchLiveIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertLiveIndicatorsValueViewModel } from '../../services/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useIndicatorBoard } from '../indicator-board/use-indicator-board.hook';

export const useLiveIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { interval } = useIndicatorBoard(indicatorBoardMetadataId);

  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValue(
    indicatorBoardMetadata?.indicatorIds,
    interval,
  );

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertLiveIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  // 여기에 추가하고 indicatorsInMetadataUnitType 데이터에 의존하게 하면,

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
  };
};
