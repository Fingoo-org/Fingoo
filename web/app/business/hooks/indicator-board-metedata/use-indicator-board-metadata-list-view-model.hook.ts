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
  const { data: indicatorBoardMetadataList, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteIndicatorBoardMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createIndicatorBoardMetadataTrigger, isMutating: isCreateIndicatorMetadataMutationg } =
    useCreateIndicatorMetadata();
  const isPending = useRef(false);

  isPending.current = calculateIsPending(isValidating, isCreateIndicatorMetadataMutationg);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  const createIndicatorBoardMetadata = async (data: CreateIndicatorMetadataRequestBody) => {
    try {
      await createIndicatorBoardMetadataTrigger(data);
    } catch {
      // error: 전역 에러 처리 or 에러 바운더리에서 처리
    }
  };

  const deleteIndicatorBoardMetadata = async (metadataId: string) => {
    deleteIndicatorBoardMetadataTrigger(metadataId, {
      optimisticData: () => {
        convertedIndicatorBoardMetadataList?.deleteIndicatorBoardMetadata(metadataId);
        return {
          metadataList: convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList,
        };
      },
      revalidate: false,
    });
  };

  return {
    metadataList: convertedIndicatorBoardMetadataList,
    isPending: isPending.current,
    createIndicatorBoardMetadata,
    deleteIndicatorBoardMetadata,
  };
};
