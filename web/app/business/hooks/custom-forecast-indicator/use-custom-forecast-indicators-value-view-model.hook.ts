import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { convertCustomForecastTargetIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useMemo } from 'react';

export const useCustomForecastIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data: customForecastIndicatorsValueData } = useFetchCustomForecastIndicatorsValue(
    selectedMetadata?.customForecastIndicatorIds,
  );

  const convertedCustomForecastTargetIndicatorsValue = useMemo(() => {
    if (!customForecastIndicatorsValueData) return undefined;

    return convertCustomForecastTargetIndicatorsValueViewModel(customForecastIndicatorsValueData);
  }, [customForecastIndicatorsValueData]);

  console.log(convertedCustomForecastTargetIndicatorsValue);
  return {
    customForecastTargetIndicatorsValue: convertedCustomForecastTargetIndicatorsValue,
  };
};
