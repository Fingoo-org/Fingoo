import { IndicatorDto } from '../../../query/indicator/dto/indicator.dto';

export interface LoadIndicatorPort {
  loadIndicator(id: string): Promise<IndicatorDto>;
}
