import { FluctuatingIndicatorDto } from '../../query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export interface LoadFluctuatingIndicatorPort {
  loadFluctuatingIndicator(
    dateCount: number,
    ticker: string,
    interval: string,
    market: string,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto>;
}
