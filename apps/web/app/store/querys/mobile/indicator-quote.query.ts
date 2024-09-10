import useSWRImmutable from 'swr/immutable';
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type IndicatorQuoteRequest = {
  indicatorId: string;
  symbol: string;
  indicatorType: IndicatorType;
  volumeTimePeriod: string;
  micCode: string;
  eod: boolean;
  interval: string;
  timezone: string;
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

export const useFetchIndicatorQuote = (parameter: IndicatorQuoteRequest) =>
  useSWRImmutable<IndicatorQuoteResponse>(
    `${API_PATH.indicatorQuote}/indicatorId=${parameter.indicatorId}&symbol=${parameter.symbol}&indicatorType=${parameter.indicatorType}&volumeTimePeriod=${parameter.volumeTimePeriod}&micCode=${parameter.micCode}&eod=${parameter.eod}&interval=${parameter.interval}&timezone=${parameter.timezone}`,
    defaultFetcher,
  );
