import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { fetchIndicatorsValue } from '../fetcher';

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

export const useFetchIndicatorList = () => useSWR<IndicatorListResponse>(API_PATH.indicatorList);

export const useFetchIndicatorsValue = (indicators: IndicatorInfoResponse[]) => {
  const tickers = indicators.map((indicator) => indicator.ticker);
  const key = [API_PATH.indicatorValue, ...tickers];

  return useSWR<IndicatorsValueResponse, any, string[] | null>(tickers.length > 0 ? key : null, fetchIndicatorsValue);
};
