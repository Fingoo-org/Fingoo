import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadMemberIndicatorBoardMetadataListPort } from '../../port/persistence/indicator-board-metadata/load-member-indicator-board-metadata-list.port';
import { GetMemberIndicatorBoardMetadataListQuery } from './get-member-indicator-board-metadata-list.query';

@Injectable()
@QueryHandler(GetMemberIndicatorBoardMetadataListQuery)
export class GetMemberIndicatorBoardMetadataListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadMemberIndicatorBoardMetadataListPort')
    private readonly loadMemberIndicatorBoardMetadataPort: LoadMemberIndicatorBoardMetadataListPort,
  ) {}
  async execute(
    getMemberIndicatorBoardMetadataQuery: GetMemberIndicatorBoardMetadataListQuery,
  ): Promise<IndicatorBoardMetadata[]> {
    const memberId = getMemberIndicatorBoardMetadataQuery.memberId;
    const MemberIndicatorBoardMetadataList: IndicatorBoardMetadata[] =
      await this.loadMemberIndicatorBoardMetadataPort.loadMemberIndicatorBoardMetadataList(memberId);
    return MemberIndicatorBoardMetadataList;
  }
}
