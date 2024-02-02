import { FluctuatingIndicatorDto } from '../../query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export interface LoadCachedFluctuatingIndicatorPort {
  loadCachedFluctuatingIndicator(ticker: string): Promise<FluctuatingIndicatorDto | null>;
}
