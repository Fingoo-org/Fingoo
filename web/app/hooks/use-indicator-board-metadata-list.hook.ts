import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';
import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
} from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../querys/numerical-guidance/indicator-board-metadata.query';

export const useIndicatoBoardrMetadataList = () => {
  const { data } = useFetchIndicatorBoardMetadataList();
  const { trigger, error: createMetadataError, isMutating } = useCreateIndicatorMetadata();
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);

  const createAndSelectMetadata = async (metadata: CreateIndicatorMetadataRequestBody) => {
    try {
      await trigger(metadata);
    } catch (e) {
      selectMetadata(null);
      // error 처리 필요
    }
  };

  return {
    metadataList: data?.metadataList,
    createMetadataError,
    createAndSelectMetadata,
    isMutating,
  };
};
