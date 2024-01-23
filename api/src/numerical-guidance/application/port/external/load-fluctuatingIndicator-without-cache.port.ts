import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadFluctuatingIndicatorWithoutCachePort {
  loadFluctuatingIndicatorWithoutCache(
    dataCount: number,
    ticker: string,
    market: string,
  ): Promise<FluctuatingIndicatorsDto>;
}
