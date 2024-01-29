import { IndicatorListDto } from '../../query/get-indicator-list/indicator-list.dto';

export interface GetIndicatorListPort {
  getIndicatorList(): Promise<IndicatorListDto>;
}
