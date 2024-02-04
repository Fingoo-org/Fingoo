import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';
import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
} from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useRef } from 'react';

export const useIndicatoBoardrMetadataList = () => {
  const { data, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger, isMutating } = useCreateIndicatorMetadata();
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
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

  const createAndSelectMetadata = async (metadata: CreateIndicatorMetadataRequestBody) => {
    try {
      await trigger(metadata);
      selectMetadata(metadata.id);
    } catch (e) {
      selectMetadata(null);
      // error 처리 필요
    }
  };

  return {
    metadataList: data?.metadataList,
    createAndSelectMetadata,
    isPending: isPending.current,
  };
};
