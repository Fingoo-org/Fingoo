import { IQuery } from '@nestjs/cqrs';

export class GetUserIndicatorBoardMetadataListQuery implements IQuery {
  constructor(readonly memberId: number) {}
}
