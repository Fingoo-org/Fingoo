import { IndicatorDto } from '../../../query/get-indicator/indicator.dto';

export interface LoadIndicatorPort {
  loadIndicator(id: string): Promise<IndicatorDto>;
}
