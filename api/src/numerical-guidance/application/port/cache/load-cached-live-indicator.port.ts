import { LiveIndicatorDto } from '../../query/get-live-indicator/live-indicator.dto';

export interface LoadCachedLiveIndicatorPort {
  loadCachedLiveIndicator(ticker: string): Promise<LiveIndicatorDto | null>;
}
