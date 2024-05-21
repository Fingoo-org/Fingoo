import {
  CreateIndicatorMetadataRequestBody,
  IndicatorBoardMetadataResponse,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useEffect, useMemo } from 'react';
import { convertIndcatorBoardMetadataList } from '../../../services/numerical-guidance/view-model/indicator-board-metadata-view-model.service';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';
import {
  IndicatorInMetadataUnitTypes,
  useIndicatorBoardMetadataStore,
} from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';

export const useIndicatorBoardMetadataList = () => {
  const { data: indicatorBoardMetadataList, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteIndicatorBoardMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createIndicatorBoardMetadataTrigger, isMutating: isCreateIndicatorMetadataMutationg } =
    useCreateIndicatorMetadata();
  const { isPending } = usePending(isValidating, isCreateIndicatorMetadataMutationg);
  const { initIndicatorsInMetadataUnitType, updateIndicatorsInMetadataUnitType } = useIndicatorBoardMetadataStore(
    (state) => state.actions,
  );
  const isUnitTypeInitialized = useIndicatorBoardMetadataStore((state) => state.isUnitTypeInitialized);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  useEffect(() => {
    if (convertedIndicatorBoardMetadataList) {
      const indicatorsInMetadataUnitType = convertedIndicatorBoardMetadataList.reduce<IndicatorInMetadataUnitTypes>(
        (acc, metadata) => {
          acc[metadata.id] = [...metadata.indicatorIds, ...metadata.customForecastIndicatorIds].map((indicatorId) => ({
            indicatorId,
            unitType: 'default',
          }));
          return acc;
        },
        {},
      );

      if (isUnitTypeInitialized) {
        updateIndicatorsInMetadataUnitType(indicatorsInMetadataUnitType);
      } else {
        initIndicatorsInMetadataUnitType(indicatorsInMetadataUnitType);
      }
    }
  }, [convertedIndicatorBoardMetadataList]);

  const createIndicatorBoardMetadata = async (data: CreateIndicatorMetadataRequestBody) => {
    const indicatorBoardMetadataId = await createIndicatorBoardMetadataTrigger(data);
    return indicatorBoardMetadataId;
  };

  const deleteIndicatorBoardMetadata = async (metadataId: string) => {
    deleteIndicatorBoardMetadataTrigger(metadataId, {
      optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
        const newIndicatorBoardMetadataList =
          convertedIndicatorBoardMetadataList?.deleteIndicatorBoardMetadata(metadataId);
        return newIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
      },
      revalidate: false,
    });
  };

  return {
    metadataList: convertedIndicatorBoardMetadataList,
    isPending,
    createIndicatorBoardMetadata,
    deleteIndicatorBoardMetadata,
  };
};
