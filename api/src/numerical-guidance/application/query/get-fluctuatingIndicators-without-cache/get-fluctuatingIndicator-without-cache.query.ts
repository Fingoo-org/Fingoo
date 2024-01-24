import { IQuery } from '@nestjs/cqrs';

export class GetFluctuatingIndicatorWithoutCacheQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly ticker: string,
    readonly market: string,
  ) {}
}
