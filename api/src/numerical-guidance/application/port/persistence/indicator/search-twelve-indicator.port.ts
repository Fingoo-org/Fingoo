import { SearchedIndicatorsDto } from '../../../query/indicator/search-twelve-indicator/dto/searched-indicators.dto';

export interface SearchTwelveIndicatorPort {
  searchIndicator(symbol: string): Promise<SearchedIndicatorsDto>;
}
