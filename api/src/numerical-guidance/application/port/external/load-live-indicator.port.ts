import { LiveIndicatorDto } from '../../query/get-live-indicator/live-indicator.dto';

export interface LoadLiveIndicatorPort {
  loadLiveIndicator(indicatorId: string, ticker: string, interval: string, market: string): Promise<LiveIndicatorDto>;
}
