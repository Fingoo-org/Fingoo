import { IndicatorListDto } from '../../query/get-indicator-list/indicator-list.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(): Promise<IndicatorListDto>;
}
