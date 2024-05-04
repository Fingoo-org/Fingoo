import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchIndicatorIdBySymbolQuery } from './get-indicator-id-by-symbol.query';
import { SearchIndicatorIdBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-id-by-symbol.port';

@Injectable()
@QueryHandler(SearchIndicatorIdBySymbolQuery)
export class SearchIndicatorIdBySymbolQueryHandler implements IQueryHandler {
  constructor(
    @Inject('SearchIndicatorIdBySymbolPort')
    private readonly searchIndicatorIdBySymbolPort: SearchIndicatorIdBySymbolPort,
  ) {}

  async execute(query: SearchIndicatorIdBySymbolQuery): Promise<string> {
    const { symbol } = query;
    return this.searchIndicatorIdBySymbolPort.searchIndicatorIdBySymbol(symbol);
  }
}
