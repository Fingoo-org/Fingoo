import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadCachedFluctuatingIndicatorPort {
  loadCachedFluctuatingIndicator(ticker: string): Promise<FluctuatingIndicatorsDto | null>;
}
