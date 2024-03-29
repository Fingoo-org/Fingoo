import { LiveKRXIndicatorDto } from '../../query/live-indicator/dto/live-indicator.dto';

export interface LoadCachedLiveIndicatorPort {
  loadCachedLiveIndicator(ticker: string): Promise<LiveKRXIndicatorDto | null>;
}
