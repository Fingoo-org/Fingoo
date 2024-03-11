import { LiveIndicatorDto } from '../../query/get-live-indicator/live-indicator.dto';

export interface CachingLiveIndicatorPort {
  cachingLiveIndicator(fluctuatingIndicatorKey: string, fluctuatingIndicatorDto: LiveIndicatorDto): Promise<void>;
}
