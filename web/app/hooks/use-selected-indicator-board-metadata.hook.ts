import {
  AddIndicatorToMetadataRequestBody,
  useAddIndicatorToMetadata,
  useDeleteIndicatorFromMetadata,
} from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchMetadata } from '../querys/numerical-guidance/indicator-board-metadata.query';
import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const { data: selectedMetadata } = useFetchMetadata(selectedMetadataId);
  const { trigger: updateTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteTigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);

  // 뷰모델로 매핑 안하고 사용 시
  const addIndicatorToMetadata = (indicator: AddIndicatorToMetadataRequestBody) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      updateTrigger(indicator, {
        optimisticData: () => {
          return {
            ...selectedMetadata,
            indicators: [...selectedMetadata.indicators, indicator],
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
            ...selectedMetadata,
            indicators: selectedMetadata.indicators.filter((indicator) => indicator.ticker !== indicatorKey),
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
  };
};
