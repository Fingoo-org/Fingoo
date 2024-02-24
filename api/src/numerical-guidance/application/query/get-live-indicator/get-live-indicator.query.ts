import { IQuery } from '@nestjs/cqrs';
import { Interval } from '../../../../utils/type/type-definition';

export class GetLiveIndicatorQuery implements IQuery {
  constructor(
    readonly indicatorId: string,
    readonly interval: Interval,
  ) {}
}
