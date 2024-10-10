import { convertSparkIndicatorsValueViewModel } from '@/app/business/services/numerical-guidance/view-model/indicator-value/spark-indicator-value-view-model.service';
import {
  LiveIndicatorRequestParams,
  useFetchLiveIndicatorsValueByType,
} from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { useMemo } from 'react';

type Indicator = {
  id: string;
  indicatorType: IndicatorType;
  weight?: number;
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

  const { data: indicatorsValueData, isLoading, isValidating } = useFetchLiveIndicatorsValueByType(params, indicators);

  const IndicatosValueWithWeight = indicatorsValueData?.indicatorsValue.map((indicatorValue) => {
    const weight = indicators.find((indicator) => indicator.id === indicatorValue.indicatorId)?.weight;
    return { ...indicatorValue, weight: weight ?? 0 };
  });

  const convertedIndicatorsValue = useMemo(() => {
    if (!IndicatosValueWithWeight) return undefined;

    const convertedIndicatorsValue = convertSparkIndicatorsValueViewModel(IndicatosValueWithWeight);
    return convertedIndicatorsValue;
  }, [IndicatosValueWithWeight]);

  return {
    indicatorsValue: convertedIndicatorsValue,
    isPending: isLoading || isValidating,
  };
};
