import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type IndicatorInfoResponse = {
  id: string;
  ticker: string;
  name: string;
};

export const useFetchIndicatorList = () => useSWR<IndicatorInfoResponse[]>(API_PATH.indicatorList, defaultFetcher);
