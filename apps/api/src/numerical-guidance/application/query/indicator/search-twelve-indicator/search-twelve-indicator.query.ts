import { IQuery } from '@nestjs/cqrs';

export class SearchTwelveIndicatorQuery implements IQuery {
  constructor(readonly symbol: string) {}
}
