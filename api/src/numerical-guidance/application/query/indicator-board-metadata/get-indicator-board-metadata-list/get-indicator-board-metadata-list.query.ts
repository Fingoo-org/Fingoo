import { IQuery } from '@nestjs/cqrs';

export class GetIndicatorBoardMetadataListQuery implements IQuery {
  constructor(readonly memberId: string) {}
}
