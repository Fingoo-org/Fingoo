import { IndicatorDtoType } from 'src/utils/type/type-definition';

export interface SearchIndicatorBySymbolPort {
  searchIndicatorBySymbol(symbol: string): Promise<IndicatorDtoType>;
}
