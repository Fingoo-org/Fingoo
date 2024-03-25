import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useMemo } from 'react';
import { convertCustomForecastIndicatorsValue } from '../../services/view-model/indicator-value/custom-forecast-indicator-value-view-model.service';

export const useCustomForecastIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data: customForecastIndicatorsValueData } = useFetchCustomForecastIndicatorsValue(
    selectedMetadata?.customForecastIndicatorIds,
  );
  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

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

    return convertCustomForecastIndicatorsValue(customForecastIndicatorsValueDataWithName);
  }, [customForecastIndicatorsValueDataWithName]);

  return {
    customForecastIndicatorsValue: convertedCustomForecastIndicatorsValue,
  };
};
