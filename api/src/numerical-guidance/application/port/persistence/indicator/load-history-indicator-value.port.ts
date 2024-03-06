import { Interval } from '../../../../../utils/type/type-definition';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../query/get-history-indicator/history-indicator.dto';

export interface LoadHistoryIndicatorPort {
  loadHistoryIndicator(interval: Interval, take: number, endDate: string): Promise<CursorPageDto<HistoryIndicatorDto>>;
}
