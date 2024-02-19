import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadUserIndicatorBoardMetadataListPort } from '../../port/persistence/load-user-indicator-board-metadata-list.port';
import { GetUserIndicatorBoardMetadataListQuery } from './get-user-indicator-board-metadata-list.query';

@Injectable()
@QueryHandler(GetUserIndicatorBoardMetadataListQuery)
export class GetUserIndicatorBoardMetadataListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadUserIndicatorBoardMetadataListPort')
    private readonly loadUserIndicatorBoardMetadataPort: LoadUserIndicatorBoardMetadataListPort,
  ) {}
  async execute(
    getUserIndicatorBoardMetadataQuery: GetUserIndicatorBoardMetadataListQuery,
  ): Promise<IndicatorBoardMetadata[]> {
    const memberId = getUserIndicatorBoardMetadataQuery.memberId;
    const userIndicatorBoardMetadataList: IndicatorBoardMetadata[] =
      await this.loadUserIndicatorBoardMetadataPort.loadUserIndicatorBoardMetadataList(memberId);
    return userIndicatorBoardMetadataList;
  }
}
