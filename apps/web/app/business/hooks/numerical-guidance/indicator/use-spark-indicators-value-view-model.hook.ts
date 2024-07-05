import { convertLiveIndicatorsValueViewModel } from '@/app/business/services/numerical-guidance/view-model/indicator-value/actual-indicators-value-view-model.service';
import {
  IndicatorInfo,
  LiveIndicatorRequestParams,
  useFetchLiveIndicatorsValueByType,
} from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { useMemo } from 'react';

type Indicator = {
  id: string;
  indicatorType: IndicatorType;
};

type Props = {
  indicators: Indicator[];
};

export const useSparkIndicatorsValueViewModel = ({ indicators }: Props) => {
  const params: LiveIndicatorRequestParams = {
    startDate: '2024-01-01',
    interval: 'week',
    ids: indicators.map((indicator) => indicator.id),
  };

  const { data: indicatorsValueData } = useFetchLiveIndicatorsValueByType(params, indicators);

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    const convertedIndciatorsValue = convertLiveIndicatorsValueViewModel(indicatorsValueData);
    return convertedIndciatorsValue;
  }, [indicatorsValueData]);

  return {
    indicatorsValue: convertedIndciatorsValue,
  };
};
