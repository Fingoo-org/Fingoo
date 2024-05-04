import { IQuery } from '@nestjs/cqrs';

export class SearchIndicatorIdBySymbolQuery implements IQuery {
  constructor(readonly symbol: string) {}
}
