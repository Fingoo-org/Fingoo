import { IndicatorsDto } from '../../../query/get-indicator/indicators.dto';

export interface LoadIndicatorsPort {
  loadIndicators(): Promise<IndicatorsDto>;
}
