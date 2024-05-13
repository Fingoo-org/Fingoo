import { IndicatorDtoType, IndicatorType } from '../../../../../utils/type/type-definition';

export interface LoadIndicatorPort {
  loadIndicator(id: string, indicatorType: IndicatorType): Promise<IndicatorDtoType>;
}
