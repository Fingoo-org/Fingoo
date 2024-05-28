import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { useCreateCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/custom-forecast-indicator/create-custom-foreacst-indicator.store';

export const useCreatingCustomForecastIndicator = () => {
  const targetIndicatorId = useCreateCustomForecastIndicatorStore((state) => state.targetIndicatorId);
  const { setState } = useCreateCustomForecastIndicatorStore((state) => state.actions);

  const selectTargetIndicator = (indicator: Indicator) => {
    setState({
      targetIndicatorId: indicator.id,
      targetIndicatorType: indicator.indicatorType,
    });
  };

  const deselectTargetIndicator = () => {
    setState({
      targetIndicatorId: undefined,
      targetIndicatorType: undefined,
    });
  };

  return {
    targetIndicatorId,
    selectTargetIndicator,
    deselectTargetIndicator,
  };
};
