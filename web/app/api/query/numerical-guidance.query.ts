import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher } from './fetcher';
import { IndicatorBoardMetadata } from '../type/numerical-guidance.type';

export type ResponseIndicatorBoardMetadata = {
  metadataList: IndicatorBoardMetadata[];
};

export const useFetchIndicatorMetadataList = () => {
  const { data, error, isLoading } = useSWR<ResponseIndicatorBoardMetadata>(API_PATH.metadataList, defaultFetcher);
  return {
    metadataList: data?.metadataList,
    error,
    isLoading,
  };
};
