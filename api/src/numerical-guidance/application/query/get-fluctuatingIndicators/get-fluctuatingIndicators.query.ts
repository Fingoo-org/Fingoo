import { IQuery } from '@nestjs/cqrs';

export class GetFluctuatingIndicatorsQuery implements IQuery {
  constructor(
    readonly dataCount: number,
    readonly ticker: string,
    readonly market: string,
    readonly interval: string,
    readonly endDate: string,
  ) {}
}
