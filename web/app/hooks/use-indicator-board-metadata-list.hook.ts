import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';
import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
} from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../querys/numerical-guidance/indicator-board-metadata.query';

export const useIndicatoBoardrMetadataList = () => {
  const { data } = useFetchIndicatorBoardMetadataList();
  const { trigger, error: createMetadataError } = useCreateIndicatorMetadata();
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);

  const metadataList = data?.metadataList;
  const createAndSelectMetadata = async (metadata: CreateIndicatorMetadataRequestBody) => {
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
    createMetadataError,
    createAndSelectMetadata,
  };
};
