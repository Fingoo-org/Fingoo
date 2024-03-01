import { Interval } from '../../../../../utils/type/type-definition';

export interface LoadHistoryIndicatorPort {
  loadHistoryIndicator(interval: Interval, take: number, endDate: string);
}
