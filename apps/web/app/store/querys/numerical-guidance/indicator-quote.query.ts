import useSWRImmutable from 'swr/immutable';
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type IndicatorQuoteRequest = {
  indicatorId: string;
  symbol: string;
  indicatorType: IndicatorType;
  volumeTimePeriod?: string;
  micCode?: string;
  eod?: boolean;
  interval?: string;
  timezone?: string;
};

export type FiftyTwoWeek = {
  low: string;
  high: string;
  lowChange: string;
  highChange: string;
  lowChangePercent: string;
  highChangePercent: string;
  range: string;
};

export type IndicatorQuoteResponse = {
  symbol: string;
  name: string;
  exchange: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  previousClose: string;
  change: string;
  percentChange: string;
  isMarketOpen: boolean;
  fiftyTwoWeek: FiftyTwoWeek;
  micCode: string;
  currency: string;
  volume: string;
  averageVolume: string;
};

export const useFetchIndicatorQuote = (parameter: IndicatorQuoteRequest) => {
  const queryParams = new URLSearchParams({
    indicatorId: parameter.indicatorId,
    symbol: parameter.symbol,
    indicatorType: parameter.indicatorType,
  });

  if (parameter.volumeTimePeriod) queryParams.append('volumeTimePeriod', parameter.volumeTimePeriod);
  if (parameter.micCode) queryParams.append('micCode', parameter.micCode);
  if (parameter.eod !== undefined) queryParams.append('eod', String(parameter.eod));
  if (parameter.interval) queryParams.append('interval', parameter.interval);
  if (parameter.timezone) queryParams.append('timezone', parameter.timezone);

  const url = `${API_PATH.indicatorQuote}?${queryParams.toString()}`;

  return useSWRImmutable<IndicatorQuoteResponse>(url, defaultFetcher);
};
