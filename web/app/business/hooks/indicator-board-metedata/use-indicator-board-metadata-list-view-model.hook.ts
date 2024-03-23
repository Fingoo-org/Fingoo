import {
  CreateIndicatorMetadataRequestBody,
  IndicatorBoardMetadataResponse,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useMemo } from 'react';
import { convertIndcatorBoardMetadataList } from '../../services/view-model/indicator-board-metadata-view-model.service';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';

export const useIndicatorBoardMetadataList = () => {
  const { data: indicatorBoardMetadataList, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteIndicatorBoardMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createIndicatorBoardMetadataTrigger, isMutating: isCreateIndicatorMetadataMutationg } =
    useCreateIndicatorMetadata();
  const { isPending } = usePending(isValidating, isCreateIndicatorMetadataMutationg);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  const createIndicatorBoardMetadata = async (data: CreateIndicatorMetadataRequestBody) => {
    const indicatorBoardMetadataId = await createIndicatorBoardMetadataTrigger(data);
    return indicatorBoardMetadataId;
  };

  const deleteIndicatorBoardMetadata = async (metadataId: string) => {
    deleteIndicatorBoardMetadataTrigger(metadataId, {
      optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
        convertedIndicatorBoardMetadataList?.deleteIndicatorBoardMetadata(metadataId);
        return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
      },
      revalidate: false,
    });
  };

  return {
    metadataList: convertedIndicatorBoardMetadataList,
    isPending,
    createIndicatorBoardMetadata,
    deleteIndicatorBoardMetadata,
  };
};
