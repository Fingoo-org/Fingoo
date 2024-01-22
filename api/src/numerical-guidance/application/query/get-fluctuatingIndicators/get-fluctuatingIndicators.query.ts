import { IQuery } from '@nestjs/cqrs';

export class GetFluctuatingIndicatorsQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly tickers: string[],
    readonly type: string,
    readonly market: string,
  ) {}
}
