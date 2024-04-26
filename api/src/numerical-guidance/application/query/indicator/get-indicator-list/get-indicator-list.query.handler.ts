import { GetIndicatorListQuery } from './get-indicator-list.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadIndicatorListPort } from '../../../port/persistence/indicator/load-indicator-list.port';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';

@Injectable()
@QueryHandler(GetIndicatorListQuery)
export class GetIndicatorListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorListPort')
    private readonly loadIndicatorListPort: LoadIndicatorListPort,
  ) {}

  async execute(query: GetIndicatorListQuery): Promise<CursorPageDto<IndicatorDtoType>> {
    const { type, cursorToken } = query;
    return this.loadIndicatorListPort.loadIndicatorList(type, cursorToken);
  }
}
