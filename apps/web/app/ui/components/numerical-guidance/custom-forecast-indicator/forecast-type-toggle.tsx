import ToggleState from '../../view/molecule/toggle-state/toggle-state';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useCustomForecastIndicatorsValueByMetadata } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-value-by-metadata.hook';

export default function ForecastTypeToggle() {
  const { selectedCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();
  const { customForecastTypes } = useCustomForecastIndicatorsValueByMetadata();

  const forecastType = customForecastTypes?.find(
    (item) => item.customForecastIndicatorId === selectedCustomForecastIndicator?.id,
  )?.forecastType;

  return (
    <ToggleState
      state={['단일', '멀티']}
      selectedState={forecastType ? (forecastType === 'multi' ? '멀티' : '단일') : '단일'}
    />
  );
}
