import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useRef } from 'react';

export const useIndicatorBoardMetadataList = () => {
  const { data, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createMetadataTrigger, isMutating } = useCreateIndicatorMetadata();
  const isPending = useRef(false);

  if (isPending.current === false) {
    if (isMutating) {
      isPending.current = true;
    }
  } else {
    if (isValidating === false && isMutating === false) {
      isPending.current = false;
    }
  }

  const createMetadata = async (metadata: CreateIndicatorMetadataRequestBody) => {
    try {
      await createMetadataTrigger(metadata);
    } catch {
      // error: 전역 에러 처리 or 에러 바운더리에서 처리
    }
  };

  const deleteMetadata = async (metadataId: string) => {
    deleteMetadataTrigger(metadataId, {
      optimisticData: () => {
        return {
          metadataList: data?.metadataList?.filter((metadata) => metadata.id !== metadataId),
        };
      },
      revalidate: false,
    });
  };

  return {
    metadataList: data?.metadataList,
    isPending: isPending.current,
    createMetadata,
    deleteMetadata,
  };
};
