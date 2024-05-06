import { IQuery } from '@nestjs/cqrs';

export class SearchIndicatorBySymbolQuery implements IQuery {
  constructor(readonly symbol: string) {}
}
