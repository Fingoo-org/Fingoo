import { FluctuatingIndicatorsDto } from '../../query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

export interface LoadFluctuatingIndicatorsPort {
  loadFluctuatingIndicators(): Promise<FluctuatingIndicatorsDto[]>;
}
