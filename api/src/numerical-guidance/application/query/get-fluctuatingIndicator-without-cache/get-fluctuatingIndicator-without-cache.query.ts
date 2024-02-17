import { IQuery } from '@nestjs/cqrs';
import { Interval, Market } from 'src/utils/type/type-definition';

export class GetFluctuatingIndicatorWithoutCacheQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly ticker: string,
    readonly interval: Interval,
    readonly market: Market,
    readonly endDate: string,
  ) {}
}
