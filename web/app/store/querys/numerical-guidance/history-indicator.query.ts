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

const getFetchHistoryIndicatorValueKey = (
  pageIndex: number,
  previousPageData: HistoryIndicatorsValueResponse | null,
) => {
  const maxCursorDate = previousPageData
    ? previousPageData.indicatorsValue
        .map((indicator) => indicator.meta.cursor)
        .sort()
        .pop()
    : '20240101';

  if (!maxCursorDate) return null;

  return [`${API_PATH.indicatorValue}/history`, maxCursorDate, 'day'];
};

export const useFetchHistoryIndicatorValue = (indicatorIds: string[], rowsToDownload = 10) => {
  // logic: interval 로직 추가 필요

  return useSWRInfinite<HistoryIndicatorsValueResponse>(
    getFetchHistoryIndicatorValueKey,
    ([url, maxCursorDate, interval]) => {
      console.log('trigger', rowsToDownload);
      const newStartDate = formatTime(calculateDate(parseTime(maxCursorDate) ?? maxCursorDate, rowsToDownload + 5));
      const formattedUrl = `${url}?startDate=${newStartDate}&endDate=${maxCursorDate}&interval=${interval}`;

      return fetchIndicatorsValue([formattedUrl, ...indicatorIds]);
    },
    {
      initialSize: 0,
    },
  );
};
