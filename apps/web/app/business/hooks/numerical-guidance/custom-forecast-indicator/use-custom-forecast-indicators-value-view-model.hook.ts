import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useMemo } from 'react';
import { convertCustomForecastIndicatorsValue } from '../../../services/numerical-guidance/view-model/indicator-value/custom-forecast-indicator-value-view-model.service';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorListInMetadata } from './use-custom-forecast-indicator-list-in-metadata.hook';
import { useIndicatorBoard } from '../indicator-board/use-indicator-board.hook';
import {
  LiveIndicatorRequestParams,
  useFetchLiveIndicatorsValueByType,
} from '@/app/store/querys/numerical-guidance/indicator.query';
import { getStartDate } from '@/app/utils/date-formatter';

export const useCustomForecastIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const {
    data: customForecastIndicatorsValueData,
    isLoading,
    isValidating,
  } = useFetchCustomForecastIndicatorsValue(indicatorBoardMetadata?.customForecastIndicatorIds);

  const { targetIndicatorInfo, targetIndicatorIds } =
    useCustomForecastIndicatorListInMetadata(indicatorBoardMetadataId);
  const { interval, dateRange } = useIndicatorBoard(indicatorBoardMetadataId);

  const params: LiveIndicatorRequestParams = {
    startDate: getStartDate(dateRange, interval),
    interval,
    ids: targetIndicatorIds,
  };

  const { data: liveIndicatorsValueData, isLoading: isLiveLoading } = useFetchLiveIndicatorsValueByType(
    params,
    targetIndicatorInfo ?? [],
  );

  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[indicatorBoardMetadata?.id ?? ''],
  );

  const customForecastIndicatorsValueWithTargetIndicatorValue = useMemo(() => {
    if (
      !customForecastIndicatorsValueData ||
      !liveIndicatorsValueData ||
      liveIndicatorsValueData.indicatorsValue.length === 0
    )
      return undefined;

    return customForecastIndicatorsValueData.map((customForecastIndicatorValue) => {
      const targetIndicatorValue = liveIndicatorsValueData.indicatorsValue.find(
        (indicatorValue) => indicatorValue.indicatorId === customForecastIndicatorValue.targetIndicatorId,
      );

      return {
        ...customForecastIndicatorValue,
        targetIndicatorValues: targetIndicatorValue?.values ?? [],
      };
    });
  }, [customForecastIndicatorsValueData, liveIndicatorsValueData]);

  const customForecastIndicatorsValueDataWithName = useMemo(() => {
    if (!customForecastIndicatorsValueWithTargetIndicatorValue || !customForecastIndicatorListData) return undefined;

    return customForecastIndicatorsValueWithTargetIndicatorValue.map((customForecastIndicatorValue) => {
      const customForecastIndicator = customForecastIndicatorListData.find(
        (customForecastIndicator) =>
          customForecastIndicator.id === customForecastIndicatorValue.customForecastIndicatorId,
      );

      return {
        ...customForecastIndicatorValue,
        customForecastIndicatorName: customForecastIndicator?.customForecastIndicatorName ?? '예측지표',
      };
    });
  }, [customForecastIndicatorsValueWithTargetIndicatorValue, customForecastIndicatorListData]);

  const convertedCustomForecastIndicatorsValue = useMemo(() => {
    if (!customForecastIndicatorsValueDataWithName) return undefined;

    const convertedCustomForecastIndicatorsValue = convertCustomForecastIndicatorsValue(
      customForecastIndicatorsValueDataWithName,
    );
    convertedCustomForecastIndicatorsValue.forEach((indicator) => {
      const unitType = indicatorsUnitType?.find((unit) => unit.indicatorId === indicator.id)?.unitType;
      indicator.unitType = unitType ?? 'default';
    });
    return convertedCustomForecastIndicatorsValue;
  }, [customForecastIndicatorsValueDataWithName, indicatorsUnitType]);

  return {
    customForecastIndicatorsValue: convertedCustomForecastIndicatorsValue,
    isPending: isLoading || isValidating,
  };
};
