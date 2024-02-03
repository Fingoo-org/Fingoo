import { IQuery } from '@nestjs/cqrs';

export class GetIndicatorBoardMetaDataQuery implements IQuery {
  constructor(readonly id: number) {}
}
