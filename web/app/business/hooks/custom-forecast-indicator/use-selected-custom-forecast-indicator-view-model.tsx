import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { useNumericalGuidanceStore } from '@/app/store/stores/numerical-guidance.store';
import { useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';

export const useSelectedCustomForecastIndicatorViewModel = () => {
  const selectedCustomForecastIndicatorId = useNumericalGuidanceStore(
    (state) => state.selectedCustomForecastIndicatorId,
  );
  const { selectCustomForecastIndicator } = useNumericalGuidanceStore((state) => state.actions);
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();
  const { data: indicatorList } = useFetchIndicatorList();

  const selectedCustomForecastIndicator = customForecastIndicatorList?.customForecastIndicatorList.find(
    (customForecastIndicator) => customForecastIndicator.id === selectedCustomForecastIndicatorId,
  );

  const convertedSelectedCustomForecastIndicator = useMemo(() => {
    if (!selectedCustomForecastIndicator) return undefined;

    return convertCustomForecastIndicatorViewModel(selectedCustomForecastIndicator);
  }, [selectedCustomForecastIndicator]);

  const sourceIndicatorIds = convertedSelectedCustomForecastIndicator?.sourceIndicatorIds;

  const sourceIndicatorList = useMemo(() => {
    if (!sourceIndicatorIds) return [];

    return indicatorList?.filter((indicator) => sourceIndicatorIds.includes(indicator.id));
  }, [indicatorList, sourceIndicatorIds]);

  return {
    selectedCustomForecastIndicator: convertedSelectedCustomForecastIndicator,
    sourceIndicatorList,
    selectCustomForecastIndicator,
  };
};
