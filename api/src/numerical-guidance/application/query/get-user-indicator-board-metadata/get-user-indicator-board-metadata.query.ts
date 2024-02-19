import { IQuery } from '@nestjs/cqrs';

export class GetUserIndicatorBoardMetadataQuery implements IQuery {
  constructor(readonly memberId: number) {}
}
