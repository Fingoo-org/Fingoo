import {
  IndicatorBoardMetadataResponse,
  useDeleteIndicatorFromMetadata,
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
  useUpdateIndicatorIdsWithsectionIds,
  useUploadIndicatorBoardMetadataImage,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { convertIndicatorBoardMetadataList } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-list-view-model.service';
import { useMemo } from 'react';
import { useIndicatorBoardMetadataStore } from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';

export const useIndicatorBoardMetadataViewModel = (metadataId: string | undefined) => {
  const { data: indicatorBoardMetadataList } = useFetchIndicatorBoardMetadataList();

  const { trigger: deleteIndicatorTrigger } = useDeleteIndicatorFromMetadata(metadataId);
  const { trigger: updateIndicatorBoardMetadataTrigger } = useUpdateIndicatorBoardMetadata(metadataId);
  const { trigger: updateIndicatorIdsWithsectionIdsTrigger } = useUpdateIndicatorIdsWithsectionIds(metadataId);
  const { trigger: uploadIndicatorBoardMetadataImageTrigger } = useUploadIndicatorBoardMetadataImage();

  const indicatorsUnitType = useIndicatorBoardMetadataStore(
    (state) => state.indicatorsInMetadataUnitType[metadataId ?? ''],
  );
  const { updateUnitType } = useIndicatorBoardMetadataStore((state) => state.actions);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndicatorBoardMetadataList(indicatorBoardMetadataList);
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
          const newIndicatorBoardMetadataList =
            convertedIndicatorBoardMetadataList?.updateIndicatorBoardMetadataNameById(metadataId, newData.name);
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
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
          const newIndicatorBoardMetadataList = convertedIndicatorBoardMetadataList?.updateIndicatorIdsWithsectionIds(
            metadataId,
            data,
          );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const addsectionToIndicatorBoardMetadata = () => {
    if (!indicatorBoardMetadata) return;

    updateIndicatorIdsWithsectionIdsTrigger(
      {
        sections: indicatorBoardMetadata?.indicatorIdsWithSectionIds,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList =
            convertedIndicatorBoardMetadataList?.addSectionToIndicatorBoardMetadata(metadataId);
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const deleteSectionFromIndicatorBoardMetadata = (sectionId: number) => {
    if (!indicatorBoardMetadata) return;

    updateIndicatorIdsWithsectionIdsTrigger(
      {
        sections: indicatorBoardMetadata?.indicatorIdsWithSectionIds,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList =
            convertedIndicatorBoardMetadataList?.deleteSectionFromIndicatorBoardMetadata(metadataId, sectionId);

          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const deleteIndicatorFromMetadata = (indicatorId: string) => {
    if (!indicatorBoardMetadata) {
      return;
    }

    deleteIndicatorTrigger(
      {
        indicatorId,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList = convertedIndicatorBoardMetadataList?.deleteIndicatorFromMetadataById(
            metadataId,
            indicatorId,
          );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const uploadIndicatorBoardMetadataImage = async (imageBlod: Blob) => {
    const formData = new FormData();
    formData.append('fileName', imageBlod);
    return await uploadIndicatorBoardMetadataImageTrigger(formData, {
      revalidate: false,
    });
  };

  return {
    indicatorBoardMetadata,
    indicatorsUnitType,
    updateIndicatorBoardMetadata,
    updateIndicatorIdsWithsectionIds,
    addsectionToIndicatorBoardMetadata,
    deleteSectionFromIndicatorBoardMetadata,
    uploadIndicatorBoardMetadataImage,
    deleteIndicatorFromMetadata,
    updateUnitType,
  };
};
