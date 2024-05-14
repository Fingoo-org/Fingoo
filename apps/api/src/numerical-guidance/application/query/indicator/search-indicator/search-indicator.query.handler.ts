import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchIndicatorQuery } from './search-indicator.query';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { IndicatorDtoType } from 'src/utils/type/type-definition';
import { SearchIndicatorByTypeAndSymbolPort } from '../../../port/persistence/indicator/search-indicator-by-type-and-symbol.port';

@Injectable()
@QueryHandler(SearchIndicatorQuery)
export class SearchIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('SearchIndicatorBySymbolPort')
    private readonly searchIndicatorBySymbolPort: SearchIndicatorBySymbolPort,
    @Inject('SearchIndicatorByTypeAndSymbolPort')
    private readonly searchIndicatorByTypeAndSymbolPort: SearchIndicatorByTypeAndSymbolPort,
  ) {}

  async execute(query: SearchIndicatorQuery): Promise<IndicatorDtoType | IndicatorDtoType[]> {
    const { symbol, type } = query;
    if (type === 'none') {
      return await this.searchIndicatorBySymbolPort.searchIndicatorBySymbol(symbol);
    }
    return await this.searchIndicatorByTypeAndSymbolPort.searchIndicatorByTypeAndSymbol(symbol, type);
  }
}
