import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface UpdateSourceIndicatorsInformationPort {
  updateSourceIndicatorsInformation(customForecastIndicator: CustomForecastIndicator): Promise<void>;
}
