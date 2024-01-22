import { FluctuatingIndicatorsWithoutCacheDto } from '../../query/get-fluctuatingIndicator-without-cache/flucruatingIndicator-without-cache.dto';

export interface LoadFluctuatingIndicatorWithoutCachePort {
  loadFluctuatingIndicatorWithoutCache(
    dataCount: number,
    ticker: string,
    market: string,
    type: string,
  ): Promise<FluctuatingIndicatorsWithoutCacheDto>;
}
