import { useMemo } from 'react';
import {
  AddIndicatorToMetadataRequestBody,
  useAddIndicatorToMetadata,
  useDeleteIndicatorFromMetadata,
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useNumericalGuidanceStore } from '../../store/stores/numerical-guidance.store';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
  const { data: metadataList } = useFetchIndicatorBoardMetadataList();
  const { trigger: addIndicatorTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteIndicatorTrigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);
  const { trigger: updateTrigger } = useUpdateIndicatorBoardMetadata(selectedMetadataId);

  const selectedMetadata = useMemo(
    () => metadataList?.metadataList.find((metadata) => metadata.id === selectedMetadataId),
    [selectedMetadataId, metadataList],
  );

  // 뷰모델로 매핑 안하고 사용 시
  const addIndicatorToMetadata = (indicator: AddIndicatorToMetadataRequestBody) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      addIndicatorTrigger(indicator, {
        optimisticData: () => {
          return {
            metadataList: metadataList?.metadataList.map((metadata) => {
              if (metadata.id === selectedMetadataId) {
                return {
                  ...metadata,
                  indicators: [...metadata.indicators, indicator],
                };
              }
              return { ...metadata };
            }),
          };
        },
        revalidate: false,
      });
    } catch (e) {
      // error 처리 필요 or 전역 에러 처리
    }
  };

  const deleteIndicatorFromMetadata = (indicatorKey: string) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      deleteIndicatorTrigger(indicatorKey, {
        optimisticData: () => {
          return {
            metadataList: metadataList?.metadataList.map((metadata) => {
              if (metadata.id === selectedMetadataId) {
                return {
                  ...metadata,
                  indicators: selectedMetadata.indicators.filter((indicator) => indicator.ticker !== indicatorKey),
                };
              }
              return metadata;
            }),
          };
        },
        revalidate: false,
      });
    } catch (e) {
      // error 처리 필요 or 전역 에러 처리
    }
  };

  const updateMetadata = (data: { name: string }) => {
    if (!selectedMetadata) {
      return;
    }
    updateTrigger(data, {
      optimisticData: () => {
        return {
          metadataList: metadataList?.metadataList.map((metadata) => {
            if (metadata.id === selectedMetadataId) {
              return {
                ...metadata,
                ...data,
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
    selectedMetadata,
    addIndicatorToMetadata,
    deleteIndicatorFromMetadata,
    updateMetadata,
    selectMetadataById: selectMetadata,
  };
};
