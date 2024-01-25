import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadFluctuatingIndicatorPort {
  loadFluctuatingIndicator(
    dateCount: number,
    ticker: string,
    interval: string,
    market: string,
  ): Promise<FluctuatingIndicatorsDto>;
}
