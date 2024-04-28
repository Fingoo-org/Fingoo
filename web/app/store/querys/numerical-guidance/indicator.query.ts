import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { fetchIndicatorsValue, fetchLiveIndicatorsValue } from '../fetcher';
import { Interval } from '../../stores/numerical-guidance/indicator-board.store';
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';

export type IndicatorsValueResponse = {
  indicatorsValue: IndicatorValueResponse[];
};

export type IndicatorValueResponse = {
  indicatorId: string;
  symbol: string;
  type: IndicatorType;
  values: IndicatorValueItemResponse[];
};

export type IndicatorValueItemResponse = {
  date: string;
  value: number | string;
};

// deprecate
export const useFetchLiveIndicatorsValue = (indicatorIds: string[] | undefined, interval: Interval = 'day') => {
  // fix: type에 따라 url 변경 필요
  const key = indicatorIds ? [`${API_PATH.liveIndicatorValue}/k-stock`, interval, ...indicatorIds] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchIndicatorsValue);
};

export type LiveIndicatorRequestParams = {
  indicatorType: IndicatorType;
  startDate: string;
  interval: Interval;
  ids: string[] | undefined;
};

export type LiveIndicatorValueResponse = {
  indicatorId: string;
  symbol: string;
  type: IndicatorType;
  values: IndicatorValueItemResponse[];
};

export const useFetchLiveIndicatorsValueByType = (params: LiveIndicatorRequestParams) => {
  const { indicatorType, startDate, interval, ids } = params;
  const key = ids ? [`${API_PATH.liveIndicatorValue}`, interval, indicatorType, startDate, ...ids] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchLiveIndicatorsValue);
};
