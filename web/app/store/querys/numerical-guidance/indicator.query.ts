import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher, fetchIndicatorsValue } from '../fetcher';

export type IndicatorInfoResponse = {
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
  ticker: string;
  items: IndicatorValueItemResponse[];
};

export type IndicatorValueItemResponse = {
  date: string;
  value: number;
};

export const useFetchIndicatorList = () => useSWR<IndicatorListResponse>(API_PATH.indicatorList, defaultFetcher);

export const useFetchIndicatorsValue = (indicators: IndicatorInfoResponse[] | undefined) => {
  const key = indicators ? [API_PATH.indicatorValue, ...indicators.map((indicator) => indicator.ticker)] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchIndicatorsValue);
};
