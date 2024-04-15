import useSWRInfinite from 'swr/infinite';
import { API_PATH } from '../api-path';
import { fetchIndicatorsValue } from '../fetcher';
import { utcFormat, utcParse } from 'd3-time-format';
import type { Interval } from '../../stores/numerical-guidance/workspace.store';
import { IndicatorType } from './indicator.query';

export const parseTime = utcParse('%Y%m%d');
export const formatTime = utcFormat('%Y%m%d');

export type HistoryIndicatorsValueResponse = {
  indicatorsValue: HistoryIndicatorValueCursorPaginationResponse[];
};

export type HistoryIndicatorValueCursorPaginationResponse = {
  data: HistoryIndicatorValueResponse;
  meta: HistoryIndicatorCursorPaginationMetadataResponse;
};

export type HistoryIndicatorValueResponse = {
  indicator: HistoryIndicatorInfo;
  values: HistoryIndicatorValueItemResponse[];
};

export type HistoryIndicatorCursorPaginationMetadataResponse = {
  total: number;
  hasNextData: boolean;
  cursor: string;
};

export type HistoryIndicatorInfo = {
  id: string;
  ticker: string;
  name: string;
  market: string;
  type: IndicatorType;
};

export type HistoryIndicatorValueItemResponse = {
  date: string;
  value: number;
};

export type PaginationData = {
  initialCursorDate: Date;
  rowsToDownload: number;
};

export const useFetchHistoryIndicatorValue = (
  indicatorIds: string[] | undefined,
  paginationData: PaginationData,
  interval: Interval = 'day',
  key: string,
) => {
  // logic: interval 로직 추가 필요

  const getFetchHistoryIndicatorValueKey = (
    pageIndex: number,
    previousPageData: HistoryIndicatorsValueResponse | null,
  ) => {
    const maxCursorDate = previousPageData
      ? previousPageData.indicatorsValue
          .map((indicator) => indicator.meta.cursor)
          .sort()
          .pop()
      : formatTime(paginationData.initialCursorDate);

    if (!maxCursorDate) return null;

    return [API_PATH.historyIndicatorsValue, maxCursorDate, key];
  };

  return useSWRInfinite<HistoryIndicatorsValueResponse>(
    getFetchHistoryIndicatorValueKey,
    ([url, maxCursorDate]) => {
      const formattedUrl = `${url}?dataCount=${paginationData.rowsToDownload}&endDate=${maxCursorDate}`;

      // not null-assertion: indicatorIds가 null 인 상황에서는 호출되지 않음
      return fetchIndicatorsValue([formattedUrl, interval, ...indicatorIds!]);
    },
    {
      initialSize: 0,
      revalidateFirstPage: false,
    },
  );
};
