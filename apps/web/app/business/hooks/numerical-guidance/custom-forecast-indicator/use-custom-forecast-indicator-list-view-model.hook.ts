import {
  CustomForecastIndicatorResponse,
  useCreateCustomForecastIndicator,
  useDeleteCustomForecastIndicator,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorsViewModel } from '../../../services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { usePending } from '@/app/utils/hooks/usePending.hook';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { createNotDuplicatedName } from '@/app/utils/helper';
import { useIndicatorBoardMetadataList } from '../indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';

export const useCustomForecastIndicatorListViewModel = () => {
  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();
  const { trigger: createCustomForecastIndicatorTrigger, isMutating: isCreateCustomForecastIndicatorMutating } =
    useCreateCustomForecastIndicator();
  const { trigger: deleteCustomForecastIndicatorTrigger } = useDeleteCustomForecastIndicator();

  const { revalidateIndicatorBoardMetadataList } = useIndicatorBoardMetadataList();

  const { isPending } = usePending(isValidating, isCreateCustomForecastIndicatorMutating);

  const convertedCustomForecastIndicatorList = useMemo(() => {
    if (!customForecastIndicatorList) return undefined;

    return convertCustomForecastIndicatorsViewModel(customForecastIndicatorList);
  }, [customForecastIndicatorList]);

  const createCustomForecastIndicator = async ({
    targetIndicatorId,
    indicatorType,
    customForecastIndicatorName,
  }: {
    targetIndicatorId: string;
    indicatorType: IndicatorType;
    customForecastIndicatorName?: string;
  }) => {
    const body = {
      customForecastIndicatorName: createNotDuplicatedName(
        customForecastIndicatorName ?? '새로운 예측 지표',
        convertedCustomForecastIndicatorList?.names ?? [],
      ),
      targetIndicatorId,
      targetIndicatorType: indicatorType,
    };

    const customForecastIndicatorId = await createCustomForecastIndicatorTrigger(body);
    return customForecastIndicatorId;
  };

  const deleteCustomForecastIndicator = async (customForecastIndicatorId: string) => {
    deleteCustomForecastIndicatorTrigger(customForecastIndicatorId, {
      optimisticData: (): CustomForecastIndicatorResponse[] | undefined => {
        const newCustomForecastIndicatorList =
          convertedCustomForecastIndicatorList?.deleteCustomForecastIndicatorById(customForecastIndicatorId);
        return newCustomForecastIndicatorList?.formattedCustomForecastIndicatorList;
      },
      revalidate: false,
      onSuccess: () => {
        revalidateIndicatorBoardMetadataList();
      },
    });
  };

  return {
    customForecastIndicatorList: convertedCustomForecastIndicatorList,
    isPending,
    createCustomForecastIndicator,
    deleteCustomForecastIndicator,
  };
};
