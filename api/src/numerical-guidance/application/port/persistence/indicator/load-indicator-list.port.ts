import { IndicatorType } from '../../../../../utils/type/type-definition';
import { BondsDto } from '../../../query/indicator/dto/bonds.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(type: IndicatorType): Promise<BondsDto[]>;
}
