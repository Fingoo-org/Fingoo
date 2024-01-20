import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadFluctuatingIndicatorPort {
  loadFluctuatingIndicator(
    dataCount: number,
    type: string,
    ticker: string,
    market: string,
  ): Promise<FluctuatingIndicatorsDto>;
}
