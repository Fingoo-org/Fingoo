import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchIndicatorBySymbolQuery } from './search-indicator-by-symbol.query';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { IndicatorDtoType } from 'src/utils/type/type-definition';

@Injectable()
@QueryHandler(SearchIndicatorBySymbolQuery)
export class SearchIndicatorBySymbolQueryHandler implements IQueryHandler {
  constructor(
    @Inject('SearchIndicatorBySymbolPort')
    private readonly searchIndicatorBySymbolPort: SearchIndicatorBySymbolPort,
  ) {}

  async execute(query: SearchIndicatorBySymbolQuery): Promise<IndicatorDtoType> {
    const { symbol } = query;
    return this.searchIndicatorBySymbolPort.searchIndicatorBySymbol(symbol);
  }
}
