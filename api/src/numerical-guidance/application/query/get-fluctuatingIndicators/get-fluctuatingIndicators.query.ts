import { IQuery } from '@nestjs/cqrs';
import { FluctuatingIndicatorInfo } from '../../../infrastructure/api/dto/get-fluctuatingIndicators.dto';

export class GetFluctuatingIndicatorsQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly fluctuatingIndicatorInfos: FluctuatingIndicatorInfo[],
  ) {}
}
