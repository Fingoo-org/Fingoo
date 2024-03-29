import { Interval } from '../../../../../utils/type/type-definition';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../query/history-indicator/dto/history-indicator.dto';

export interface LoadHistoryIndicatorPort {
  loadHistoryIndicator(
    indicatorId: string,
    interval: Interval,
    dataCount: number,
    endDate: string,
  ): Promise<CursorPageDto<HistoryIndicatorDto>>;
}
