import ToggleState from '../../view/molecule/toggle-state/toggle-state';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useCustomForecastIndicatorsValueBySelectedMetadata } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-value.hook';

export default function ForecastTypeToggle() {
  const { selectedCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();
  const { customForecastTypes } = useCustomForecastIndicatorsValueBySelectedMetadata();

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
