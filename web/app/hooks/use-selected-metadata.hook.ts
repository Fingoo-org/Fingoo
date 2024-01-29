import { useFetchMetadata } from '../api/query/numerical-guidance.query';
import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';

export const useSelectedMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const { data: selectedMetadata } = useFetchMetadata(selectedMetadataId);

  return {
    selectedMetadata,
    selectedIndicators: selectedMetadata?.indicators,
  };
};
