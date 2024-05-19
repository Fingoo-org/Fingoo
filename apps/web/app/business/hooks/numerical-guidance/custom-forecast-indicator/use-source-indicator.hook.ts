import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../../services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
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

  // RISK: selected와 로직 중복 selected 종속성을 제거하고, 이 훅을 source-indicator 전용 훅으로 개선할 필요 있음
  const sourceIndicatorList = useMemo(() => {
    if (!convertedCustomForecastIndicator) return [];

    return convertedCustomForecastIndicator.sourceIndicatorsInformation.map((sourceIndicator) => {
      const sourceIndicatorInfo = convertedCustomForecastIndicator.sourceIndicatorsInfo.find(
        (indicator) => indicator.id === sourceIndicator.sourceIndicatorId,
      );

      return {
        ...sourceIndicator,
        id: sourceIndicator.sourceIndicatorId,
        disabled: !convertedCustomForecastIndicator.checkGrantedVerificationBySourceIndicatorId(
          sourceIndicator.sourceIndicatorId,
        ),
        name: sourceIndicatorInfo?.name ?? '',
        symbol: sourceIndicatorInfo?.symbol ?? '',
        exchange: sourceIndicatorInfo?.exchange ?? '',
        indicatorType: sourceIndicatorInfo?.indicatorType ?? 'stocks',
      };
    });
  }, [convertedCustomForecastIndicator]);

  return {
    sourceIndicatorList,
  };
};
