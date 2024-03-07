import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher, fetchIndicatorsValue } from '../fetcher';

export type IndicatorInfoResponse = {
  id: string;
  ticker: string;
  name: string;
};

export type IndicatorListResponse = {
  indicatorList: IndicatorInfoResponse[];
};

export type IndicatorsValueResponse = {
  indicatorsValue: IndicatorValueResponse[];
};

export type IndicatorValueResponse = {
  id: string;
  ticker: string;
  values: IndicatorValueItemResponse[];
};

export type IndicatorValueItemResponse = {
  date: string;
  value: number;
};

export const useFetchIndicatorList = () => useSWR<IndicatorListResponse>(API_PATH.indicatorList, defaultFetcher);

export const useFetchIndicatorsValue = (indicatorIds: string[] | undefined) => {
  const key = indicatorIds ? [API_PATH.indicatorValue, ...indicatorIds] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchIndicatorsValue);
};
