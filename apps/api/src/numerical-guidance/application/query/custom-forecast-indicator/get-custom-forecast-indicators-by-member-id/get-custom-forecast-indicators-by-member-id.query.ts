import { IQuery } from '@nestjs/cqrs';

export class GetCustomForecastIndicatorsByMemberIdQuery implements IQuery {
  constructor(readonly memberId: string) {}
}
