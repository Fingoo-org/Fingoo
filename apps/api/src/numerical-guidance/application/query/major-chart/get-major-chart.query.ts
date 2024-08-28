import { IQuery } from '@nestjs/cqrs';

export class GetMajorChartQuery implements IQuery {
  constructor(readonly country: string) {}
}
