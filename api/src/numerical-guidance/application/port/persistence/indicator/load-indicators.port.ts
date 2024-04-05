import { IndicatorsDto } from '../../../query/indicator/basic/dto/indicators.dto';

export interface LoadIndicatorsPort {
  loadIndicators(): Promise<IndicatorsDto>;
}
