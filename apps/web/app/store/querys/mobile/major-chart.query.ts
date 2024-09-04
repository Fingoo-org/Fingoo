import useSWRImmutable from 'swr/immutable';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type MajorChartResponse = {
  country: string;
  symbolName: string;
  symbolPrice: number;
  symbolChanges: number;
  timeLine: string[];
};

export const useFetchMajorChart = () => useSWRImmutable<MajorChartResponse[]>(API_PATH.majorChart, defaultFetcher);
