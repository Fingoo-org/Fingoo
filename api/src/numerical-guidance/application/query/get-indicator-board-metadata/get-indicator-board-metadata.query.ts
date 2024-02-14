import { IQuery } from '@nestjs/cqrs';

export class GetIndicatorBoardMetadataQuery implements IQuery {
  constructor(readonly id: string) {}
}
