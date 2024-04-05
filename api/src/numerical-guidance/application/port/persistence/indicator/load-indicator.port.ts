import { IndicatorDto } from '../../../query/indicator/basic/dto/indicator.dto';

export interface LoadIndicatorPort {
  loadIndicator(id: string): Promise<IndicatorDto>;
}
