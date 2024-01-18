import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadCachedFluctuatingIndicatorsPort {
  loadCachedFluctuatingIndicators(): Promise<FluctuatingIndicatorsDto[] | null>;
}
