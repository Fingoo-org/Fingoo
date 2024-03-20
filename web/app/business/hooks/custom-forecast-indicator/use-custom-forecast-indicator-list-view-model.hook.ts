import {
  useCreateCustomForecastIndicator,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorsViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';

export const useCustomForecastIndicatorListViewModel = () => {
  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();
  const { trigger: createCustomForecastIndicatorTrigger, isMutating: isCreateCustomForecastIndicatorMutating } =
    useCreateCustomForecastIndicator();

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

    await createCustomForecastIndicatorTrigger(body);
  };

  return {
    customForecastIndicatorList: convertedCustomForecastIndicatorList,
    createCustomForecastIndicator,
    isPending,
  };
};
