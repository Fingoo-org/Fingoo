import { IQuery } from '@nestjs/cqrs';
import { Interval } from '../../../../utils/type/type-definition';

export class GetHistoryIndicatorQuery implements IQuery {
  constructor(
    readonly indicatorId: string,
    readonly interval: Interval,
    readonly startDate: string,
    readonly endDate: string,
  ) {}
}
