import { IQuery } from '@nestjs/cqrs';

export class SearchIndicatorQuery implements IQuery {
  constructor(readonly symbol: string) {}
}
