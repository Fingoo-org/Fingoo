import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { useCreateCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/custom-forecast-indicator/create-custom-foreacst-indicator.store';

export const useCreatingCustomForecastIndicator = () => {
  const targetIndicatorId = useCreateCustomForecastIndicatorStore((state) => state.targetIndicatorId);
  const sourceIndicators = useCreateCustomForecastIndicatorStore((state) => state.sourceIndicators);
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

  const addSourceIndicator = (indicator: Indicator) => {
    setState({
      sourceIndicators: [
        ...sourceIndicators,
        {
          sourceIndicatorId: indicator.id,
          indicatorType: indicator.indicatorType,
          weight: 0,
          symbol: indicator.symbol,
        },
      ],
    });
  };

  const deleteSourceIndicator = (indicatorId: string) => {
    setState({
      sourceIndicators: sourceIndicators.filter((indicator) => indicator.sourceIndicatorId !== indicatorId),
    });
  };

  const includeSourceIndicator = (indicatorId: string) => {
    return sourceIndicators.some((indicator) => indicator.sourceIndicatorId === indicatorId);
  };

  const updateSourceIndicatorWeight = (indicatorId: string, weight: number) => {
    setState({
      sourceIndicators: sourceIndicators.map((indicator) => {
        if (indicator.sourceIndicatorId === indicatorId) {
          return {
            ...indicator,
            weight,
          };
        }

        return indicator;
      }),
    });
  };

  return {
    targetIndicatorId,
    sourceIndicators,
    selectTargetIndicator,
    deselectTargetIndicator,
    addSourceIndicator,
    deleteSourceIndicator,
    includeSourceIndicator,
    updateSourceIndicatorWeight,
  };
};
