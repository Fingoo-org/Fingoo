import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';

import { useCreateIndicatorMetadata } from '../api/command/numerical-guidance.command';
import { useFetchIndicatorMetadataList } from '../api/query/numerical-guidance.query';
import { IndicatorBoardMetadata } from '../api/type/numerical-guidance.type';

export const useIndicatorMetadataList = () => {
  const { metadataList, error, isLoading } = useFetchIndicatorMetadataList();
  const { trigger, mutationError } = useCreateIndicatorMetadata();
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);

  const createAndSelectMetadata = async (metadata: IndicatorBoardMetadata) => {
    try {
      await trigger(metadata, {
        optimisticData: () => {
          selectMetadata(metadata.id);
          return {
            metadataList: [...(metadataList || []), metadata],
          };
        },
        revalidate: false,
      });
    } catch (e) {
      selectMetadata(null);
      // error 처리 필요
    }
  };

  return {
    metadataList,
    error,
    isLoading,
    mutationError,
    createAndSelectMetadata,
  };
};
