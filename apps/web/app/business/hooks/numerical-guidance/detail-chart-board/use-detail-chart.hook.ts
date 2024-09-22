import {
  useFetchLiveIndicatorsValueByType,
  IndicatorValueResponse,
} from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { Interval } from '@/app/store/stores/numerical-guidance/indicator-board.store';

type DetailChartParams = {
  indicatorId: string;
  interval: Interval;
  indicatorType: IndicatorType;
  startDate: string;
};

export function useDetailChart({ indicatorId, interval, indicatorType, startDate }: DetailChartParams) {
  const params = {
    startDate,
    interval,
    ids: [indicatorId],
  };

  const indicatorInfos = [{ id: indicatorId, indicatorType }];

  const { data, error } = useFetchLiveIndicatorsValueByType(params, indicatorInfos);

  const detailChart = data?.indicatorsValue.find(
    (indicator: IndicatorValueResponse) => indicator.indicatorId === indicatorId,
  ) || { values: [], symbol: '' };

  return {
    detailChart,
    isLoading: !error && !data,
    isError: error,
  };
}
