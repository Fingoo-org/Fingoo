import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useMemo, useRef } from 'react';
import { convertIndcatorBoardMetadataList } from '../../services/view-model/indicator-board-metadata-view-model.service';
import { calculateIsPending } from '@/app/utils/helper';

export const useIndicatorBoardMetadataList = () => {
  const { data: metadataList, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createMetadataTrigger, isMutating } = useCreateIndicatorMetadata();
  const isPending = useRef(false);

  isPending.current = calculateIsPending(isValidating, isMutating);

  const convertedMetadataList = useMemo(() => {
    if (!metadataList) return undefined;

    return convertIndcatorBoardMetadataList(metadataList);
  }, [metadataList]);

  const createMetadata = async (data: CreateIndicatorMetadataRequestBody) => {
    try {
      await createMetadataTrigger(data);
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
