import { FluctuatingIndicatorDto } from '../../query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export interface LoadLiveIndicatorPort {
  loadLiveIndicator(ticker: string, interval: string, market: string): Promise<FluctuatingIndicatorDto>;
}
