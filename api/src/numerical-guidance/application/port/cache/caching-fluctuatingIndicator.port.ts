import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface CachingFluctuatingIndicatorPort {
  cachingFluctuatingIndicator(ticker: string, fluctuatingIndicatorsDto: FluctuatingIndicatorsDto): Promise<void>;
}
