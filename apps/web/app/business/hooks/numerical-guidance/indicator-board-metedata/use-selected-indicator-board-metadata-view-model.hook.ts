import { useMemo } from 'react';
import {
  AddIndicatorToMetadataRequestBody,
  IndicatorBoardMetadataResponse,
  IndicatorInfoResponse,
  useAddCustomForecastIndicatorToMetadata,
  useAddIndicatorToMetadata,
  useDeleteCustomForecastIndicatorFromMetadata,
  useDeleteIndicatorFromMetadata,
  useFetchIndicatorBoardMetadataList,
} from '../../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useWorkspaceStore } from '../../../../store/stores/numerical-guidance/workspace.store';
import { convertIndcatorBoardMetadataList } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-list-view-model.service';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useWorkspaceStore((state) => state.selectedMetadataId);
  const selectMetadata = useWorkspaceStore((state) => state.actions.selectMetadata);
  const { data: indicatorBoardMetadataList } = useFetchIndicatorBoardMetadataList();

  const { trigger: addIndicatorTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteIndicatorTrigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);
  const { trigger: addCustomForecastIndicatorTrigger } = useAddCustomForecastIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteCustomForecastIndicatorTrigger } =
    useDeleteCustomForecastIndicatorFromMetadata(selectedMetadataId);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  const selectedMetadata = useMemo(() => {
    if (!selectedMetadataId) return undefined;
    return convertedIndicatorBoardMetadataList?.findIndicatorBoardMetadataById(selectedMetadataId);
  }, [selectedMetadataId, convertedIndicatorBoardMetadataList]);

  const addIndicatorToMetadata = (indicatorInfo: IndicatorInfoResponse) => {
    if (!selectedMetadata) {
      return;
    }

    addIndicatorTrigger(
      { indicatorId: indicatorInfo.id, indicatorType: indicatorInfo.indicatorType },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList = convertedIndicatorBoardMetadataList?.addIndicatorToMetadataById(
            selectedMetadataId,
            indicatorInfo,
          );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const addCustomForecastIndicatorToMetadata = (customForecastIndicatorId: string) => {
    if (!selectedMetadata) {
      return;
    }

    addCustomForecastIndicatorTrigger(
      {
        customForecastIndicatorId,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList =
            convertedIndicatorBoardMetadataList?.addCustomForecastIndicatorToMetadataById(
              selectedMetadataId,
              customForecastIndicatorId,
            );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const deleteIndicatorFromMetadata = (indicatorId: string) => {
    if (!selectedMetadata) {
      return;
    }

    deleteIndicatorTrigger(
      {
        indicatorId,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList = convertedIndicatorBoardMetadataList?.deleteIndicatorFromMetadataById(
            selectedMetadataId,
            indicatorId,
          );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  const deleteCustomForecastIndicatorFromMetadata = (customForecastIndicatorId: string) => {
    if (!selectedMetadata) {
      return;
    }

    deleteCustomForecastIndicatorTrigger(
      {
        customForecastIndicatorId,
      },
      {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          const newIndicatorBoardMetadataList =
            convertedIndicatorBoardMetadataList?.deleteCustomForecastIndicatorFromMetadataById(
              selectedMetadataId,
              customForecastIndicatorId,
            );
          return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      },
    );
  };

  return {
    selectedMetadataId,
    selectedMetadata,
    addIndicatorToMetadata,
    deleteIndicatorFromMetadata,
    addCustomForecastIndicatorToMetadata,
    selectMetadataById: selectMetadata,
    deleteCustomForecastIndicatorFromMetadata,
  };
};
