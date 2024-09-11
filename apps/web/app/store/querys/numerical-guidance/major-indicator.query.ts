import useSWRImmutable from 'swr/immutable';
import { API_PATH } from '../api-path';
import { defaultFetcher } from '../fetcher';

export type TimelineProps = {
  time: string;
  value: number;
};

export type MajorIndicatorResponse = {
  country: string;
  symbolName: string;
  symbolPrice: number;
  symbolChanges: number;
  timeline: TimelineProps[];
};

export const useFetchMajorIndicatorWithCountry = (country: string) =>
  useSWRImmutable<MajorIndicatorResponse[]>(`${API_PATH.majorChart}/${country}`, defaultFetcher);
