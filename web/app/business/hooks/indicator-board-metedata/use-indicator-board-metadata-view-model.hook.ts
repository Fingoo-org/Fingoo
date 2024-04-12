import {
  IndicatorBoardMetadataResponse,
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
  useUpdateIndicatorIdsWithsectionIds,
  useUploadIndicatorBoardMetadataImage,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { convertIndcatorBoardMetadataList } from '../../services/view-model/indicator-board-metadata-view-model.service';
import { useMemo } from 'react';

export const useIndicatorBoardMetadataViewModel = (metadataId: string | undefined) => {
  const { data: indicatorBoardMetadataList } = useFetchIndicatorBoardMetadataList();

  const { trigger: updateIndicatorBoardMetadataTrigger } = useUpdateIndicatorBoardMetadata(metadataId);
  const { trigger: updateIndicatorIdsWithsectionIdsTrigger } = useUpdateIndicatorIdsWithsectionIds(metadataId);
  const { trigger: uploadIndicatorBoardMetadataImageTrigger } = useUploadIndicatorBoardMetadataImage();

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
        name: newData.name,
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

  const updateIndicatorIdsWithsectionIds = (data: { [sectionId: string]: string[] }) => {
    updateIndicatorIdsWithsectionIdsTrigger(
      {
        sections: data,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          convertedIndicatorBoardMetadataList?.updateIndicatorIdsWithsectionIds(metadataId, data);
          return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const addsectionToIndicatorBoardMetadata = () => {
    if (!indicatorBoardMetadata) return;

    indicatorBoardMetadata?.addsection();
    updateIndicatorIdsWithsectionIdsTrigger(
      {
        sections: indicatorBoardMetadata?.indicatorIdsWithSectionIds,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const deleteSectionFromIndicatorBoardMetadata = (sectionId: number) => {
    if (!indicatorBoardMetadata) return;

    indicatorBoardMetadata?.deletesection(sectionId);
    updateIndicatorIdsWithsectionIdsTrigger(
      {
        sections: indicatorBoardMetadata?.indicatorIdsWithSectionIds,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const uploadIndicatorBoardMetadataImage = async (imageBlod: Blob) => {
    const formData = new FormData();
    formData.append('fileName', imageBlod);
    return await uploadIndicatorBoardMetadataImageTrigger(formData);
  };

  return {
    indicatorBoardMetadata,
    updateIndicatorBoardMetadata,
    updateIndicatorIdsWithsectionIds,
    addsectionToIndicatorBoardMetadata,
    deleteSectionFromIndicatorBoardMetadata,
    uploadIndicatorBoardMetadataImage,
  };
};
