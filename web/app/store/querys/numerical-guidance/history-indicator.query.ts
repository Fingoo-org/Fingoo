import { calculateDate } from '@/app/ui/components/view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import useSWRInfinite from 'swr/infinite';
import { API_PATH } from '../api-path';
import { fetchIndicatorsValue } from '../fetcher';
import { utcFormat, utcParse } from 'd3-time-format';

export const parseTime = utcParse('%Y%m%d');
export const formatTime = utcFormat('%Y%m%d');

export type HistoryIndicatorsValueResponse = {
  indicatorsValue: HistoryIndicatorValueDataResponse[];
};

export type HistoryIndicatorValueDataResponse = {
  data: HistoryIndicatorValueResponse;
  meta: HistoryIndicatorPagniationMeta;
};

export type HistoryIndicatorValueResponse = {
  indicator: HistoryIndicatorInfo;
  values: HistoryIndicatorValueItemResponse[];
};

export type HistoryIndicatorPagniationMeta = {
  total: number;
  hasNextData: true;
  cursor: string;
};

export type HistoryIndicatorInfo = {
  id: string;
  ticker: string;
  name: string;
};

export type HistoryIndicatorValueItemResponse = {
  date: string;
  value: number;
};

export const useFetchHistoryIndicatorValue = (indicatorIdS: string[]) => {
  // logic: interval 로직 추가 필요
  const INTERVAL = 'day';

  const getKey = (pageIndex: number, previousPageData: HistoryIndicatorsValueResponse | null) => {
    const maxCursorDate = previousPageData
      ? previousPageData.indicatorsValue
          .map((indicator) => indicator.meta.cursor)
          .sort()
          .pop()
      : '20240101';

    if (!maxCursorDate) return null;

    const newStartDate = formatTime(calculateDate(parseTime(maxCursorDate) ?? maxCursorDate, 10));

    const url = `${API_PATH.indicatorValue}/history?startDate=${newStartDate}&endDate=${maxCursorDate}&interval=${INTERVAL}`;
    return [url, ...indicatorIdS];
  };

  return useSWRInfinite<HistoryIndicatorsValueResponse>(getKey, fetchIndicatorsValue, {
    initialSize: 0,
  });
};
