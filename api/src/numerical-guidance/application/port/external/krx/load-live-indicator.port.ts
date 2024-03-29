import { LiveKRXIndicatorDto } from '../../../query/live-indicator/dto/live-indicator.dto';

export interface LoadLiveIndicatorPort {
  loadLiveIndicator(
    indicatorId: string,
    ticker: string,
    interval: string,
    market: string,
  ): Promise<LiveKRXIndicatorDto>;
}
