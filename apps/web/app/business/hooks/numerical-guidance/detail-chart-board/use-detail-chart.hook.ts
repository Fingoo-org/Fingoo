import useSWR from 'swr';
import { API_PATH } from '@/app/store/querys/api-path';

type DetailChartParams = {
  indicatorId: string;
  interval: 'day' | 'week' | 'month' | 'year' | 'none';
  indicatorType:
    | 'stocks'
    | 'forex_pairs'
    | 'cryptocurrencies'
    | 'etf'
    | 'indices'
    | 'customForecastIndicator'
    | 'funds'
    | 'bonds';
  startDate: string;
};

type DetailChartResponse = {
  indicatorId: string;
  symbol: string;
  type: string;
  name: string;
  exchange: string;
  totalCount: number;
  values: Array<{
    date: string;
    value: string;
  }>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDetailChart({ indicatorId, interval, indicatorType, startDate }: DetailChartParams) {
  const url = `${API_PATH.liveIndicatorValue}?indicatorId=${indicatorId}&interval=${interval}&indicatorType=${indicatorType}&startDate=${startDate}`;

  const { data, error, isLoading } = useSWR<DetailChartResponse>(url, fetcher);

  return {
    detailChart: data,
    isLoading,
    isError: error,
  };
}
