import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';

export const useSourceIndicator = (customForecastIndicatorId: string) => {
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();

  const foundCustomForecastIndicator = customForecastIndicatorList?.find(
    (customForecastIndicator) => customForecastIndicator.id === customForecastIndicatorId,
  );

  const convertedCustomForecastIndicator = useMemo(() => {
    if (!foundCustomForecastIndicator) return;
    return convertCustomForecastIndicatorViewModel(foundCustomForecastIndicator);
  }, [foundCustomForecastIndicator]);

  const sourceIndicatorList = useMemo(() => {
    if (!convertedCustomForecastIndicator) return [];

    return convertedCustomForecastIndicator.sourceIndicatorsInformation.map((sourceIndicator) => {
      return {
        ...sourceIndicator,
        id: sourceIndicator.sourceIndicatorId,
        disabled: !convertedCustomForecastIndicator.checkGrantedVerificationBySourceIndicatorId(
          sourceIndicator.sourceIndicatorId,
        ),
      };
    });
  }, [convertedCustomForecastIndicator]);

  return {
    sourceIndicatorList,
  };
};
