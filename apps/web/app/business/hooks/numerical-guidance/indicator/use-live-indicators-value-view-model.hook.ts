import { useMemo } from 'react';
import { LiveIndicatorRequestParams } from '../../../../store/querys/numerical-guidance/indicator-value.query';
import { convertLiveIndicatorsValueViewModel } from '../../../services/numerical-guidance/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useIndicatorBoard } from '../indicator-board/use-indicator-board.hook';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';
import { useFetchLiveIndicatorsValueByType } from '../../../../store/querys/numerical-guidance/indicator-value.query';
import { getStartDate } from '@/app/utils/date-formatter';

export const useLiveIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { interval, dateRange } = useIndicatorBoard(indicatorBoardMetadataId);
  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[indicatorBoardMetadataId ?? ''],
  );

  const params: LiveIndicatorRequestParams = {
    startDate: getStartDate(dateRange, interval),
    interval,
    ids: indicatorBoardMetadata?.indicatorIds,
  };

  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValueByType(
    params,
    indicatorBoardMetadata?.indicatorInfos ?? [],
  );

  const convertedIndicatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    const convertedIndicatorsValue = convertLiveIndicatorsValueViewModel(indicatorsValueData);
    convertedIndicatorsValue.indicatorsValue.forEach((indicator) => {
      const unitType = indicatorsUnitType?.find((unit) => unit.indicatorId === indicator.indicatorId)?.unitType;
      indicator.unitType = unitType ?? 'default';
    });
    return convertedIndicatorsValue;
  }, [indicatorsValueData, indicatorsUnitType]);

  return {
    indicatorsValue: convertedIndicatorsValue,
    isPending: isLoading,
  };
};
