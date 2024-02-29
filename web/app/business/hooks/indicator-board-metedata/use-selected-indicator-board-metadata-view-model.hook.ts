import { useMemo } from 'react';
import {
  AddIndicatorToMetadataRequestBody,
  useAddIndicatorToMetadata,
  useDeleteIndicatorFromMetadata,
  useUpdateIndicatorBoardMetadata,
} from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useNumericalGuidanceStore } from '../../../store/stores/numerical-guidance.store';
import { useIndicatorBoardMetadataList } from './use-indicator-board-metadata-list-view-model.hook';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
  const { metadataList } = useIndicatorBoardMetadataList();
  const { trigger: addIndicatorTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteIndicatorTrigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);
  const { trigger: updateTrigger } = useUpdateIndicatorBoardMetadata(selectedMetadataId);

  const selectedMetadata = useMemo(
    () => metadataList?.find((metadata) => metadata.id === selectedMetadataId),
    [selectedMetadataId, metadataList],
  );

  // Refactor: 컴포넌트는 AddIndicatorToMetadataRequestBody를 몰라도 된다.
  const addIndicatorToMetadata = (data: AddIndicatorToMetadataRequestBody) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      addIndicatorTrigger(data, {
        optimisticData: () => {
          metadataList?.addIndicatorToMetadataById(selectedMetadataId, data.indicatorId);
          return {
            metadataList: metadataList?.formattedIndicatorBoardMetadataList,
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
          metadataList?.deleteIndicatorFromMetadataById(selectedMetadataId, indicatorKey);
          return {
            metadataList: metadataList?.formattedIndicatorBoardMetadataList,
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
        metadataList?.updateIndicatorBoardMetadatNameaById(selectedMetadataId, data.name);
        return {
          metadataList: metadataList?.formattedIndicatorBoardMetadataList,
        };
      },
      revalidate: false,
    });
  };

  return {
    selectedMetadataId,
    selectedMetadata,
    addIndicatorToMetadata,
    deleteIndicatorFromMetadata,
    updateMetadata,
    selectMetadataById: selectMetadata,
  };
};
