import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { fetchLiveIndicatorsValue } from '../fetcher';
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

export type LiveIndicatorRequestParams = {
  indicatorType: IndicatorType;
  startDate: string;
  interval: Interval;
  ids: string[] | undefined;
};

export const useFetchLiveIndicatorsValueByType = (params: LiveIndicatorRequestParams) => {
  const { indicatorType, startDate, interval, ids } = params;
  // fix: id마다 indicator Type 찾을 수 있도록 변경할 필요 있음 indicatorType은 다행이 key에 들어갈 필요는 없음
  const key = ids ? [`${API_PATH.liveIndicatorValue}`, interval, indicatorType, startDate, ...ids] : null;

  return useSWR<IndicatorsValueResponse, any, string[] | null>(key, fetchLiveIndicatorsValue);
};
