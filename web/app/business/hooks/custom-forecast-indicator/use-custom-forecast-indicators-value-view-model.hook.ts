import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useMemo } from 'react';
import { convertCustomForecastIndicatorsValue } from '../../services/view-model/indicator-value/custom-forecast-indicator-value-view-model.service';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';

export const useCustomForecastIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const {
    data: customForecastIndicatorsValueData,
    isLoading,
    isValidating,
    mutate: mutateCustomForecastIndicator,
  } = useFetchCustomForecastIndicatorsValue(selectedMetadata?.customForecastIndicatorIds);
  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[selectedMetadata?.id ?? ''],
  );

  const customForecastIndicatorsValueDataWithName = useMemo(() => {
    if (!customForecastIndicatorsValueData || !customForecastIndicatorListData) return undefined;

    return customForecastIndicatorsValueData.map((customForecastIndicatorValue) => {
      const customForecastIndicator = customForecastIndicatorListData.find(
        (customForecastIndicator) =>
          customForecastIndicator.id === customForecastIndicatorValue.customForecastIndicatorId,
      );

      return {
        ...customForecastIndicatorValue,
        customForecastIndicatorName: customForecastIndicator?.customForecastIndicatorName ?? '예측지표',
      };
    });
  }, [customForecastIndicatorsValueData, customForecastIndicatorListData]);

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

  const customForecastTypes = convertedCustomForecastIndicatorsValue?.map((value) => {
    return {
      customForecastIndicatorId: value.customForecastIndicatorId,
      forecastType: value.forecastType,
    };
  });

  return {
    customForecastIndicatorsValue: convertedCustomForecastIndicatorsValue,
    isPending: isLoading || isValidating,
    customForecastTypes,
    mutateCustomForecastIndicator,
  };
};
