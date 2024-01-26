import useSWR from 'swr';
import { API_PATH } from '../constants/api-path';
import { defaultFetcher } from './fetcher';
import { IndicatorBoardMetadata } from '../../store/indicator-board-metadata.slice';

type ResponseIndicatorBoardMetadata = {
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
