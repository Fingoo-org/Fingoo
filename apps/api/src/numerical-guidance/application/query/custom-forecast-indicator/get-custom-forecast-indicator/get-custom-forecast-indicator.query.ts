import { IQuery } from '@nestjs/cqrs';

export class GetCustomForecastIndicatorQuery implements IQuery {
  constructor(readonly customForecastIndicatorId: string) {}
}
