import { FluctuatingIndicatorsWithoutCacheDto } from '../../query/get-fluctuatingIndicators-without-cache/fluctuatingIndicators-without-cache.dto';

export interface LoadFluctuatingIndicatorWithoutCachePort {
  loadFluctuatingIndicatorWithoutCache(
    dataCount: number,
    ticker: string,
    market: string,
  ): Promise<FluctuatingIndicatorsWithoutCacheDto>;
}
