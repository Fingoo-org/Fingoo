import { IQuery } from '@nestjs/cqrs';
import { Interval, Market } from '../../../../utils/type/type-definition';

export class GetLiveIndicatorQuery implements IQuery {
  constructor(
    readonly ticker: string,
    readonly market: Market,
    readonly interval: Interval,
  ) {}
}
