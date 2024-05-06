import { useFetchCustomForecastIndicatorsValue } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useCustomForecastIndicatorsValueByMetadata = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const { data, mutate: mutateCustomForecastIndicator } = useFetchCustomForecastIndicatorsValue(
    selectedMetadata?.customForecastIndicatorIds,
  );

  const customForecastTypes = data?.map((value) => {
    return {
      customForecastIndicatorId: value.customForecastIndicatorId,
      forecastType: value.forecastType,
    };
  });

  return {
    customForecastTypes,
    mutateCustomForecastIndicator,
  };
};
