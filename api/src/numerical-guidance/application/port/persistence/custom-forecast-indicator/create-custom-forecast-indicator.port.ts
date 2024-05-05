import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface CreateCustomForecastIndicatorPort {
  createCustomForecastIndicator(customForecastIndicator: CustomForecastIndicator, memberId: string): Promise<string>;
}
