import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface UpdateSourceIndicatorsAndWeightsPort {
  updateSourceIndicatorsAndWeights(customForecastIndicator: CustomForecastIndicator): Promise<void>;
}
