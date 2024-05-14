import { IQuery } from '@nestjs/cqrs';
import { IndicatorType } from '../../../../../utils/type/type-definition';
import { DEFAULT_INDICATOR_TYPE } from '../../../../api/indicator/dto/search-indicator.dto';

export class SearchIndicatorQuery implements IQuery {
  constructor(
    readonly symbol: string,
    readonly type: IndicatorType | DEFAULT_INDICATOR_TYPE,
  ) {}
}
