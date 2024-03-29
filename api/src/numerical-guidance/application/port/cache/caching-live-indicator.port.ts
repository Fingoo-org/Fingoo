import { LiveKRXIndicatorDto } from '../../query/live-indicator/dto/live-indicator.dto';

export interface CachingLiveIndicatorPort {
  cachingLiveIndicator(fluctuatingIndicatorKey: string, fluctuatingIndicatorDto: LiveKRXIndicatorDto): Promise<void>;
}
