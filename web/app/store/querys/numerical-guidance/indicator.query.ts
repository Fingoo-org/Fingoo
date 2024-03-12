import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher, fetchIndicatorsValue } from '../fetcher';
import { Interval } from '../../stores/numerical-guidance.store';

export type IndicatorInfoResponse = {
  id: string;
  ticker: string;
  name: string;
};

export type IndicatorsValueResponse = {
  indicatorsValue: IndicatorValueResponse[];
};

export type IndicatorValueResponse = {
  id: string;
  ticker: string;
  market: string;
  type: string;
  values: IndicatorValueItemResponse[];
};

export type IndicatorValueItemResponse = {
  date: string;
  value: number;
};

export const useFetchIndicatorList = () => useSWR<IndicatorInfoResponse[]>(API_PATH.indicatorList, defaultFetcher);

export const useFetchLiveIndicatorsValue = (indicatorIds: string[] | undefined, interval: Interval = 'day') => {
  const key = indicatorIds ? [API_PATH.liveIndicatorValue, interval, ...indicatorIds] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchIndicatorsValue);
};
