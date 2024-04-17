import ToggleState from '../../view/molocule/toggle-state/toggle-state';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';

export default function ForecastTypeToggle() {
  const { selectedCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();
  const { customForecastTypes } = useCustomForecastIndicatorsValueViewModel();

  const forecastType = customForecastTypes?.find(
    (item) => item.customForecastIndicatorId === selectedCustomForecastIndicator.id,
  )?.forecastType;

  return (
    <ToggleState
      state={['단일', '멀티']}
      selectedState={forecastType ? (forecastType === 'multi' ? '멀티' : '단일') : '단일'}
    />
  );
}
