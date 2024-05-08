import {
  CustomForecastIndicatorResponse,
  useCreateCustomForecastIndicator,
  useDeleteCustomForecastIndicator,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorsViewModel } from '../../../services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

export const useCustomForecastIndicatorListViewModel = () => {
  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();
  const { trigger: createCustomForecastIndicatorTrigger, isMutating: isCreateCustomForecastIndicatorMutating } =
    useCreateCustomForecastIndicator();
  const { trigger: deleteCustomForecastIndicatorTrigger } = useDeleteCustomForecastIndicator();

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
      customForecastIndicatorName: customForecastIndicatorName ?? '새로운 예측 지표',
      targetIndicatorId,
      targetIndicatorType: indicatorType,
    };

    const customForecastIndicatorId = await createCustomForecastIndicatorTrigger(body);
    return customForecastIndicatorId;
  };

  const deleteCustomForecastIndicator = async (customForecastIndicatorId: string) => {
    deleteCustomForecastIndicatorTrigger(customForecastIndicatorId, {
      optimisticData: (): CustomForecastIndicatorResponse[] | undefined => {
        convertedCustomForecastIndicatorList?.deleteCustomForecastIndicatorById(customForecastIndicatorId);
        return convertedCustomForecastIndicatorList?.formattedCustomForecastIndicatorList;
      },
      revalidate: false,
    });
  };

  return {
    customForecastIndicatorList: convertedCustomForecastIndicatorList,
    isPending,
    createCustomForecastIndicator,
    deleteCustomForecastIndicator,
  };
};
