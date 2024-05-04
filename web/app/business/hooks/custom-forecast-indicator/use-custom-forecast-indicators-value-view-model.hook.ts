import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useMemo } from 'react';
import { convertCustomForecastIndicatorsValue } from '../../services/view-model/indicator-value/custom-forecast-indicator-value-view-model.service';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorListInMetadata } from './use-custom-forecast-indicator-list-in-metadata.hook';

export const useCustomForecastIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const { customForecastIndicatorListInMetadata } = useCustomForecastIndicatorListInMetadata(indicatorBoardMetadataId);

  const {
    data: customForecastIndicatorsValueData,
    isLoading,
    isValidating,
  } = useFetchCustomForecastIndicatorsValue(indicatorBoardMetadata?.customForecastIndicatorIds);
  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[indicatorBoardMetadata?.id ?? ''],
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

  return {
    customForecastIndicatorsValue: convertedCustomForecastIndicatorsValue,
    isPending: isLoading || isValidating,
  };
};
