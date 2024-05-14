import { IndicatorDtoType, IndicatorType } from '../../../../../utils/type/type-definition';

export interface SearchIndicatorByTypeAndSymbolPort {
  searchIndicatorByTypeAndSymbol(symbol: string, type: IndicatorType): Promise<IndicatorDtoType[]>;
}
