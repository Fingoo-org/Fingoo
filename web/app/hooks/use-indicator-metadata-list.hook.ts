import { useFetchIndicatorMetadataList } from '../api/query/numerical-guidance.query';

export const useIndicatorMetadataList = () => {
  const { metadataList, error, isLoading } = useFetchIndicatorMetadataList();

  return {
    metadataList,
    error,
    isLoading,
  };
};
