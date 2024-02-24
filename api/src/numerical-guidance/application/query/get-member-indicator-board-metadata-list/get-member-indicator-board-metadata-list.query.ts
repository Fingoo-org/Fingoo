import { IQuery } from '@nestjs/cqrs';

export class GetMemberIndicatorBoardMetadataListQuery implements IQuery {
  constructor(readonly memberId: number) {}
}
