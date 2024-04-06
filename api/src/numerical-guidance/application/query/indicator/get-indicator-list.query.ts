import { IQuery } from '@nestjs/cqrs';
import { IndicatorType } from '../../../../utils/type/type-definition';

export class GetIndicatorListQuery implements IQuery {
  constructor(readonly type: IndicatorType) {}
}
