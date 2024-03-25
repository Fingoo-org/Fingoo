import { IndicatorValue } from 'src/utils/type/type-definition';

export interface LoadCustomForecastIndicatorValuesPort {
  loadCustomForecastIndicatorValues(customForecastIndicatorId: string): Promise<IndicatorValue[]>;
}
