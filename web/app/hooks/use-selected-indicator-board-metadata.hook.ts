import {
  AddIndicatorToMetadataRequestBody,
  useAddIndicatorToMetadata,
} from '../api/command/numerical-guidance.command';
import { useFetchMetadata } from '../api/query/numerical-guidance.query';
import { useNumericalGuidanceStore } from '../stores/numerical-guidance.store';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const { data: selectedMetadata } = useFetchMetadata(selectedMetadataId);
  const { trigger } = useAddIndicatorToMetadata(selectedMetadataId);

  // 뷰모델로 매핑 안하고 사용 시
  const addIndicatorToMetadata = (indicator: AddIndicatorToMetadataRequestBody) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      trigger(indicator, {
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

  return {
    selectedMetadata,
    selectedIndicators: selectedMetadata?.indicators,
    addIndicatorToMetadata,
  };
};
