import {
  CreateIndicatorMetadataRequestBody,
  IndicatorBoardMetadataResponse,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useEffect, useMemo } from 'react';
import { convertIndcatorBoardMetadataList } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-list-view-model.service';
import {
  IndicatorInMetadataUnitTypes,
  useIndicatorBoardMetadataStore,
} from '@/app/store/stores/numerical-guidance/indicator-board-metadata.store';
import { createNotDuplicatedName } from '@/app/utils/helper';

export const useIndicatorBoardMetadataList = () => {
  const {
    data: indicatorBoardMetadataList,
    isValidating,
    mutate: revalidateIndicatorBoardMetadataList,
  } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteIndicatorBoardMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createIndicatorBoardMetadataTrigger, isMutating: isCreateIndicatorMetadataMutating } =
    useCreateIndicatorMetadata();

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

  const createIndicatorBoardMetadata = async (name?: string) => {
    const metadata = {
      indicatorBoardMetadataName: createNotDuplicatedName(
        name ?? '메타데이터',
        convertedIndicatorBoardMetadataList?.names ?? [],
      ),
    };

    const indicatorBoardMetadataId = await createIndicatorBoardMetadataTrigger(metadata);
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
    isCreateIndicatorMetadataMutating,
    isPending: isValidating,
    createIndicatorBoardMetadata,
    deleteIndicatorBoardMetadata,
    revalidateIndicatorBoardMetadataList,
  };
};
