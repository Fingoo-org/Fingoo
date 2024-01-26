import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface CachingFluctuatingIndicatorPort {
  cachingFluctuatingIndicator(
    fluctuatingIndicatorKey: string,
    fluctuatingIndicatorsDto: FluctuatingIndicatorsDto,
  ): Promise<void>;
}
