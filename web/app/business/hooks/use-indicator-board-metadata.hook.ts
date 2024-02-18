import {
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export const useIndicatorBoardMetadata = (metadataId: string | undefined) => {
  const { data: metadataList } = useFetchIndicatorBoardMetadataList();
  const { trigger: updateMetadataTrigger } = useUpdateIndicatorBoardMetadata(metadataId);
  const metadata = metadataList?.metadataList.find((metadata) => metadata.id === metadataId);

  const updateMetadata = (newData: { name: string }) => {
    updateMetadataTrigger(newData, {
      optimisticData: () => {
        return {
          metadataList: metadataList?.metadataList.map((metadata) => {
            if (metadata.id === metadataId) {
              return {
                ...metadata,
                ...newData,
              };
            }
            return metadata;
          }),
        };
      },
      revalidate: false,
    });
  };

  return {
    metadata,
    updateMetadata,
  };
};
