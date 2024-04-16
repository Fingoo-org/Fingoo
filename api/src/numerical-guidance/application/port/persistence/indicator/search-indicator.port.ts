import { SearchedIndicatorsDto } from '../../../query/indicator/get-indicator-search/dto/searched-indicators.dto';

export interface SearchIndicatorPort {
  searchIndicator(symbol: string): Promise<SearchedIndicatorsDto>;
}
