import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { SearchTwelveIndicatorQuery } from './search-twelve-indicator.query';
import { SearchTwelveIndicatorPort } from '../../../port/persistence/indicator/search-twelve-indicator.port';
import { SearchedIndicatorsDto } from './dto/searched-indicators.dto';

@Injectable()
@QueryHandler(SearchTwelveIndicatorQuery)
export class SearchTwelveIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('SearchTwelveIndicatorPort')
    private readonly searchTwelveIndicatorPort: SearchTwelveIndicatorPort,
  ) {}

  async execute(query: SearchTwelveIndicatorQuery): Promise<SearchedIndicatorsDto> {
    const { symbol } = query;
    return this.searchTwelveIndicatorPort.searchIndicator(symbol);
  }
}
