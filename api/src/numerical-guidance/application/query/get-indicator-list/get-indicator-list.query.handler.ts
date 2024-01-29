import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIndicatorListQuery } from './get-indicator-list.query';
import { GetIndicatorListPort } from '../../port/indicator-list/get-indicator-list.port';
import { IndicatorListDto } from './indicator-list.dto';

@Injectable()
@QueryHandler(GetIndicatorListQuery)
export class GetIndicatorListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('GetIndicatorListPort')
    private readonly getIndicatorListPort: GetIndicatorListPort,
  ) {}

  async execute(): Promise<IndicatorListDto> {
    return await this.getIndicatorListPort.getIndicatorList();
  }
}
