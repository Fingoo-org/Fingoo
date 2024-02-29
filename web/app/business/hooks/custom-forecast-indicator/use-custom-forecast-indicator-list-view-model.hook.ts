import {
  useCreateCustomForecastIndicator,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorsViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo, useRef } from 'react';
import { calculateIsPending } from '@/app/utils/helper';

export const useCustomForecastIndicatorListViewModel = () => {
  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();
  const { trigger: createCustomForecastIndicatorTrigger, isMutating: isCreateCustomForecastIndicatorMutating } =
    useCreateCustomForecastIndicator();
  const isPending = useRef(false);

  isPending.current = calculateIsPending(isValidating, isCreateCustomForecastIndicatorMutating);

  const convertedCustomForecastIndicatorList = useMemo(() => {
    if (!customForecastIndicatorList) return undefined;

    return convertCustomForecastIndicatorsViewModel(customForecastIndicatorList);
  }, [customForecastIndicatorList]);

  const createCustomForecastIndicator = async (targetIndicatorId: string) => {
    const body = {
      name: '새로운 예측 지표',
      targetIndicatorId,
    };

    await createCustomForecastIndicatorTrigger(body);
  };

  return {
    customForecastIndicatorList: convertedCustomForecastIndicatorList,
    createCustomForecastIndicator,
    isPending: isPending.current,
  };
};
