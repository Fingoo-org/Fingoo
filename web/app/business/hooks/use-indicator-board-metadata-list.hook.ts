import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useMemo, useRef } from 'react';
import { convertIndcatorBoardMetadataList } from '../services/view-model/indicator-board-metadata-view-model.service';

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

  const metadataList = useMemo(() => {
    if (!data) return undefined;

    return convertIndcatorBoardMetadataList(data);
  }, [data]);

  return {
    metadataList,
    isPending: isPending.current,
    createMetadata,
    deleteMetadata,
  };
};
