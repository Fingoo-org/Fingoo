import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';

export const useCustomForecastIndicatorViewModel = (customForecastIndicatorId: string | undefined) => {
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();
  const customForecastIndicator = customForecastIndicatorList?.customForecastIndicatorList.find(
    (customForecastIndicator) => customForecastIndicator.id === customForecastIndicatorId,
  );

  const convertedCustomForecastIndicator = useMemo(() => {
    if (!customForecastIndicator) return undefined;

    return convertCustomForecastIndicatorViewModel(customForecastIndicator);
  }, [customForecastIndicator]);

  return {
    customForecastIndicator: convertedCustomForecastIndicator,
  };
};
