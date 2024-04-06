import { GetIndicatorListQuery } from './get-indicator-list.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadIndicatorListPort } from '../../port/persistence/indicator/load-indicator-list.port';
import { BondsDto } from './dto/bonds.dto';

@Injectable()
@QueryHandler(GetIndicatorListQuery)
export class GetIndicatorListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorListPort')
    private readonly loadIndicatorListPort: LoadIndicatorListPort,
  ) {}

  async execute(query: GetIndicatorListQuery): Promise<BondsDto[]> {
    return this.loadIndicatorListPort.loadIndicatorList(query.type);
  }
}
