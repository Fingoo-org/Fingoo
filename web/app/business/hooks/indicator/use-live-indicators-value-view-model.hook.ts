import { useMemo } from 'react';
import { useFetchLiveIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertLiveIndicatorsValueViewModel } from '../../services/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useIndicatorBoard } from '../indicator-board/use-indicator-board.hook';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';

export const useLiveIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { interval } = useIndicatorBoard(indicatorBoardMetadataId);
  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[indicatorBoardMetadataId ?? ''],
  );

  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValue(
    indicatorBoardMetadata?.indicatorIds,
    interval,
  );

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    const convertedIndciatorsValue = convertLiveIndicatorsValueViewModel(indicatorsValueData);
    convertedIndciatorsValue.indicatorsValue.forEach((indicator) => {
      const unitType = indicatorsUnitType?.find((unit) => unit.indicatorId === indicator.indicatorId)?.unitType;
      indicator.unitType = unitType ?? 'default';
    });
    return convertedIndciatorsValue;
  }, [indicatorsValueData, indicatorsUnitType]);

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
  };
};
