import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useMemo, useRef } from 'react';
import {
  IndicatorBoardMetadata,
  convertIndcatorBoardMetadataList,
} from '../services/view-model/indicator-board-metadata-view-model.service';

export const useIndicatorBoardMetadataList = () => {
  const { data: metadataList, isValidating } = useFetchIndicatorBoardMetadataList();
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

  const convertedMetadataList = useMemo(() => {
    if (!metadataList) return undefined;

    return convertIndcatorBoardMetadataList(metadataList);
  }, [metadataList]);

  const createMetadata = async (metadata: IndicatorBoardMetadata) => {
    try {
      await createMetadataTrigger(metadata.formattedIndicatorBoardMetadata);
    } catch {
      // error: 전역 에러 처리 or 에러 바운더리에서 처리
    }
  };

  const deleteMetadata = async (metadataId: string) => {
    deleteMetadataTrigger(metadataId, {
      optimisticData: () => {
        convertedMetadataList?.deleteMetadata(metadataId);
        return {
          metadataList: convertedMetadataList?.formattedIndicatorBoardMetadataList,
        };
      },
      revalidate: false,
    });
  };

  return {
    metadataList: convertedMetadataList,
    isPending: isPending.current,
    createMetadata,
    deleteMetadata,
  };
};
