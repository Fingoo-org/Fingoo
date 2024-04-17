import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';

export const useSourceIndicator = (customForecastIndicatorId: string) => {
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();
  const { data: indicatorList } = useFetchIndicatorList();

  const foundCustomForecastIndicator = customForecastIndicatorList?.find(
    (customForecastIndicator) => customForecastIndicator.id === customForecastIndicatorId,
  );

  const convertedCustomForecastIndicator = useMemo(() => {
    if (!foundCustomForecastIndicator) return;
    return convertCustomForecastIndicatorViewModel(foundCustomForecastIndicator);
  }, [foundCustomForecastIndicator]);

  // risk: use-selected-custom-forecast-indicator-view-model와 중복 로직
  const sourceIndicatorIds = convertedCustomForecastIndicator?.sourceIndicatorIds;

  const sourceIndicatorList = useMemo(() => {
    if (!sourceIndicatorIds) return [];

    return indicatorList
      ?.filter((indicator) => sourceIndicatorIds.includes(indicator.id))
      .map((indicator) => {
        return {
          ...indicator,
          weight: convertedCustomForecastIndicator.getSourceIndicatorWeight(indicator.id)!,
          disabled: convertedCustomForecastIndicator.checkGrantedVerificationBySourceIndicatorId(indicator.id),
        };
      });
  }, [indicatorList, sourceIndicatorIds]);

  return {
    sourceIndicatorList,
  };
};
