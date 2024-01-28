import { useFetchIndicatorBoardMetadataList } from '../api/query/numerical-guidance.query';
import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';

export const useSelectedMetadata = () => {
  const { data: metadataList } = useFetchIndicatorBoardMetadataList();
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const selectedMetadata = metadataList?.metadataList.find((metadata) => metadata.id === selectedMetadataId);

  return {
    selectedMetadata,
    selectedIndicatorList: selectedMetadata?.indicators,
  };
};
