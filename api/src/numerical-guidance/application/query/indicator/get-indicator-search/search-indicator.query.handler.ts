import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { SearchIndicatorQuery } from './search-indicator.query';
import { SearchIndicatorPort } from '../../../port/persistence/indicator/search-indicator.port';
import { SearchedIndicatorsDto } from './dto/searched-indicators.dto';

@Injectable()
@QueryHandler(SearchIndicatorQuery)
export class SearchIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('SearchIndicatorPort')
    private readonly searchIndicatorPort: SearchIndicatorPort,
  ) {}

  async execute(query: SearchIndicatorQuery): Promise<SearchedIndicatorsDto> {
    const { symbol } = query;
    return this.searchIndicatorPort.searchIndicator(symbol);
  }
}
