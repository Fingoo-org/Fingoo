import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadUserIndicatorBoardMetadataPort } from '../../port/persistence/load-user-indicator-board-metadata.port';
import { GetUserIndicatorBoardMetadataQuery } from './get-user-indicator-board-metadata.query';

@Injectable()
@QueryHandler(GetUserIndicatorBoardMetadataQuery)
export class GetUserIndicatorBoardMetadataQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadUserIndicatorBoardMetadataPort')
    private readonly loadUserIndicatorBoardMetadataPort: LoadUserIndicatorBoardMetadataPort,
  ) {}
  async execute(
    getUserIndicatorBoardMetadataQuery: GetUserIndicatorBoardMetadataQuery,
  ): Promise<IndicatorBoardMetadata[]> {
    const memberId = getUserIndicatorBoardMetadataQuery.memberId;
    const userIndicatorBoardMetadataList: IndicatorBoardMetadata[] =
      await this.loadUserIndicatorBoardMetadataPort.loadUserIndicatorBoardMetadataPort(memberId);
    return userIndicatorBoardMetadataList;
  }
}
