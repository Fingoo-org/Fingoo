import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { fetchIndicatorsValue } from '../fetcher';
import { IndicatorResponse } from '../numerical-guidance/indicator-board-metadata.query';

export type IndicatorListResponse = {
  indicatorList: IndicatorResponse[];
};

export const useFetchIndicatorList = () => useSWR<IndicatorListResponse>(API_PATH.indicatorList);

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

export const useFetchIndicatorsValue = (indicators: IndicatorResponse[]) => {
  const tickers = indicators.map((indicator) => indicator.ticker);
  const key = [API_PATH.indicatorValue, ...tickers];

  return useSWR<IndicatorsValueResponse, any, string[] | null>(tickers.length > 0 ? key : null, fetchIndicatorsValue);
};
