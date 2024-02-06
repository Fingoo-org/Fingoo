import { useMemo } from 'react';
import {
  AddIndicatorToMetadataRequestBody,
  useAddIndicatorToMetadata,
  useDeleteIndicatorFromMetadata,
  useFetchIndicatorBoardMetadataList,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useNumericalGuidanceStore } from '../../store/stores/numerical-guidance.store';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
  const { data: metadataList } = useFetchIndicatorBoardMetadataList();
  const { trigger: updateTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteTigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);

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
      updateTrigger(indicator, {
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
      deleteTigger(indicatorKey, {
        // Note: production 일 때 낙천적 업데이트와 일반 업데이트의 ux 차이를 평가할 필요가 있음
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

  return {
    selectedMetadata,
    addIndicatorToMetadata,
    deleteIndicatorFromMetadata,
    selectMetadataById: selectMetadata,
  };
};
