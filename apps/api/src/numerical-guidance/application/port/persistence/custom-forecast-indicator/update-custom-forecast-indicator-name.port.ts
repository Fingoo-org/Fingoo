import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface UpdateCustomForecastIndicatorNamePort {
  updateCustomForecastIndicatorName(customForecastIndicator: CustomForecastIndicator): Promise<void>;
}
