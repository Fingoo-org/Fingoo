import { IndicatorsDto } from '../../../query/indicator/dto/indicators.dto';

export interface LoadIndicatorsPort {
  loadIndicators(): Promise<IndicatorsDto>;
}
