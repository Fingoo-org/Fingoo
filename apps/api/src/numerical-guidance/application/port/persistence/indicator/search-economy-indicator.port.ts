import { IndicatorDtoType } from '../../../../../utils/type/type-definition';

export interface SearchEconomyIndicatorPort {
  searchEconomicIndicator(symbol: string): Promise<IndicatorDtoType[]>;
}
