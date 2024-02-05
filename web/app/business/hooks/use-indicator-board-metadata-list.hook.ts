import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
} from '../../querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../querys/numerical-guidance/indicator-board-metadata.query';
import { useRef } from 'react';

export const useIndicatoBoardrMetadataList = () => {
  const { data, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger, isMutating } = useCreateIndicatorMetadata();
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
      await trigger(metadata);
    } catch {
      // error: 전역 에러 처리 or 에러 바운더리에서 처리
    }
  };

  return {
    metadataList: data?.metadataList,
    createMetadata,
    isPending: isPending.current,
  };
};
