import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import {
  useCreateCustomForecastIndicator,
  useUpdateSourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useCreateCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/custom-forecast-indicator/create-custom-foreacst-indicator.store';

export const useCreatingCustomForecastIndicator = () => {
  const targetIndicatorInfo = useCreateCustomForecastIndicatorStore((state) => state.targetIndicatorInfo);
  const sourceIndicators = useCreateCustomForecastIndicatorStore((state) => state.sourceIndicators);
  const { setState } = useCreateCustomForecastIndicatorStore((state) => state.actions);

  const { trigger: createCustomForecastIndicatorTrigger } = useCreateCustomForecastIndicator();
  const { trigger: updateSourceIndicatorTrigger } = useUpdateSourceIndicator();

  const selectTargetIndicator = (indicator: Indicator) => {
    setState({
      targetIndicatorInfo: indicator,
    });
  };

  const deselectTargetIndicator = () => {
    setState({
      targetIndicatorInfo: undefined,
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

  const craeteCustomForecastIndicator = async () => {
    if (targetIndicatorInfo === undefined) return;

    const id = await createCustomForecastIndicatorTrigger({
      customForecastIndicatorName: `${targetIndicatorInfo.symbol} 예측 지표`,
      targetIndicatorId: targetIndicatorInfo.id,
      targetIndicatorType: targetIndicatorInfo.indicatorType,
    });

    if (sourceIndicators.length === 0) return;

    await updateSourceIndicatorTrigger({
      sourceIndicatorsInformation: sourceIndicators,
      customForecastIndicatorId: id,
    });
  };

  return {
    targetIndicatorId: targetIndicatorInfo?.id,
    sourceIndicators,
    selectTargetIndicator,
    deselectTargetIndicator,
    addSourceIndicator,
    deleteSourceIndicator,
    includeSourceIndicator,
    updateSourceIndicatorWeight,
    craeteCustomForecastIndicator,
  };
};
