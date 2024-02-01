import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIndicatorListQuery } from './get-indicator-list.query';
import { LoadIndicatorListPort } from '../../port/indicator-list/load-indicator-list.port';
import { IndicatorListDto } from './indicator-list.dto';

@Injectable()
@QueryHandler(GetIndicatorListQuery)
export class GetIndicatorListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorListPort')
    private readonly loadIndicatorListPort: LoadIndicatorListPort,
  ) {}

  async execute(): Promise<IndicatorListDto> {
    return await this.loadIndicatorListPort.loadIndicatorList();
  }
}
