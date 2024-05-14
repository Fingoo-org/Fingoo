import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface LoadCustomForecastIndicatorPort {
  loadCustomForecastIndicator(customForecastIndicatorId: string): Promise<CustomForecastIndicator>;
}
