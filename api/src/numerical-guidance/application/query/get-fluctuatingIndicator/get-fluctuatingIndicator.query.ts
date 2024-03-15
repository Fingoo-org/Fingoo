import { IQuery } from '@nestjs/cqrs';
import { Interval, Market } from 'src/utils/type/type-definition';

export class GetFluctuatingIndicatorQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly ticker: string,
    readonly market: Market,
    readonly interval: Interval,
    readonly endDate: string,
  ) {}
}