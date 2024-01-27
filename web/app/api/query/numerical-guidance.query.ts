import useSWR from 'swr';
import { API_PATH } from '../api-path';

type IndicatorResponse = {
  id: string;
};

type IndicatorBoardMetadataResponse = {
  id: string;
  name: string;
  indicators: IndicatorResponse[];
};

type IndicatorBoardMetadataListResponse = {
  metadataList: IndicatorBoardMetadataResponse[];
};

export const useFetchIndicatorMetadataList = () => {
  const { data, error, isLoading } = useSWR<IndicatorBoardMetadataListResponse>(API_PATH.metadataList);
  return {
    metadataList: data?.metadataList,
    error,
    isLoading,
  };
};
