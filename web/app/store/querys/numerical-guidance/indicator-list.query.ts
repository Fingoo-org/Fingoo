import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type IndicatorInfoResponse = {
  id: string;
  ticker: string;
  name: string;
};

export type StocksIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'stocks';
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  mic_code: string;
  type: string;
};

export type ForexPairsIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'forex_pairs';
  symbol: string;
  currency_group: string;
  currency_base: string;
  currency_quote: string;
};

export type CryptocurrenciesIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'cryptocurrencies';
  symbol: string;
  available_exchanges: string[];
  currency_base: string;
  currency_quote: string;
};

export type EtfIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'etf';
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
};

export type IndicesIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'indices';
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  mic_code: string;
};

export type FundsIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'funds';
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  type: string;
};

export type BondsIndicatorResponse = {
  id: string;
  index: number;
  indicatorType: 'bonds';
  symbol: string;
  name: string;
  country: string;
  currency: string;
  exchange: string;
  type: string;
};

export type indicatorListResponse =
  | StocksIndicatorResponse
  | ForexPairsIndicatorResponse
  | CryptocurrenciesIndicatorResponse
  | EtfIndicatorResponse
  | IndicesIndicatorResponse
  | FundsIndicatorResponse
  | BondsIndicatorResponse;

export const useFetchIndicatorList = () => useSWR<IndicatorInfoResponse[]>(API_PATH.indicatorList, defaultFetcher);
