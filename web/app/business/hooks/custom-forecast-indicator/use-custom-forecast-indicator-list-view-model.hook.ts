import {
  CustomForecastIndicatorResponse,
  useCreateCustomForecastIndicator,
  useDeleteCustomForecastIndicator,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorsViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';

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

  const createCustomForecastIndicator = async ({ targetIndicatorId }: { targetIndicatorId: string }) => {
    const body = {
      customForecastIndicatorName: '새로운 예측 지표',
      targetIndicatorId,
    };

    const customForecastIndicatorId = await createCustomForecastIndicatorTrigger(body);
    return customForecastIndicatorId;
  };

  const deleteIndicatorBoardMetadata = async (customForecastIndicatorId: string) => {
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
    deleteIndicatorBoardMetadata,
  };
};
