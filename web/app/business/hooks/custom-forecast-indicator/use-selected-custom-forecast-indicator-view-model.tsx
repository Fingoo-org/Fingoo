import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';

export const useSelectedCustomForecastIndicatorViewModel = () => {
  const selectedCustomForecastIndicatorId = useNumericalGuidanceStore(
    (state) => state.selectedCustomForecastIndicatorId,
  );
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();
  const customForecastIndicator = customForecastIndicatorList?.customForecastIndicatorList.find(
    (customForecastIndicator) => customForecastIndicator.id === selectedCustomForecastIndicatorId,
  );

  const convertedCustomForecastIndicator = useMemo(() => {
    if (!customForecastIndicator) return undefined;

    return convertCustomForecastIndicatorViewModel(customForecastIndicator);
  }, [customForecastIndicator]);

  return {
    customForecastIndicator: convertedCustomForecastIndicator,
  };
};
