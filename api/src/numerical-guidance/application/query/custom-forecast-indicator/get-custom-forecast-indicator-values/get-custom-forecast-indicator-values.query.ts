import { IQuery } from '@nestjs/cqrs';

export class GetCustomForecastIndicatorValuesQuery implements IQuery {
  constructor(readonly customForecastIndicatorId: string) {}
}
