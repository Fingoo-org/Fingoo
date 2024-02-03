import { FluctuatingIndicatorDto } from '../../query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export interface CachingFluctuatingIndicatorPort {
  cachingFluctuatingIndicator(
    fluctuatingIndicatorKey: string,
    fluctuatingIndicatorDto: FluctuatingIndicatorDto,
  ): Promise<void>;
}
