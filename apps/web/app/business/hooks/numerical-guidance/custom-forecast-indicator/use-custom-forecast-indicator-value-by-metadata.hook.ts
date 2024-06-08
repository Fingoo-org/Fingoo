import {
  useFetchCustomForecastIndicatorsValue,
  useRevalidateCustomForecastIndicatorValue,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useCustomForecastIndicatorsValueByMetadata = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { trigger: revalidateCustomForecastIndicatorValueTrigger } = useRevalidateCustomForecastIndicatorValue();

  const { data } = useFetchCustomForecastIndicatorsValue(selectedMetadata?.customForecastIndicatorIds);

  const customForecastTypes = data?.map((value) => {
    return {
      customForecastIndicatorId: value.customForecastIndicatorId,
      forecastType: value.forecastType,
    };
  });

  const revalidateCustomForecastIndicatorValue = (customForecastIndicatorId: string) => {
    revalidateCustomForecastIndicatorValueTrigger(customForecastIndicatorId);
  };

  return {
    customForecastTypes,
    revalidateCustomForecastIndicatorValue,
  };
};
