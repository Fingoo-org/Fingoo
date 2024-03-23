import {
  IndicatorBoardMetadataResponse,
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { convertIndcatorBoardMetadataList } from '../../services/view-model/indicator-board-metadata-view-model.service';
import { useMemo } from 'react';

export const useIndicatorBoardMetadataViewModel = (metadataId: string | undefined) => {
  const { data: indicatorBoardMetadataList } = useFetchIndicatorBoardMetadataList();
  const { trigger: updateIndicatorBoardMetadataTrigger } = useUpdateIndicatorBoardMetadata(metadataId);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  const indicatorBoardMetadata = metadataId
    ? convertedIndicatorBoardMetadataList?.findIndicatorBoardMetadataById(metadataId)
    : undefined;

  const updateIndicatorBoardMetadata = (newData: { name: string }) => {
    updateIndicatorBoardMetadataTrigger(
      {
        indicatorBoardMetadataName: newData.name,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          convertedIndicatorBoardMetadataList?.updateIndicatorBoardMetadataNameById(metadataId, newData.name);
          return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  return {
    indicatorBoardMetadata,
    updateIndicatorBoardMetadata,
  };
};
