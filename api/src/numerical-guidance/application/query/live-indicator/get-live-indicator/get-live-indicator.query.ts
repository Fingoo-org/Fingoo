import { IQuery } from '@nestjs/cqrs';
import { IndicatorType, Interval } from '../../../../../utils/type/type-definition';

export class GetLiveIndicatorQuery implements IQuery {
  constructor(
    readonly indicatorId: string,
    readonly interval: Interval,
    readonly startDate: string,
    readonly indicatorType: IndicatorType,
  ) {}
}
